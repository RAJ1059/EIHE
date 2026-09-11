import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";
import * as bcrypt from "bcrypt";
import type { StringValue } from "ms";
import { UsersService } from "../users/users.service";
import { Role } from "../../common/enums/role.enum";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";
import type { AuthenticatedUser } from "./strategies/jwt.strategy";

const SALT_ROUNDS = 12;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getGoogleClient(): { client: OAuth2Client; clientId: string } {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    if (!clientId) {
      throw new ServiceUnavailableException(
        "Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID to server/.env.",
      );
    }
    if (!this.googleClient) {
      this.googleClient = new OAuth2Client(clientId);
    }
    return { client: this.googleClient, clientId };
  }

  async loginWithGoogle(idToken: string): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const { client, clientId } = this.getGoogleClient();

    let payload: { sub: string; email?: string; email_verified?: boolean; name?: string };
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: clientId });
      const verified = ticket.getPayload();
      if (!verified) throw new Error("Empty token payload");
      payload = verified;
    } catch {
      throw new UnauthorizedException("Could not verify this Google sign-in. Please try again.");
    }

    if (!payload.email || !payload.email_verified) {
      throw new UnauthorizedException("This Google account has no verified email.");
    }

    let user = await this.usersService.findByGoogleId(payload.sub);

    if (!user) {
      const existingByEmail = await this.usersService.findByEmail(payload.email);
      if (existingByEmail) {
        await this.usersService.linkGoogleId(existingByEmail._id, payload.sub);
        user = existingByEmail;
      } else {
        user = await this.usersService.createFromGoogle({
          name: payload.name ?? payload.email,
          email: payload.email,
          googleId: payload.sub,
        });
      }
    }

    if (!user.isActive) {
      throw new UnauthorizedException("This account has been deactivated.");
    }

    const tokens = await this.issueTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user: this.toPublicUser(user), tokens };
  }

  async register(dto: RegisterDto): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: Role.STUDENT,
    });

    const tokens = await this.issueTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user: this.toPublicUser(user), tokens };
  }

  async login(dto: LoginDto): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        "This account signs in with Google. Use the Sign in with Google button instead.",
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const tokens = await this.issueTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user: this.toPublicUser(user), tokens };
  }

  async refresh(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId, true);
    if (!user || !user.isActive || !user.hashedRefreshToken) {
      throw new UnauthorizedException("Please log in again.");
    }

    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!matches) {
      // Possible token reuse/theft — revoke the stored token defensively.
      await this.usersService.setHashedRefreshToken(user._id, null);
      throw new UnauthorizedException("Please log in again.");
    }

    return this.issueTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setHashedRefreshToken(userId, null);
  }

  verifyRefreshToken(token: string): { sub: string } {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Please log in again.");
    }
  }

  private async issueTokens(user: AuthenticatedUser): Promise<AuthTokens> {
    const payload = { sub: user.userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_SECRET"),
      expiresIn: (this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") ??
        "15m") as StringValue,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: (this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ??
        "30d") as StringValue,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.usersService.setHashedRefreshToken(user.userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  private toPublicUser(user: { _id: unknown; name: string; email: string; role: Role }): PublicUser {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

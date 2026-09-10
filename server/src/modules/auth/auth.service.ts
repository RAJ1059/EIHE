import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
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
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

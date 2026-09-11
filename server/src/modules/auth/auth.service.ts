import {
  BadRequestException,
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
import { EmailService } from "../email/email.service";
import { SettingsService } from "../settings/settings.service";
import { Role } from "../../common/enums/role.enum";
import { generateSecureToken, hashToken } from "../../common/utils/token";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";
import type { AuthenticatedUser } from "./strategies/jwt.strategy";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

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
    private readonly emailService: EmailService,
    private readonly settingsService: SettingsService,
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
    const settings = await this.settingsService.getSettings();
    if (!settings.googleOAuthEnabled) {
      throw new ServiceUnavailableException("Google sign-in has been disabled by an administrator.");
    }

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

    // Best-effort — a transient email failure shouldn't block account
    // creation. The token is only ever required to log in if an admin has
    // turned Settings.requireEmailVerification on.
    try {
      await this.sendVerificationEmail(user._id.toString(), user.email);
    } catch {
      // Swallowed intentionally — see comment above.
    }

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

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new UnauthorizedException(
        `Too many failed attempts. Try again after ${user.lockedUntil.toLocaleTimeString()}.`,
      );
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        "This account signs in with Google. Use the Sign in with Google button instead.",
      );
    }

    const settings = await this.settingsService.getSettings();
    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        attempts >= settings.maxLoginAttempts ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;
      await this.usersService.recordFailedLogin(
        user._id,
        lockedUntil ? 0 : attempts,
        lockedUntil,
      );
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (settings.requireEmailVerification && !user.emailVerified) {
      throw new UnauthorizedException(
        "Please verify your email before logging in — check your inbox for the verification link.",
      );
    }

    await this.usersService.resetFailedLogins(user._id);

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

  /**
   * Always resolves the same way regardless of whether the email matches a
   * real account, an active one, or one that signs in with Google only —
   * this endpoint must never be usable to enumerate registered emails.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) return;

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await this.usersService.setPasswordResetToken(user._id, tokenHash, expiresAt);

    const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByValidResetTokenHash(hashToken(token));
    if (!user) {
      throw new BadRequestException("This reset link is invalid or has expired.");
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.usersService.setPassword(user._id, passwordHash);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersService.findByValidEmailVerificationTokenHash(hashToken(token));
    if (!user) {
      throw new BadRequestException("This verification link is invalid or has expired.");
    }
    await this.usersService.markEmailVerified(user._id);
  }

  private async sendVerificationEmail(userId: string, email: string): Promise<void> {
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await this.usersService.setEmailVerificationToken(userId, tokenHash, expiresAt);

    const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const verifyUrl = `${frontendUrl}/verify-email?token=${rawToken}`;
    await this.emailService.sendVerificationEmail(email, verifyUrl);
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
    const settings = await this.settingsService.getSettings();

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_SECRET"),
      expiresIn: `${settings.sessionTimeoutMinutes}m` as StringValue,
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

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { FilterQuery, Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, type UserDocument } from "./schemas/user.schema";
import { Enrollment, type EnrollmentDocument } from "../enrollments/schemas/enrollment.schema";
import {
  LessonProgress,
  type LessonProgressDocument,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { QuizAttempt, type QuizAttemptDocument } from "../quizzes/schemas/quiz-attempt.schema";
import { Certificate, type CertificateDocument } from "../certificates/schemas/certificate.schema";
import { EmailService } from "../email/email.service";
import { Role } from "../../common/enums/role.enum";
import { generateSecureToken, hashToken } from "../../common/utils/token";
import type { UpdateProfileDto } from "./dto/update-profile.dto";
import type { CreateUserDto } from "./dto/create-user.dto";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const SALT_ROUNDS = 12;

export type UserListQuery = {
  search?: string;
  role?: Role;
  page?: number;
  limit?: number;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
    @InjectModel(QuizAttempt.name) private readonly quizAttemptModel: Model<QuizAttemptDocument>,
    @InjectModel(Certificate.name) private readonly certificateModel: Model<CertificateDocument>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  findByEmail(email: string, includeSecrets = false) {
    const query = this.userModel.findOne({ email: email.toLowerCase().trim() });
    if (includeSecrets) {
      query.select("+passwordHash +hashedRefreshToken +failedLoginAttempts +lockedUntil");
    }
    return query.exec();
  }

  findById(id: string | Types.ObjectId, includeSecrets = false) {
    const query = this.userModel.findById(id);
    if (includeSecrets) query.select("+passwordHash +hashedRefreshToken");
    return query.exec();
  }

  create(params: { name: string; email: string; passwordHash: string; role?: Role }) {
    return this.userModel.create(params);
  }

  /** Admin-created account (as opposed to self-registration, which is
   * always Role.STUDENT) — lets an admin set the role at creation time. */
  async createByAdmin(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    return this.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });
  }

  findByGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId }).exec();
  }

  createFromGoogle(params: { name: string; email: string; googleId: string }) {
    // Google has already verified this email — no need to make them do it
    // again through our own link.
    return this.userModel.create({ ...params, role: Role.STUDENT, emailVerified: true });
  }

  linkGoogleId(userId: string | Types.ObjectId, googleId: string) {
    return this.userModel.updateOne({ _id: userId }, { $set: { googleId } }).exec();
  }

  setHashedRefreshToken(userId: string | Types.ObjectId, hashedRefreshToken: string | null) {
    return this.userModel
      .updateOne({ _id: userId }, { $set: { hashedRefreshToken } })
      .exec();
  }

  setPasswordResetToken(userId: string | Types.ObjectId, tokenHash: string, expiresAt: Date) {
    return this.userModel
      .updateOne(
        { _id: userId },
        { $set: { passwordResetTokenHash: tokenHash, passwordResetExpiresAt: expiresAt } },
      )
      .exec();
  }

  findByValidResetTokenHash(tokenHash: string) {
    return this.userModel
      .findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { $gt: new Date() },
      })
      .select("+passwordResetTokenHash +passwordResetExpiresAt")
      .exec();
  }

  async setPassword(userId: string | Types.ObjectId, passwordHash: string) {
    await this.userModel
      .updateOne(
        { _id: userId },
        {
          $set: { passwordHash },
          // A completed reset invalidates the token and any existing
          // session — force a fresh login everywhere.
          $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
        },
      )
      .exec();
    await this.setHashedRefreshToken(userId, null);
  }

  recordFailedLogin(userId: string | Types.ObjectId, attempts: number, lockedUntil: Date | null) {
    return this.userModel
      .updateOne({ _id: userId }, { $set: { failedLoginAttempts: attempts, lockedUntil } })
      .exec();
  }

  resetFailedLogins(userId: string | Types.ObjectId) {
    return this.userModel
      .updateOne({ _id: userId }, { $set: { failedLoginAttempts: 0, lockedUntil: null } })
      .exec();
  }

  setEmailVerificationToken(userId: string | Types.ObjectId, tokenHash: string, expiresAt: Date) {
    return this.userModel
      .updateOne(
        { _id: userId },
        { $set: { emailVerificationTokenHash: tokenHash, emailVerificationExpiresAt: expiresAt } },
      )
      .exec();
  }

  findByValidEmailVerificationTokenHash(tokenHash: string) {
    return this.userModel
      .findOne({
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: { $gt: new Date() },
      })
      .select("+emailVerificationTokenHash +emailVerificationExpiresAt")
      .exec();
  }

  markEmailVerified(userId: string | Types.ObjectId) {
    return this.userModel
      .updateOne(
        { _id: userId },
        {
          $set: { emailVerified: true },
          $unset: { emailVerificationTokenHash: 1, emailVerificationExpiresAt: 1 },
        },
      )
      .exec();
  }

  async updateProfile(userId: string | Types.ObjectId, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found.");

    if (dto.name !== undefined) user.name = dto.name;
    await user.save();
    return user;
  }

  async findAll(query: UserListQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const filter: FilterQuery<UserDocument> = {};
    if (query.role) filter.role = query.role;
    if (query.search) {
      const term = query.search.trim();
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async findByIdOrThrow(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.findByIdOrThrow(id);
    user.role = role;
    await user.save();
    return user;
  }

  async setActive(id: string, isActive: boolean) {
    const user = await this.findByIdOrThrow(id);
    user.isActive = isActive;
    // Suspending revokes any existing session immediately; reactivating
    // doesn't need to touch it — they simply log in again normally.
    if (!isActive) {
      user.hashedRefreshToken = null;
    }
    await user.save();
    return user;
  }

  /** Admin-triggered password reset — same mechanism as the self-service
   * flow, minus the enumeration-safety wrapper (the caller is already a
   * trusted, authenticated admin who knows this user exists). */
  async triggerPasswordReset(id: string): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await this.setPasswordResetToken(user._id, tokenHash, expiresAt);

    const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  /** Deletes a user's account and their personal learning data
   * (enrollments, lesson progress, quiz attempts). Orders are deliberately
   * left alone — they're a price-snapshotted financial record and should
   * outlive the account that placed them, same policy as course deletion. */
  async remove(id: string): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    await Promise.all([
      this.enrollmentModel.deleteMany({ user: user._id }).exec(),
      this.lessonProgressModel.deleteMany({ user: user._id }).exec(),
      this.quizAttemptModel.deleteMany({ user: user._id }).exec(),
      this.certificateModel.deleteMany({ user: user._id }).exec(),
    ]);

    await user.deleteOne();
  }
}

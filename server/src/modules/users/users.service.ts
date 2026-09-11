import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { User, type UserDocument } from "./schemas/user.schema";
import { Role } from "../../common/enums/role.enum";
import type { UpdateProfileDto } from "./dto/update-profile.dto";

export type UserListQuery = {
  search?: string;
  role?: Role;
  page?: number;
  limit?: number;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

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
}

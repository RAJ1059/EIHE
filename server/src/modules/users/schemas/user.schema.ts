import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Role } from "../../../common/enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  // Optional: accounts created via Google Sign-In have no password.
  @Prop({ type: String, default: null, select: false })
  passwordHash!: string | null;

  // Set only for accounts created or linked via Google Sign-In. No default —
  // a sparse unique index only excludes documents where the field is
  // entirely absent, so writing an explicit `null` on every other account
  // would collide with the second such account (see the incident this
  // comment is here to prevent a repeat of).
  @Prop({ type: String, index: { unique: true, sparse: true } })
  googleId?: string | null;

  @Prop({ type: String, enum: Role, default: Role.STUDENT })
  role!: Role;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: String, default: null, select: false })
  hashedRefreshToken!: string | null;

  // Deterministic hash (sha256, not bcrypt) so a reset request can be
  // looked up by re-hashing the token from the link — bcrypt's per-hash
  // salt would make that an equality-lookup impossible.
  @Prop({ type: String, default: null, select: false })
  passwordResetTokenHash!: string | null;

  @Prop({ type: Date, default: null, select: false })
  passwordResetExpiresAt!: Date | null;

  // Login lockout — reset on every successful login, incremented on every
  // failed one, checked before the password is even compared.
  @Prop({ default: 0, select: false })
  failedLoginAttempts!: number;

  @Prop({ type: Date, default: null, select: false })
  lockedUntil!: Date | null;

  // Google-verified accounts are trusted immediately; a plain
  // email/password registration starts unverified and only actually
  // blocks login while Settings.requireEmailVerification is on.
  @Prop({ default: false })
  emailVerified!: boolean;

  @Prop({ type: String, default: null, select: false })
  emailVerificationTokenHash!: string | null;

  @Prop({ type: Date, default: null, select: false })
  emailVerificationExpiresAt!: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

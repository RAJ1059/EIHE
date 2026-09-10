import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CourseDocument = HydratedDocument<Course>;

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum AccessType {
  OPEN = "OPEN",
  FREE = "FREE",
  PAID = "PAID",
  CLOSED = "CLOSED",
}

export enum AccessDurationType {
  NEVER_EXPIRES = "NEVER_EXPIRES",
  DAYS_AFTER_ENROLLMENT = "DAYS_AFTER_ENROLLMENT",
  SPECIFIC_DATE = "SPECIFIC_DATE",
}

@Schema({ timestamps: true })
export class Course {
  _id!: Types.ObjectId;

  // --- Basic info ---
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug!: string;

  @Prop({ trim: true, default: "" })
  shortDescription!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  @Prop({ default: null })
  featuredImage!: string | null;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Category", default: null })
  subcategory!: Types.ObjectId | null;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  instructor!: Types.ObjectId;

  @Prop({ type: String, enum: DifficultyLevel, default: DifficultyLevel.BEGINNER })
  difficultyLevel!: DifficultyLevel;

  @Prop({ trim: true, default: "" })
  duration!: string;

  @Prop({ trim: true, default: "English" })
  language!: string;

  // --- Pricing ---
  @Prop({ required: true, min: 0, default: 0 })
  price!: number;

  @Prop({ min: 0, default: null })
  salePrice!: number | null;

  @Prop({ default: "USD" })
  currency!: string;

  // --- Status ---
  @Prop({ type: String, enum: CourseStatus, default: CourseStatus.DRAFT, index: true })
  status!: CourseStatus;

  @Prop({ default: false })
  isFeatured!: boolean;

  // --- Access & enrollment ---
  @Prop({ type: String, enum: AccessType, default: AccessType.PAID })
  accessType!: AccessType;

  @Prop({ type: String, enum: AccessDurationType, default: AccessDurationType.NEVER_EXPIRES })
  accessDurationType!: AccessDurationType;

  @Prop({ min: 0, default: null })
  accessDurationDays!: number | null;

  @Prop({ default: null })
  accessExpiryDate!: Date | null;

  @Prop({ default: null })
  enrollmentStartDate!: Date | null;

  @Prop({ default: null })
  enrollmentEndDate!: Date | null;

  // --- Prerequisites (structural only — enforcement lands with Enrollment/Progress in a later phase) ---
  @Prop({ type: [Types.ObjectId], ref: "Course", default: [] })
  prerequisites!: Types.ObjectId[];

  // --- Completion & certificate config (structural only — see prerequisites note) ---
  @Prop({ default: false })
  certificateEnabled!: boolean;

  @Prop({ default: 100, min: 0, max: 100 })
  completionMinProgressPercent!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ title: "text", shortDescription: "text", tags: "text" });

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type EnrollmentDocument = HydratedDocument<Enrollment>;

export enum EnrollmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

// "orderId" isn't populated yet — self-enrollment here only covers free
// courses. Paid checkout (Razorpay) lands in a later phase and will set it.
export enum EnrollmentSource {
  FREE_SELF_ENROLL = "FREE_SELF_ENROLL",
  MANUAL = "MANUAL",
  ORDER = "ORDER",
}

@Schema({ timestamps: true })
export class Enrollment {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  user!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Order", default: null })
  orderId!: Types.ObjectId | null;

  @Prop({ type: String, enum: EnrollmentSource, required: true })
  source!: EnrollmentSource;

  @Prop({ type: String, enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  status!: EnrollmentStatus;

  @Prop({ default: () => new Date() })
  enrolledAt!: Date;

  @Prop({ type: Date, default: null })
  expiresAt!: Date | null;

  @Prop({ type: Date, default: null })
  completedAt!: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

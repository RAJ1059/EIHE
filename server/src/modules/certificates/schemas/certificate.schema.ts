import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type CertificateDocument = HydratedDocument<Certificate>;

// One record per (user, course) — issued once, when the student completes
// the course. studentName/courseTitle are snapshotted at issuance time so a
// later rename (of the account or the course) never changes an already-
// issued certificate.
@Schema({ timestamps: true })
export class Certificate {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, index: true })
  user!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  certificateNumber!: string;

  @Prop({ required: true, trim: true })
  studentName!: string;

  @Prop({ required: true, trim: true })
  courseTitle!: string;

  @Prop({ default: () => new Date() })
  issuedAt!: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
CertificateSchema.index({ user: 1, course: 1 }, { unique: true });

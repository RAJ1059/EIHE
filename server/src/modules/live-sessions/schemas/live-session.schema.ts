import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type LiveSessionDocument = HydratedDocument<LiveSession>;

@Schema({ timestamps: true })
export class LiveSession {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  // A link to an external tool (Zoom, Google Meet, YouTube Live, etc.) —
  // this app doesn't host video calls itself, just schedules and links to
  // them, same pattern as the course brochure/certificate URLs.
  @Prop({ required: true, trim: true })
  meetingUrl!: string;

  @Prop({ required: true })
  scheduledAt!: Date;

  @Prop({ default: 60, min: 5 })
  durationMinutes!: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  createdBy!: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LiveSessionSchema = SchemaFactory.createForClass(LiveSession);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type LessonDocument = HydratedDocument<Lesson>;

export enum LessonVideoType {
  YOUTUBE = "YOUTUBE",
}

@Schema({ timestamps: true })
export class Lesson {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  slug!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  @Prop({ trim: true, default: "" })
  content!: string;

  @Prop({ type: Types.ObjectId, ref: "Module", required: true, index: true })
  module!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ type: String, enum: LessonVideoType, default: LessonVideoType.YOUTUBE })
  videoType!: LessonVideoType;

  @Prop({ type: String, default: null })
  youtubeUrl!: string | null;

  @Prop({ type: String, default: null })
  youtubeVideoId!: string | null;

  @Prop({ trim: true, default: "" })
  duration!: string;

  @Prop({ default: 0 })
  order!: number;

  @Prop({ default: false })
  requirePreviousLesson!: boolean;

  @Prop({ default: false })
  allowFreePreview!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.index({ course: 1, slug: 1 }, { unique: true });

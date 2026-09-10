import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type LessonProgressDocument = HydratedDocument<LessonProgress>;

@Schema({ timestamps: true })
export class LessonProgress {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, index: true })
  user!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Lesson", required: true, index: true })
  lesson!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Module", required: true })
  module!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ default: () => new Date() })
  completedAt!: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const LessonProgressSchema = SchemaFactory.createForClass(LessonProgress);

LessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

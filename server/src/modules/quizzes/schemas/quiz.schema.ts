import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: true })
export class Quiz {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  // null = a course-level "Final Quiz" not scoped to one module.
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Module", default: null, index: true })
  module!: Types.ObjectId | null;

  // Position among the lessons/quiz of its module (or, for a final quiz,
  // relative to other course-level quizzes) — same reorder pattern as Lesson.
  @Prop({ default: 0 })
  order!: number;

  // --- Settings ---
  @Prop({ default: 70, min: 0, max: 100 })
  passingPercentage!: number;

  @Prop({ type: Number, default: null, min: 1 })
  timeLimitMinutes!: number | null;

  // null = unlimited attempts.
  @Prop({ type: Number, default: null, min: 1 })
  maxAttempts!: number | null;

  // Minimum wait after a failed attempt before a retake is allowed. null/0 = immediate.
  @Prop({ type: Number, default: null, min: 0 })
  retakeDelayMinutes!: number | null;

  @Prop({ default: false })
  randomizeQuestions!: boolean;

  @Prop({ default: false })
  randomizeAnswers!: boolean;

  @Prop({ default: true })
  showCorrectAnswers!: boolean;

  @Prop({ default: true })
  showResults!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

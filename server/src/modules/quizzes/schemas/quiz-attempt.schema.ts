import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type QuizAttemptDocument = HydratedDocument<QuizAttempt>;

export enum QuizAttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
}

@Schema({ _id: false })
export class AnswerRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  question!: Types.ObjectId;

  // SINGLE_CHOICE/TRUE_FALSE: one id. MULTIPLE_CHOICE: many. SHORT_ANSWER: none (use text).
  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  selectedOptionIds!: Types.ObjectId[];

  @Prop({ type: String, default: null })
  textAnswer!: string | null;

  @Prop({ default: false })
  isCorrect!: boolean;

  @Prop({ default: 0 })
  pointsAwarded!: number;
}

export const AnswerRecordSchema = SchemaFactory.createForClass(AnswerRecord);

@Schema({ timestamps: true })
export class QuizAttempt {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, index: true })
  user!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Quiz", required: true, index: true })
  quiz!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  attemptNumber!: number;

  @Prop({ type: String, enum: QuizAttemptStatus, default: QuizAttemptStatus.IN_PROGRESS })
  status!: QuizAttemptStatus;

  @Prop({ default: () => new Date() })
  startedAt!: Date;

  @Prop({ type: Date, default: null })
  submittedAt!: Date | null;

  // Always derived server-side from (submittedAt - startedAt) — never
  // trusted from the client.
  @Prop({ type: Number, default: null })
  timeSpentSeconds!: number | null;

  @Prop({ type: [AnswerRecordSchema], default: [] })
  answers!: AnswerRecord[];

  @Prop({ type: Number, default: null })
  score!: number | null;

  @Prop({ type: Number, default: null })
  maxScore!: number | null;

  @Prop({ type: Number, default: null })
  percentage!: number | null;

  @Prop({ type: Boolean, default: null })
  passed!: boolean | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

QuizAttemptSchema.index({ user: 1, quiz: 1, attemptNumber: 1 }, { unique: true });

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type QuestionDocument = HydratedDocument<Question>;

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
}

@Schema({ _id: true })
export class QuestionOption {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  text!: string;

  @Prop({ default: false })
  isCorrect!: boolean;
}

export const QuestionOptionSchema = SchemaFactory.createForClass(QuestionOption);

@Schema({ timestamps: true })
export class Question {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Quiz", required: true, index: true })
  quiz!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  text!: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type!: QuestionType;

  // SINGLE_CHOICE / MULTIPLE_CHOICE / TRUE_FALSE use options (isCorrect
  // flags the right answer(s)); SHORT_ANSWER ignores this and uses
  // correctAnswers instead.
  @Prop({ type: [QuestionOptionSchema], default: [] })
  options!: QuestionOption[];

  // SHORT_ANSWER only: accepted answers, matched case-insensitively/trimmed.
  @Prop({ type: [String], default: [] })
  correctAnswers!: string[];

  @Prop({ default: 1, min: 1 })
  points!: number;

  @Prop({ default: 0 })
  order!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

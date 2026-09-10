import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { QuestionType } from "../schemas/question.schema";

export class QuestionOptionDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}

export class CreateQuestionDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  // Required for SINGLE_CHOICE / MULTIPLE_CHOICE. TRUE_FALSE auto-generates
  // its own True/False options server-side. Ignored for SHORT_ANSWER.
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  // SHORT_ANSWER only.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctAnswers?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;
}

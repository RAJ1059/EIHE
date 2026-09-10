import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from "class-validator";

export class SubmittedAnswerDto {
  @IsMongoId()
  questionId!: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  selectedOptionIds?: string[];

  @IsOptional()
  @IsString()
  textAnswer?: string;
}

export class SubmitQuizDto {
  @IsMongoId()
  attemptId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmittedAnswerDto)
  answers!: SubmittedAnswerDto[];
}

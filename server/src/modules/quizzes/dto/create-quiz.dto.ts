import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateQuizDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  passingPercentage?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimitMinutes?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  retakeDelayMinutes?: number | null;

  @IsOptional()
  @IsBoolean()
  randomizeQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  randomizeAnswers?: boolean;

  @IsOptional()
  @IsBoolean()
  showCorrectAnswers?: boolean;

  @IsOptional()
  @IsBoolean()
  showResults?: boolean;
}

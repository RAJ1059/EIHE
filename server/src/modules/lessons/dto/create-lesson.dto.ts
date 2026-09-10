import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateLessonDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  youtubeUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  duration?: string;

  @IsOptional()
  @IsBoolean()
  requirePreviousLesson?: boolean;

  @IsOptional()
  @IsBoolean()
  allowFreePreview?: boolean;
}

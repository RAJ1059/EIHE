import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsMongoId, IsOptional, IsString, Max, Min } from "class-validator";
import { CourseStatus, DifficultyLevel } from "../schemas/course.schema";

export type CourseSort = "newest" | "popular" | "price_asc" | "price_desc";

export class QueryCoursesDto {
  @IsOptional()
  @IsString()
  search?: string;

  // Admin listing only — the public endpoint always forces PUBLISHED.
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @IsOptional()
  @IsIn(["newest", "popular", "price_asc", "price_desc"])
  sort?: CourseSort;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

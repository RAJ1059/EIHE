import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import {
  AccessDurationType,
  AccessType,
  CourseStatus,
  DifficultyLevel,
} from "../schemas/course.schema";

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortDescription?: string;

  // Rich-text HTML from the admin editor (tables/images/links add markup
  // overhead a plain-text cap wouldn't need to account for).
  @IsOptional()
  @IsString()
  @MaxLength(50000)
  description?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  brochureUrl?: string;

  @IsMongoId()
  category!: string;

  @IsOptional()
  @IsMongoId()
  subcategory?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tags?: string[];

  @IsMongoId()
  instructor!: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  duration?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  language?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(AccessType)
  accessType?: AccessType;

  @IsOptional()
  @IsEnum(AccessDurationType)
  accessDurationType?: AccessDurationType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  accessDurationDays?: number;

  @IsOptional()
  @IsDateString()
  accessExpiryDate?: string;

  @IsOptional()
  @IsDateString()
  enrollmentStartDate?: string;

  @IsOptional()
  @IsDateString()
  enrollmentEndDate?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  prerequisites?: string[];

  @IsOptional()
  @IsBoolean()
  certificateEnabled?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  completionMinProgressPercent?: number;
}

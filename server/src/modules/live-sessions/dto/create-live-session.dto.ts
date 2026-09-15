import { IsInt, IsISO8601, IsOptional, IsString, Min, MaxLength, MinLength } from "class-validator";

export class CreateLiveSessionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  meetingUrl!: string;

  @IsISO8601()
  scheduledAt!: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  durationMinutes?: number;
}

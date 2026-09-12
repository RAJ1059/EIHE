import { Type } from "class-transformer";
import { IsHexColor, IsNumber, IsOptional, Max, Min } from "class-validator";

// Submitted as multipart/form-data alongside an optional "image" file, so
// every field arrives as a string — @Type(() => Number) plus the global
// ValidationPipe's `transform: true` coerces them back to numbers.
export class UpdateCertificateTemplateDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  nameXPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  nameYPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(8)
  @Max(160)
  nameFontSize?: number;

  @IsOptional()
  @IsHexColor()
  nameColor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  courseTitleXPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  courseTitleYPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(8)
  @Max(160)
  courseTitleFontSize?: number;

  @IsOptional()
  @IsHexColor()
  courseTitleColor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  dateXPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  dateYPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(8)
  @Max(160)
  dateFontSize?: number;

  @IsOptional()
  @IsHexColor()
  dateColor?: string;
}

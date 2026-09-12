import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { FormType } from "../schemas/form-submission.schema";

export class QueryFormSubmissionsDto {
  @IsOptional()
  @IsEnum(FormType)
  formType?: FormType;

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

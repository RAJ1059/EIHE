import { IsEmail, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { FormType } from "../schemas/form-submission.schema";

export class CreateFormSubmissionDto {
  @IsEnum(FormType)
  formType!: FormType;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsMongoId()
  courseId?: string;
}

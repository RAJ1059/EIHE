import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ModuleStatus } from "../schemas/module.schema";

export class CreateModuleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;
}

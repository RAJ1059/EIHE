import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class UpdateSecuritySettingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionTimeoutMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxLoginAttempts?: number;

  @IsOptional()
  @IsBoolean()
  requireEmailVerification?: boolean;

  @IsOptional()
  @IsBoolean()
  googleOAuthEnabled?: boolean;
}

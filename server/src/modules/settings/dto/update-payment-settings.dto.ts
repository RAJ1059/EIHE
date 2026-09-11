import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdatePaymentSettingsDto {
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxPercent?: number;

  @IsOptional()
  @IsBoolean()
  razorpayEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  stripeEnabled?: boolean;

  @IsOptional()
  @IsString()
  stripePublishableKey?: string;
}

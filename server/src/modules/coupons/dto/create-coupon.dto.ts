import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { CouponDiscountType } from "../schemas/coupon.schema";

export class CreateCouponDto {
  @IsString()
  @MinLength(2)
  code!: string;

  @IsEnum(CouponDiscountType)
  discountType!: CouponDiscountType;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxRedemptions?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;
}

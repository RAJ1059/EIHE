import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";

export class BillingInfoDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  phone!: string;

  @IsString()
  @MinLength(1)
  country!: string;

  @IsString()
  @MinLength(1)
  address!: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsString()
  @MinLength(1)
  zip!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  apartmentSuite?: string;

  @IsOptional()
  @IsString()
  province?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  courseIds!: string[];

  @ValidateNested()
  @Type(() => BillingInfoDto)
  billingInfo!: BillingInfoDto;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

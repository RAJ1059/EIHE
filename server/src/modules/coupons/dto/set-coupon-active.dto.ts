import { IsBoolean } from "class-validator";

export class SetCouponActiveDto {
  @IsBoolean()
  isActive!: boolean;
}

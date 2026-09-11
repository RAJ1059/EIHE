import { Body, Controller, Post } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { ValidateCouponDto } from "./dto/validate-coupon.dto";

// Public: applying a coupon on the cart page can happen before login for a
// guest checkout, and validating a code carries no sensitive data either way.
@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post("validate")
  async validate(@Body() dto: ValidateCouponDto) {
    const { coupon, discountAmount } = await this.couponsService.validateForOrder(
      dto.code,
      dto.subtotal,
    );
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    };
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { SetCouponActiveDto } from "./dto/set-coupon-active.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin/coupons")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminCouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Put(":id/active")
  setActive(@Param("id") id: string, @Body() dto: SetCouponActiveDto) {
    return this.couponsService.setActive(id, dto.isActive);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.couponsService.delete(id);
    return { deleted: true };
  }
}

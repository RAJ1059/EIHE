import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { VerifyPaymentDto } from "./dto/verify-payment.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("my")
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findMine(user.userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findByIdOrThrow(id, user.userId);
  }

  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.createOrder(user.userId, dto);
  }

  @Post("verify")
  verify(@Body() dto: VerifyPaymentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.verifyPayment(user.userId, dto);
  }
}

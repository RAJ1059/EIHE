import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin/orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: QueryOrdersDto) {
    return this.ordersService.findAllForAdmin(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findByIdForAdmin(id);
  }
}

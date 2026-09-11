import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { AdminOrdersController } from "./admin-orders.controller";
import { CoursesModule } from "../courses/courses.module";
import { EnrollmentsModule } from "../enrollments/enrollments.module";
import { CouponsModule } from "../coupons/coupons.module";
import { SettingsModule } from "../settings/settings.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CoursesModule,
    EnrollmentsModule,
    CouponsModule,
    SettingsModule,
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

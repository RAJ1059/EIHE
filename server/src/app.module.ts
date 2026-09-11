import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { HealthController } from "./health.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { EnrollmentsModule } from "./modules/enrollments/enrollments.module";
import { ModulesModule } from "./modules/modules/modules.module";
import { LessonsModule } from "./modules/lessons/lessons.module";
import { QuizzesModule } from "./modules/quizzes/quizzes.module";
import { AdminStatsModule } from "./modules/admin-stats/admin-stats.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CouponsModule } from "./modules/coupons/coupons.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>("MONGODB_URI"),
      }),
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    CoursesModule,
    EnrollmentsModule,
    ModulesModule,
    LessonsModule,
    QuizzesModule,
    AdminStatsModule,
    OrdersModule,
    CouponsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

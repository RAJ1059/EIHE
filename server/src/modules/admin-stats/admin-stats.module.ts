import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schemas/user.schema";
import { Course, CourseSchema } from "../courses/schemas/course.schema";
import { Enrollment, EnrollmentSchema } from "../enrollments/schemas/enrollment.schema";
import { AdminStatsService } from "./admin-stats.service";
import { AdminStatsController } from "./admin-stats.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
})
export class AdminStatsModule {}

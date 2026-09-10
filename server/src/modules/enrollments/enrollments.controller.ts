import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { EnrollmentsService } from "./enrollments.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("student/enrollments")
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.enrollmentsService.findMine(user.userId);
  }

  @Post()
  enroll(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.enrollInFreeCourse(user.userId, dto.courseId);
  }
}

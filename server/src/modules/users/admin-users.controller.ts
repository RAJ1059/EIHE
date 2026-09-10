import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ManualEnrollDto } from "./dto/manual-enroll.dto";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminUsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @Get()
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findByIdOrThrow(id);
  }

  @Get(":id/enrollments")
  findEnrollments(@Param("id") id: string) {
    return this.enrollmentsService.findForUser(id);
  }

  @Put(":id/role")
  @Roles(Role.SUPER_ADMIN)
  updateRole(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Post(":id/enrollments")
  enroll(@Param("id") id: string, @Body() dto: ManualEnrollDto) {
    return this.enrollmentsService.manualEnroll(id, dto.courseId);
  }

  @Delete(":id/enrollments/:courseId")
  unenroll(@Param("id") id: string, @Param("courseId") courseId: string) {
    return this.enrollmentsService.removeEnrollment(id, courseId);
  }
}

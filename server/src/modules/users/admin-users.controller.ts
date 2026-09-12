import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { SetUserActiveDto } from "./dto/set-user-active.dto";
import { ManualEnrollDto } from "./dto/manual-enroll.dto";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

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

  // Role-only-updatable and role-assignable-at-creation are the same power
  // — restricted to SUPER_ADMIN, matching updateRole below.
  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createByAdmin(dto);
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

  @Put(":id/status")
  setActive(
    @Param("id") id: string,
    @Body() dto: SetUserActiveDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    if (id === currentUser.userId) {
      throw new BadRequestException("You can't suspend your own account.");
    }
    return this.usersService.setActive(id, dto.isActive);
  }

  @Post(":id/reset-password")
  async triggerPasswordReset(@Param("id") id: string) {
    await this.usersService.triggerPasswordReset(id);
    return { sent: true };
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param("id") id: string, @CurrentUser() currentUser: AuthenticatedUser) {
    if (id === currentUser.userId) {
      throw new ForbiddenException("You can't delete your own account.");
    }
    await this.usersService.remove(id);
    return { deleted: true };
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

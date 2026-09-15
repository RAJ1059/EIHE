import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { LiveSessionsService } from "./live-sessions.service";
import { CreateLiveSessionDto } from "./dto/create-live-session.dto";
import { UpdateLiveSessionDto } from "./dto/update-live-session.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../../common/guards/optional-jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller()
export class LiveSessionsController {
  constructor(private readonly liveSessionsService: LiveSessionsService) {}

  @Get("courses/:slug/live-sessions")
  @UseGuards(OptionalJwtAuthGuard)
  findForStudent(
    @Param("slug") slug: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    return this.liveSessionsService.findByCourseForStudent(slug, user?.userId ?? null);
  }
}

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminLiveSessionsController {
  constructor(private readonly liveSessionsService: LiveSessionsService) {}

  @Get("courses/:courseId/live-sessions")
  findByCourse(@Param("courseId") courseId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.liveSessionsService.findByCourseForAdmin(courseId, user);
  }

  @Post("courses/:courseId/live-sessions")
  create(
    @Param("courseId") courseId: string,
    @Body() dto: CreateLiveSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.liveSessionsService.create(courseId, dto, user);
  }

  @Put("live-sessions/:id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateLiveSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.liveSessionsService.update(id, dto, user);
  }

  @Delete("live-sessions/:id")
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.liveSessionsService.remove(id, user);
  }
}

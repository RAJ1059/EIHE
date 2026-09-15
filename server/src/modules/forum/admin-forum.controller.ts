import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { ForumService } from "./forum.service";
import { SetPinnedDto } from "./dto/set-pinned.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get("courses/:courseId/forum")
  findThreads(@Param("courseId") courseId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.forumService.findThreadsForAdmin(courseId, user);
  }

  @Put("forum/threads/:id/pinned")
  setPinned(
    @Param("id") id: string,
    @Body() dto: SetPinnedDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.forumService.setPinned(id, dto.pinned, user);
  }

  @Delete("forum/threads/:id")
  removeThread(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.forumService.removeThread(id, user);
  }

  @Delete("forum/replies/:id")
  removeReply(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.forumService.removeReply(id, user);
  }
}

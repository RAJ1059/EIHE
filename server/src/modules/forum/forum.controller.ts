import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ForumService } from "./forum.service";
import { CreateThreadDto } from "./dto/create-thread.dto";
import { CreateReplyDto } from "./dto/create-reply.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../../common/guards/optional-jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller()
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get("courses/:slug/forum")
  @UseGuards(OptionalJwtAuthGuard)
  findThreads(
    @Param("slug") slug: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    return this.forumService.findThreadsForStudent(slug, user?.userId ?? null);
  }

  @Post("courses/:slug/forum")
  @UseGuards(JwtAuthGuard)
  createThread(
    @Param("slug") slug: string,
    @Body() dto: CreateThreadDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.forumService.createThread(slug, user.userId, dto);
  }

  @Get("forum/threads/:id")
  @UseGuards(OptionalJwtAuthGuard)
  findThread(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.forumService.findThreadWithReplies(id, user?.userId ?? null);
  }

  @Post("forum/threads/:id/replies")
  @UseGuards(JwtAuthGuard)
  createReply(
    @Param("id") id: string,
    @Body() dto: CreateReplyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.forumService.createReply(id, user.userId, dto);
  }

  @Delete("forum/threads/:id")
  @UseGuards(JwtAuthGuard)
  removeOwnThread(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.forumService.removeOwnThread(id, user.userId);
  }

  @Delete("forum/replies/:id")
  @UseGuards(JwtAuthGuard)
  removeOwnReply(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.forumService.removeOwnReply(id, user.userId);
  }
}

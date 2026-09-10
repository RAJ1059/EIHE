import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../../common/guards/optional-jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("quizzes")
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  getQuiz(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.quizzesService.getQuizForViewer(id, user?.userId ?? null);
  }

  @Post(":id/start")
  @UseGuards(JwtAuthGuard)
  start(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.quizzesService.startAttempt(id, user.userId);
  }

  @Post(":id/submit")
  @UseGuards(JwtAuthGuard)
  submit(
    @Param("id") id: string,
    @Body() dto: SubmitQuizDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.quizzesService.submitAttempt(user.userId, id, dto);
  }

  @Get(":id/attempts")
  @UseGuards(JwtAuthGuard)
  attempts(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.quizzesService.getMyAttempts(id, user.userId);
  }
}

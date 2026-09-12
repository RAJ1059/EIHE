import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { ReorderDto } from "./dto/reorder.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminQuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get("quizzes")
  findAll() {
    return this.quizzesService.findAll();
  }

  // --- Module-scoped quizzes ---

  @Get("modules/:moduleId/quizzes")
  findByModule(@Param("moduleId") moduleId: string) {
    return this.quizzesService.findByModule(moduleId);
  }

  @Post("modules/:moduleId/quizzes")
  createForModule(@Param("moduleId") moduleId: string, @Body() dto: CreateQuizDto) {
    return this.quizzesService.createModuleQuiz(moduleId, dto);
  }

  // --- Course-level "final" quizzes (module: null) ---

  @Get("courses/:courseId/final-quizzes")
  findFinalQuizzes(@Param("courseId") courseId: string) {
    return this.quizzesService.findByCourse(courseId).then((quizzes) =>
      quizzes.filter((q) => q.module === null),
    );
  }

  @Post("courses/:courseId/final-quizzes")
  createFinalQuiz(@Param("courseId") courseId: string, @Body() dto: CreateQuizDto) {
    return this.quizzesService.createFinalQuiz(courseId, dto);
  }

  // --- Quiz CRUD ---

  @Put("quizzes/reorder")
  reorder(@Body() dto: ReorderDto) {
    return this.quizzesService.reorder(dto);
  }

  @Get("quizzes/:id")
  findOne(@Param("id") id: string) {
    return this.quizzesService.findByIdOrThrow(id);
  }

  @Put("quizzes/:id")
  update(@Param("id") id: string, @Body() dto: UpdateQuizDto) {
    return this.quizzesService.update(id, dto);
  }

  @Delete("quizzes/:id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.quizzesService.remove(id);
  }

  @Post("quizzes/:id/duplicate")
  duplicate(@Param("id") id: string) {
    return this.quizzesService.duplicate(id);
  }

  // --- Questions ---

  @Get("quizzes/:quizId/questions")
  findQuestions(@Param("quizId") quizId: string) {
    return this.quizzesService.findQuestionsByQuiz(quizId);
  }

  @Post("quizzes/:quizId/questions")
  createQuestion(@Param("quizId") quizId: string, @Body() dto: CreateQuestionDto) {
    return this.quizzesService.createQuestion(quizId, dto);
  }

  @Put("questions/reorder")
  reorderQuestions(@Body() dto: ReorderDto) {
    return this.quizzesService.reorderQuestions(dto);
  }

  @Put("questions/:id")
  updateQuestion(@Param("id") id: string, @Body() dto: UpdateQuestionDto) {
    return this.quizzesService.updateQuestion(id, dto);
  }

  @Delete("questions/:id")
  removeQuestion(@Param("id") id: string) {
    return this.quizzesService.removeQuestion(id);
  }
}

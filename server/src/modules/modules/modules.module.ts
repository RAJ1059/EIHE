import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Module, ModuleSchema } from "./schemas/module.schema";
import { Lesson, LessonSchema } from "../lessons/schemas/lesson.schema";
import { Quiz, QuizSchema } from "../quizzes/schemas/quiz.schema";
import { Question, QuestionSchema } from "../quizzes/schemas/question.schema";
import { ModulesService } from "./modules.service";
import { AdminModulesController } from "./modules.controller";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Module.name, schema: ModuleSchema },
      // Registered here (not via their own feature modules) purely so
      // ModulesService.duplicate() can clone a module's lessons/quizzes
      // without a module-level dependency cycle — same pattern as
      // CoursesModule.
      { name: Lesson.name, schema: LessonSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [AdminModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}

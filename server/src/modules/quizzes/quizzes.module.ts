import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Quiz, QuizSchema } from "./schemas/quiz.schema";
import { Question, QuestionSchema } from "./schemas/question.schema";
import { QuizAttempt, QuizAttemptSchema } from "./schemas/quiz-attempt.schema";
import { Lesson, LessonSchema } from "../lessons/schemas/lesson.schema";
import { Module, ModuleSchema } from "../modules/schemas/module.schema";
import {
  LessonProgress,
  LessonProgressSchema,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { QuizzesService } from "./quizzes.service";
import { QuizzesController } from "./quizzes.controller";
import { AdminQuizzesController } from "./admin-quizzes.controller";
import { EnrollmentsModule } from "../enrollments/enrollments.module";
import { CourseCompletionModule } from "../course-completion/course-completion.module";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
      { name: Module.name, schema: ModuleSchema },
    ]),
    EnrollmentsModule,
    CourseCompletionModule,
  ],
  controllers: [QuizzesController, AdminQuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}

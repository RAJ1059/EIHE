import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Lesson, LessonSchema } from "./schemas/lesson.schema";
import { LessonProgress, LessonProgressSchema } from "../lesson-progress/schemas/lesson-progress.schema";
import { Module, ModuleSchema } from "../modules/schemas/module.schema";
import { Quiz, QuizSchema } from "../quizzes/schemas/quiz.schema";
import { QuizAttempt, QuizAttemptSchema } from "../quizzes/schemas/quiz-attempt.schema";
import { LessonsService } from "./lessons.service";
import { LessonsController, AdminLessonsController } from "./lessons.controller";
import { EnrollmentsModule } from "../enrollments/enrollments.module";
import { CoursesModule } from "../courses/courses.module";
import { CourseCompletionModule } from "../course-completion/course-completion.module";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
      { name: Module.name, schema: ModuleSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
    ]),
    EnrollmentsModule,
    CoursesModule,
    CourseCompletionModule,
  ],
  controllers: [LessonsController, AdminLessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}

import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Course, CourseSchema } from "./schemas/course.schema";
import { Module, ModuleSchema } from "../modules/schemas/module.schema";
import { Lesson, LessonSchema } from "../lessons/schemas/lesson.schema";
import { Quiz, QuizSchema } from "../quizzes/schemas/quiz.schema";
import { Question, QuestionSchema } from "../quizzes/schemas/question.schema";
import { QuizAttempt, QuizAttemptSchema } from "../quizzes/schemas/quiz-attempt.schema";
import {
  LessonProgress,
  LessonProgressSchema,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { Enrollment, EnrollmentSchema } from "../enrollments/schemas/enrollment.schema";
import { Certificate, CertificateSchema } from "../certificates/schemas/certificate.schema";
import { CoursesService } from "./courses.service";
import { CoursesController, AdminCoursesController } from "./courses.controller";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      // Registered here (not via their own feature modules) purely so
      // CoursesService.remove() can cascade-delete everything under a
      // course without introducing a module-level dependency cycle.
      { name: Module.name, schema: ModuleSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
  ],
  controllers: [CoursesController, AdminCoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

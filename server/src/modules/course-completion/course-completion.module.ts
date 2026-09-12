import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Quiz, QuizSchema } from "../quizzes/schemas/quiz.schema";
import { QuizAttempt, QuizAttemptSchema } from "../quizzes/schemas/quiz-attempt.schema";
import { Lesson, LessonSchema } from "../lessons/schemas/lesson.schema";
import {
  LessonProgress,
  LessonProgressSchema,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { CourseCompletionService } from "./course-completion.service";
import { EnrollmentsModule } from "../enrollments/enrollments.module";
import { CoursesModule } from "../courses/courses.module";
import { CertificatesModule } from "../certificates/certificates.module";

// Registers the Quiz/QuizAttempt/Lesson/LessonProgress models directly
// (rather than importing QuizzesModule/LessonsModule) so this module can be
// imported BY both of those without creating a circular module dependency —
// same pattern QuizzesModule/LessonsModule already use for each other's schemas.
@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
    ]),
    EnrollmentsModule,
    CoursesModule,
    CertificatesModule,
  ],
  providers: [CourseCompletionService],
  exports: [CourseCompletionService],
})
export class CourseCompletionModule {}

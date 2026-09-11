import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schemas/user.schema";
import { Course, CourseSchema } from "../courses/schemas/course.schema";
import { Enrollment, EnrollmentSchema } from "../enrollments/schemas/enrollment.schema";
import { Lesson, LessonSchema } from "../lessons/schemas/lesson.schema";
import {
  LessonProgress,
  LessonProgressSchema,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { Quiz, QuizSchema } from "../quizzes/schemas/quiz.schema";
import { QuizAttempt, QuizAttemptSchema } from "../quizzes/schemas/quiz-attempt.schema";
import { AdminStatsService } from "./admin-stats.service";
import { AdminStatsController, AdminCourseReportsController } from "./admin-stats.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
    ]),
  ],
  controllers: [AdminStatsController, AdminCourseReportsController],
  providers: [AdminStatsService],
})
export class AdminStatsModule {}

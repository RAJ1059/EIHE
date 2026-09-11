import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { Enrollment, EnrollmentSchema } from "../enrollments/schemas/enrollment.schema";
import {
  LessonProgress,
  LessonProgressSchema,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { QuizAttempt, QuizAttemptSchema } from "../quizzes/schemas/quiz-attempt.schema";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AdminUsersController } from "./admin-users.controller";
import { EnrollmentsModule } from "../enrollments/enrollments.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      // Registered here (not via their own feature modules) purely so
      // UsersService.remove() can cascade-delete a user's learning data
      // without introducing a module-level dependency cycle — the same
      // pattern CoursesService.remove() uses.
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: LessonProgress.name, schema: LessonProgressSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
    ]),
    EnrollmentsModule,
    EmailModule,
  ],
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

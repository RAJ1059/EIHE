import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quiz, type QuizDocument } from "../quizzes/schemas/quiz.schema";
import {
  QuizAttempt,
  QuizAttemptStatus,
  type QuizAttemptDocument,
} from "../quizzes/schemas/quiz-attempt.schema";
import { Lesson, type LessonDocument } from "../lessons/schemas/lesson.schema";
import {
  LessonProgress,
  type LessonProgressDocument,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { EnrollmentStatus } from "../enrollments/schemas/enrollment.schema";
import { CoursesService } from "../courses/courses.service";
import { CertificatesService } from "../certificates/certificates.service";

/**
 * Decides whether a student has finished a course and, if so, marks their
 * enrollment completed and issues a certificate (when the course has one
 * enabled). Called after a final quiz is passed, or after a lesson is
 * completed for courses that have no final quiz at all.
 *
 * A course counts as "complete" when either:
 *  - it has one or more course-level ("final") quizzes, and the student has
 *    passed every one of them, or
 *  - it has none, and the student has completed every lesson in the course.
 */
@Injectable()
export class CourseCompletionService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    @InjectModel(QuizAttempt.name) private readonly quizAttemptModel: Model<QuizAttemptDocument>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService,
    private readonly certificatesService: CertificatesService,
  ) {}

  async checkAndIssue(userId: string, courseId: string): Promise<void> {
    const enrollment = await this.enrollmentsService.findOne(userId, courseId);
    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) return;

    const isComplete = await this.isCourseComplete(userId, courseId);
    if (!isComplete) return;

    await this.enrollmentsService.markCompleted(userId, courseId);

    const course = await this.coursesService.findByIdOrThrow(courseId);
    if (course.certificateEnabled) {
      await this.certificatesService.issueIfNotExists(userId, courseId, course.title);
    }
  }

  private async isCourseComplete(userId: string, courseId: string): Promise<boolean> {
    const finalQuizzes = await this.quizModel
      .find({ course: courseId, module: null })
      .select("_id")
      .exec();

    if (finalQuizzes.length > 0) {
      const passedQuizIds = await this.quizAttemptModel.distinct("quiz", {
        user: userId,
        course: courseId,
        status: QuizAttemptStatus.SUBMITTED,
        passed: true,
        quiz: { $in: finalQuizzes.map((q) => q._id) },
      });
      const passedIdSet = new Set(passedQuizIds.map((id) => id.toString()));
      return finalQuizzes.every((q) => passedIdSet.has(q._id.toString()));
    }

    const totalLessons = await this.lessonModel.countDocuments({ course: courseId }).exec();
    if (totalLessons === 0) return false;

    const completedLessons = await this.lessonProgressModel
      .countDocuments({ user: userId, course: courseId })
      .exec();
    return completedLessons >= totalLessons;
  }
}

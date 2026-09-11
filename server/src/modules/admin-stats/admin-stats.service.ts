import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, type UserDocument } from "../users/schemas/user.schema";
import { Course, CourseStatus, type CourseDocument } from "../courses/schemas/course.schema";
import {
  Enrollment,
  EnrollmentStatus,
  type EnrollmentDocument,
} from "../enrollments/schemas/enrollment.schema";
import { Lesson, type LessonDocument } from "../lessons/schemas/lesson.schema";
import {
  LessonProgress,
  type LessonProgressDocument,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { Quiz, type QuizDocument } from "../quizzes/schemas/quiz.schema";
import {
  QuizAttempt,
  QuizAttemptStatus,
  type QuizAttemptDocument,
} from "../quizzes/schemas/quiz-attempt.schema";
import { Role } from "../../common/enums/role.enum";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    @InjectModel(QuizAttempt.name) private readonly quizAttemptModel: Model<QuizAttemptDocument>,
  ) {}

  async getOverview() {
    const since = new Date(Date.now() - SEVEN_DAYS_MS);

    const [
      totalStudents,
      totalInstructors,
      totalCourses,
      publishedCourses,
      draftCourses,
      pendingReviewCourses,
      archivedCourses,
      totalEnrollments,
      activeEnrollments,
      newStudentsThisWeek,
      newEnrollmentsThisWeek,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: Role.STUDENT }).exec(),
      this.userModel
        .countDocuments({ role: { $in: [Role.INSTRUCTOR, Role.ADMIN, Role.SUPER_ADMIN] } })
        .exec(),
      this.courseModel.countDocuments().exec(),
      this.courseModel.countDocuments({ status: CourseStatus.PUBLISHED }).exec(),
      this.courseModel.countDocuments({ status: CourseStatus.DRAFT }).exec(),
      this.courseModel.countDocuments({ status: CourseStatus.PENDING_REVIEW }).exec(),
      this.courseModel.countDocuments({ status: CourseStatus.ARCHIVED }).exec(),
      this.enrollmentModel.countDocuments().exec(),
      this.enrollmentModel.countDocuments({ status: EnrollmentStatus.ACTIVE }).exec(),
      this.userModel.countDocuments({ role: Role.STUDENT, createdAt: { $gte: since } }).exec(),
      this.enrollmentModel.countDocuments({ createdAt: { $gte: since } }).exec(),
    ]);

    return {
      totalStudents,
      totalInstructors,
      totalCourses,
      publishedCourses,
      draftCourses,
      pendingReviewCourses,
      archivedCourses,
      totalEnrollments,
      activeEnrollments,
      newStudentsThisWeek,
      newEnrollmentsThisWeek,
    };
  }

  /** Lightweight per-course summary for the Course Reports list — no per-student loop. */
  async listCourseSummaries() {
    const courses = await this.courseModel.find().select("title slug status").exec();

    return Promise.all(
      courses.map(async (course) => {
        const [totalEnrollments, activeEnrollments, totalLessons, totalQuizzes] =
          await Promise.all([
            this.enrollmentModel.countDocuments({ course: course._id }).exec(),
            this.enrollmentModel
              .countDocuments({ course: course._id, status: EnrollmentStatus.ACTIVE })
              .exec(),
            this.lessonModel.countDocuments({ course: course._id }).exec(),
            this.quizModel.countDocuments({ course: course._id }).exec(),
          ]);
        return {
          course: { _id: course._id, title: course.title, slug: course.slug, status: course.status },
          totalEnrollments,
          activeEnrollments,
          totalLessons,
          totalQuizzes,
        };
      }),
    );
  }

  async getCourseReport(courseId: string) {
    const course = await this.courseModel.findById(courseId).select("title slug").exec();
    if (!course) throw new NotFoundException("Course not found.");

    const [totalLessons, totalQuizzes, enrollments, totalEnrollments] = await Promise.all([
      this.lessonModel.countDocuments({ course: courseId }).exec(),
      this.quizModel.countDocuments({ course: courseId }).exec(),
      this.enrollmentModel
        .find({ course: courseId, status: EnrollmentStatus.ACTIVE })
        .select("user")
        .exec(),
      this.enrollmentModel.countDocuments({ course: courseId }).exec(),
    ]);

    const totalItems = totalLessons + totalQuizzes;

    const perStudent = await Promise.all(
      enrollments.map(async (enrollment) => {
        const userId = enrollment.user.toString();
        const [completedLessons, passedQuizIds] = await Promise.all([
          this.lessonProgressModel.countDocuments({ course: courseId, user: userId }).exec(),
          this.quizAttemptModel.distinct("quiz", {
            course: courseId,
            user: userId,
            status: QuizAttemptStatus.SUBMITTED,
            passed: true,
          }),
        ]);
        const completedItems = completedLessons + passedQuizIds.length;
        const percent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
        return percent;
      }),
    );

    const averageCompletionPercent =
      perStudent.length === 0
        ? 0
        : Math.round(perStudent.reduce((sum, p) => sum + p, 0) / perStudent.length);
    const completedStudents = perStudent.filter((p) => p >= 100).length;

    return {
      course: { _id: course._id, title: course.title, slug: course.slug },
      totalLessons,
      totalQuizzes,
      totalEnrollments,
      activeEnrollments: enrollments.length,
      averageCompletionPercent,
      completedStudents,
    };
  }
}

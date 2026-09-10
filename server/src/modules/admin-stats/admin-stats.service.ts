import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, type UserDocument } from "../users/schemas/user.schema";
import { Course, CourseStatus, type CourseDocument } from "../courses/schemas/course.schema";
import {
  Enrollment,
  EnrollmentStatus,
  type EnrollmentDocument,
} from "../enrollments/schemas/enrollment.schema";
import { Role } from "../../common/enums/role.enum";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
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
}

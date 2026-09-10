import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Enrollment,
  EnrollmentSource,
  EnrollmentStatus,
  type EnrollmentDocument,
} from "./schemas/enrollment.schema";
import { CoursesService } from "../courses/courses.service";
import { CourseStatus } from "../courses/schemas/course.schema";

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    private readonly coursesService: CoursesService,
  ) {}

  findMine(userId: string) {
    return this.enrollmentModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "course", select: "title slug shortDescription featuredImage" })
      .exec();
  }

  /**
   * Self-enrollment for FREE courses only. Paid courses require the
   * Razorpay checkout flow from a later phase — this deliberately does not
   * grant access to a paid course without payment.
   */
  async enrollInFreeCourse(userId: string, courseId: string) {
    const course = await this.coursesService.findByIdOrThrow(courseId);

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException("This course is not currently available.");
    }

    const isFree = course.price === 0 && (course.salePrice === null || course.salePrice === 0);
    if (!isFree) {
      throw new BadRequestException(
        "This course requires payment. Checkout isn't available yet.",
      );
    }

    const existing = await this.enrollmentModel
      .findOne({ user: userId, course: courseId })
      .exec();
    if (existing) return existing;

    try {
      return await this.enrollmentModel.create({
        user: userId,
        course: courseId,
        source: EnrollmentSource.FREE_SELF_ENROLL,
        status: EnrollmentStatus.ACTIVE,
        enrolledAt: new Date(),
      });
    } catch (error) {
      // Unique (user, course) index race — treat as already-enrolled.
      if (this.isDuplicateKeyError(error)) {
        const enrollment = await this.enrollmentModel
          .findOne({ user: userId, course: courseId })
          .exec();
        if (enrollment) return enrollment;
      }
      throw new ConflictException("Could not enroll in this course.");
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
  }
}

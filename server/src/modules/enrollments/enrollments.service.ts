import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.enrollmentModel
      .exists({ user: userId, course: courseId, status: EnrollmentStatus.ACTIVE })
      .exec();
    return Boolean(enrollment);
  }

  findOne(userId: string, courseId: string) {
    return this.enrollmentModel.findOne({ user: userId, course: courseId }).exec();
  }

  /** Marks an active enrollment completed. No-ops if it's already completed
   * or isn't active (e.g. cancelled/expired) — called after course-progress
   * checks, never as a direct user action. */
  async markCompleted(userId: string, courseId: string): Promise<void> {
    await this.enrollmentModel
      .updateOne(
        { user: userId, course: courseId, status: EnrollmentStatus.ACTIVE },
        { $set: { status: EnrollmentStatus.COMPLETED, completedAt: new Date() } },
      )
      .exec();
  }

  findForUser(userId: string) {
    return this.enrollmentModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "course", select: "title slug shortDescription featuredImage" })
      .exec();
  }

  /** Admin-initiated enrollment — bypasses the free-course-only restriction. */
  async manualEnroll(userId: string, courseId: string) {
    await this.coursesService.findByIdOrThrow(courseId);

    const existing = await this.enrollmentModel.findOne({ user: userId, course: courseId }).exec();
    if (existing) return existing;

    try {
      return await this.enrollmentModel.create({
        user: userId,
        course: courseId,
        source: EnrollmentSource.MANUAL,
        status: EnrollmentStatus.ACTIVE,
        enrolledAt: new Date(),
      });
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        const enrollment = await this.enrollmentModel
          .findOne({ user: userId, course: courseId })
          .exec();
        if (enrollment) return enrollment;
      }
      throw new ConflictException("Could not enroll this student.");
    }
  }

  /**
   * Created only after a payment has been server-side signature-verified
   * (see OrdersService.verifyPayment) — never call this off a bare
   * "payment succeeded" claim from the frontend.
   */
  async enrollFromOrder(userId: string, courseId: string, orderId: Types.ObjectId) {
    const existing = await this.enrollmentModel.findOne({ user: userId, course: courseId }).exec();
    if (existing) {
      existing.status = EnrollmentStatus.ACTIVE;
      existing.orderId = orderId;
      await existing.save();
      return existing;
    }

    try {
      return await this.enrollmentModel.create({
        user: userId,
        course: courseId,
        orderId,
        source: EnrollmentSource.ORDER,
        status: EnrollmentStatus.ACTIVE,
        enrolledAt: new Date(),
      });
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        const enrollment = await this.enrollmentModel
          .findOne({ user: userId, course: courseId })
          .exec();
        if (enrollment) return enrollment;
      }
      throw new ConflictException("Could not create this enrollment.");
    }
  }

  async removeEnrollment(userId: string, courseId: string) {
    const result = await this.enrollmentModel
      .deleteOne({ user: userId, course: courseId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException("This student isn't enrolled in that course.");
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
  }
}

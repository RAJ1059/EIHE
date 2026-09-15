import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LiveSession, type LiveSessionDocument } from "./schemas/live-session.schema";
import { CoursesService } from "../courses/courses.service";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import type { CreateLiveSessionDto } from "./dto/create-live-session.dto";
import type { UpdateLiveSessionDto } from "./dto/update-live-session.dto";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Injectable()
export class LiveSessionsService {
  constructor(
    @InjectModel(LiveSession.name) private readonly liveSessionModel: Model<LiveSessionDocument>,
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async findByIdOrThrow(id: string) {
    const session = await this.liveSessionModel.findById(id).exec();
    if (!session) throw new NotFoundException("Live session not found.");
    return session;
  }

  // --- Admin / instructor (ownership-checked via CoursesService) ---

  async create(courseId: string, dto: CreateLiveSessionDto, requester: AuthenticatedUser) {
    const course = await this.coursesService.findByIdOrThrowForAdmin(courseId, requester);
    return this.liveSessionModel.create({
      course: course._id,
      title: dto.title,
      description: dto.description ?? "",
      meetingUrl: dto.meetingUrl,
      scheduledAt: new Date(dto.scheduledAt),
      durationMinutes: dto.durationMinutes ?? 60,
      createdBy: requester.userId,
    });
  }

  async findByCourseForAdmin(courseId: string, requester: AuthenticatedUser) {
    await this.coursesService.findByIdOrThrowForAdmin(courseId, requester);
    return this.liveSessionModel.find({ course: courseId }).sort({ scheduledAt: 1 }).exec();
  }

  async update(id: string, dto: UpdateLiveSessionDto, requester: AuthenticatedUser) {
    const session = await this.findByIdOrThrow(id);
    await this.coursesService.findByIdOrThrowForAdmin(session.course.toString(), requester);

    Object.assign(session, {
      ...dto,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : session.scheduledAt,
    });
    await session.save();
    return session;
  }

  async remove(id: string, requester: AuthenticatedUser) {
    const session = await this.findByIdOrThrow(id);
    await this.coursesService.findByIdOrThrowForAdmin(session.course.toString(), requester);
    await session.deleteOne();
  }

  // --- Student-facing (enrollment-gated) ---

  async findByCourseForStudent(slug: string, userId: string | null) {
    const course = await this.coursesService.findBySlug(slug);

    if (!userId) {
      throw new ForbiddenException("Log in and enroll in this course to see its live sessions.");
    }
    const enrolled = await this.enrollmentsService.isEnrolled(userId, course._id.toString());
    if (!enrolled) {
      throw new ForbiddenException("Enroll in this course to see its live sessions.");
    }

    return this.liveSessionModel.find({ course: course._id }).sort({ scheduledAt: 1 }).exec();
  }
}

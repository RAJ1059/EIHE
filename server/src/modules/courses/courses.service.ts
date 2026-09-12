import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Course, CourseStatus, type CourseDocument } from "./schemas/course.schema";
import { Module, type ModuleDocument } from "../modules/schemas/module.schema";
import { Lesson, type LessonDocument } from "../lessons/schemas/lesson.schema";
import { Quiz, type QuizDocument } from "../quizzes/schemas/quiz.schema";
import { Question, type QuestionDocument } from "../quizzes/schemas/question.schema";
import { QuizAttempt, type QuizAttemptDocument } from "../quizzes/schemas/quiz-attempt.schema";
import {
  LessonProgress,
  type LessonProgressDocument,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { Enrollment, type EnrollmentDocument } from "../enrollments/schemas/enrollment.schema";
import { Certificate, type CertificateDocument } from "../certificates/schemas/certificate.schema";
import { slugify } from "../../common/utils/slugify";
import { Role } from "../../common/enums/role.enum";
import type { CreateCourseDto } from "./dto/create-course.dto";
import type { UpdateCourseDto } from "./dto/update-course.dto";
import type { QueryCoursesDto } from "./dto/query-courses.dto";

const POPULATE = [
  { path: "category", select: "name slug" },
  { path: "subcategory", select: "name slug" },
  { path: "instructor", select: "name email" },
];

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(QuizAttempt.name) private readonly quizAttemptModel: Model<QuizAttemptDocument>,
    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
    @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Certificate.name) private readonly certificateModel: Model<CertificateDocument>,
  ) {}

  async create(dto: CreateCourseDto, requesterRole: Role) {
    this.assertCanSetStatus(requesterRole, dto.status);
    const slug = await this.uniqueSlug(dto.title);
    return this.courseModel.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateCourseDto, requesterRole: Role) {
    this.assertCanSetStatus(requesterRole, dto.status);
    const course = await this.findByIdOrThrow(id);

    if (dto.title && dto.title !== course.title) {
      course.slug = await this.uniqueSlug(dto.title, id);
    }

    Object.assign(course, dto);
    await course.save();
    return course;
  }

  /**
   * Deleting works regardless of status (draft, published, archived — all
   * of it) — this is an admin action, not a status transition. Everything
   * that hangs off the course is cleaned up so nothing orphaned is left
   * behind: modules, lessons, quizzes (and their questions), progress,
   * attempts, and enrollments. Paid Orders are deliberately left alone —
   * they're a financial record of what was actually charged, snapshotted
   * at purchase time, and should outlive the course they were for.
   */
  async remove(id: string) {
    const course = await this.findByIdOrThrow(id);

    const quizIds = await this.quizModel.distinct("_id", { course: id }).exec();

    await Promise.all([
      this.moduleModel.deleteMany({ course: id }).exec(),
      this.lessonModel.deleteMany({ course: id }).exec(),
      this.quizModel.deleteMany({ course: id }).exec(),
      this.questionModel.deleteMany({ quiz: { $in: quizIds } }).exec(),
      this.quizAttemptModel.deleteMany({ course: id }).exec(),
      this.lessonProgressModel.deleteMany({ course: id }).exec(),
      this.enrollmentModel.deleteMany({ course: id }).exec(),
      this.certificateModel.deleteMany({ course: id }).exec(),
    ]);

    await course.deleteOne();
  }

  /**
   * Instructors can't publish directly — their courses go DRAFT ->
   * PENDING_REVIEW -> (approved) PUBLISHED. Only Admin/Super Admin can set
   * PUBLISHED directly. Enforced here, not just hidden in the UI.
   */
  private assertCanSetStatus(requesterRole: Role, status?: CourseStatus) {
    if (status !== CourseStatus.PUBLISHED) return;
    if (requesterRole === Role.SUPER_ADMIN || requesterRole === Role.ADMIN) return;
    throw new ForbiddenException(
      "Instructors can't publish a course directly — submit it for review instead.",
    );
  }

  async submitForReview(id: string) {
    const course = await this.findByIdOrThrow(id);
    if (course.status !== CourseStatus.DRAFT) {
      throw new BadRequestException("Only a draft course can be submitted for review.");
    }
    course.status = CourseStatus.PENDING_REVIEW;
    await course.save();
    return course;
  }

  async approve(id: string) {
    const course = await this.findByIdOrThrow(id);
    if (course.status !== CourseStatus.PENDING_REVIEW) {
      throw new BadRequestException("Only a course pending review can be approved.");
    }
    course.status = CourseStatus.PUBLISHED;
    await course.save();
    return course;
  }

  async reject(id: string) {
    const course = await this.findByIdOrThrow(id);
    if (course.status !== CourseStatus.PENDING_REVIEW) {
      throw new BadRequestException("Only a course pending review can be rejected.");
    }
    course.status = CourseStatus.DRAFT;
    await course.save();
    return course;
  }

  findByIdOrThrow(id: string) {
    return this.courseModel
      .findById(id)
      .populate(POPULATE)
      .exec()
      .then((course) => {
        if (!course) throw new NotFoundException("Course not found.");
        return course;
      });
  }

  async findBySlug(slug: string, { publishedOnly = true } = {}) {
    const filter: FilterQuery<CourseDocument> = { slug: slug.toLowerCase() };
    if (publishedOnly) filter.status = CourseStatus.PUBLISHED;

    const course = await this.courseModel.findOne(filter).populate(POPULATE).exec();
    if (!course) throw new NotFoundException("Course not found.");
    return course;
  }

  async findPublished(query: QueryCoursesDto) {
    return this.paginate({ ...query, statuses: [CourseStatus.PUBLISHED] });
  }

  async findAllForAdmin(query: QueryCoursesDto) {
    return this.paginate(query);
  }

  private async paginate(
    query: QueryCoursesDto & { statuses?: CourseStatus[] },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const filter: FilterQuery<CourseDocument> = {};
    if (query.statuses) filter.status = { $in: query.statuses };
    else if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.difficultyLevel) filter.difficultyLevel = query.difficultyLevel;
    if (query.search) filter.$text = { $search: query.search };

    const sort = this.resolveSort(query.sort);

    const [items, total] = await Promise.all([
      this.courseModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(POPULATE)
        .exec(),
      this.courseModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  private resolveSort(sort?: string): Record<string, 1 | -1> {
    switch (sort) {
      case "price_asc":
        return { price: 1 };
      case "price_desc":
        return { price: -1 };
      case "popular":
        return { isFeatured: -1, createdAt: -1 };
      default:
        return { createdAt: -1 };
    }
  }

  private async uniqueSlug(title: string, excludeId?: string): Promise<string> {
    const base = slugify(title);
    let candidate = base;
    let suffix = 1;

    while (true) {
      const filter: FilterQuery<CourseDocument> = { slug: candidate };
      if (excludeId) filter._id = { $ne: excludeId };

      const existing = await this.courseModel.exists(filter);
      if (!existing) return candidate;

      suffix += 1;
      candidate = `${base}-${suffix}`;

      if (suffix > 50) {
        throw new ConflictException("Could not generate a unique slug for this course.");
      }
    }
  }
}

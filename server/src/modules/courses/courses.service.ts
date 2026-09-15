import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
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
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

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

  async update(id: string, dto: UpdateCourseDto, requester: AuthenticatedUser) {
    this.assertCanSetStatus(requester.role, dto.status);
    const course = await this.findByIdOrThrowForAdmin(id, requester);

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
   * Deep-clones a course: the course itself, its modules, lessons, and
   * quizzes (module-scoped and course-level "final" quizzes alike), and
   * every question on those quizzes — all as brand-new documents, correctly
   * re-linked to each other. The clone always lands as a DRAFT and never
   * featured, regardless of the original's state, so nothing goes live
   * unreviewed. Instructor/category/pricing/access settings are carried
   * over as a starting point since they're normal editable fields, not
   * publish-adjacent state.
   */
  async duplicate(id: string, requester: AuthenticatedUser) {
    const original = await this.findByIdOrThrowForAdmin(id, requester);

    const title = `${original.title} (Copy)`;
    const slug = await this.uniqueSlug(title);

    const newCourse = await this.courseModel.create({
      title,
      slug,
      shortDescription: original.shortDescription,
      description: original.description,
      featuredImage: original.featuredImage,
      category: original.category,
      subcategory: original.subcategory,
      tags: original.tags,
      instructor: original.instructor,
      difficultyLevel: original.difficultyLevel,
      duration: original.duration,
      language: original.language,
      price: original.price,
      salePrice: original.salePrice,
      currency: original.currency,
      status: CourseStatus.DRAFT,
      isFeatured: false,
      accessType: original.accessType,
      accessDurationType: original.accessDurationType,
      accessDurationDays: original.accessDurationDays,
      accessExpiryDate: original.accessExpiryDate,
      enrollmentStartDate: original.enrollmentStartDate,
      enrollmentEndDate: original.enrollmentEndDate,
      prerequisites: original.prerequisites,
      certificateEnabled: original.certificateEnabled,
      completionMinProgressPercent: original.completionMinProgressPercent,
    });

    const modules = await this.moduleModel.find({ course: id }).sort({ order: 1 }).exec();
    const moduleIdMap = new Map<string, Types.ObjectId>();
    await Promise.all(
      modules.map(async (mod) => {
        const newModule = await this.moduleModel.create({
          title: mod.title,
          description: mod.description,
          image: mod.image,
          course: newCourse._id,
          order: mod.order,
          status: mod.status,
        });
        moduleIdMap.set(mod._id.toString(), newModule._id);
      }),
    );

    const lessons = await this.lessonModel.find({ course: id }).sort({ order: 1 }).exec();
    await Promise.all(
      lessons.map((lesson) => {
        const newModuleId = moduleIdMap.get(lesson.module.toString());
        if (!newModuleId) return null;
        // The (course, slug) unique index is scoped per course, so reusing
        // the same slug string under the new course id can't collide.
        return this.lessonModel.create({
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          content: lesson.content,
          module: newModuleId,
          course: newCourse._id,
          videoType: lesson.videoType,
          youtubeUrl: lesson.youtubeUrl,
          youtubeVideoId: lesson.youtubeVideoId,
          duration: lesson.duration,
          order: lesson.order,
          requirePreviousLesson: lesson.requirePreviousLesson,
          allowFreePreview: lesson.allowFreePreview,
          topics: lesson.topics.map((topic) => ({
            title: topic.title,
            content: topic.content,
            order: topic.order,
          })),
        });
      }),
    );

    const quizzes = await this.quizModel.find({ course: id }).sort({ order: 1 }).exec();
    const quizIdMap = new Map<string, Types.ObjectId>();
    await Promise.all(
      quizzes.map(async (quiz) => {
        let newModuleId: Types.ObjectId | null = null;
        if (quiz.module) {
          const mapped = moduleIdMap.get(quiz.module.toString());
          // A quiz whose module reference is already dangling (points at a
          // module that no longer exists) is stale data, not a real final
          // quiz — skip it rather than silently reclassifying it as one.
          if (!mapped) return null;
          newModuleId = mapped;
        }
        const newQuiz = await this.quizModel.create({
          title: quiz.title,
          description: quiz.description,
          course: newCourse._id,
          module: newModuleId,
          order: quiz.order,
          passingPercentage: quiz.passingPercentage,
          timeLimitMinutes: quiz.timeLimitMinutes,
          maxAttempts: quiz.maxAttempts,
          retakeDelayMinutes: quiz.retakeDelayMinutes,
          randomizeQuestions: quiz.randomizeQuestions,
          randomizeAnswers: quiz.randomizeAnswers,
          showCorrectAnswers: quiz.showCorrectAnswers,
          showResults: quiz.showResults,
        });
        quizIdMap.set(quiz._id.toString(), newQuiz._id);
      }),
    );

    if (quizIdMap.size > 0) {
      const questions = await this.questionModel
        .find({ quiz: { $in: [...quizIdMap.keys()] } })
        .exec();
      await Promise.all(
        questions.map((question) => {
          const newQuizId = quizIdMap.get(question.quiz.toString());
          if (!newQuizId) return null;
          return this.questionModel.create({
            quiz: newQuizId,
            text: question.text,
            type: question.type,
            options: question.options.map((option) => ({
              text: option.text,
              isCorrect: option.isCorrect,
            })),
            correctAnswers: question.correctAnswers,
            points: question.points,
            order: question.order,
          });
        }),
      );
    }

    return this.findByIdOrThrow(newCourse._id.toString());
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

  async submitForReview(id: string, requester: AuthenticatedUser) {
    const course = await this.findByIdOrThrowForAdmin(id, requester);
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

  /**
   * Same as findByIdOrThrow, but also enforces that an INSTRUCTOR requester
   * owns the course — Admin/Super Admin can always reach any course. Use
   * this (not the plain findByIdOrThrow) for any admin-portal action an
   * instructor can take on a *specific* course — viewing, editing,
   * duplicating, submitting for review — so an instructor's "teacher
   * portal" is actually scoped to their own courses, not just relying on
   * the list view to hide the rest.
   */
  async findByIdOrThrowForAdmin(id: string, requester: AuthenticatedUser) {
    const course = await this.findByIdOrThrow(id);
    this.assertOwnership(course, requester);
    return course;
  }

  private assertOwnership(course: CourseDocument, requester: AuthenticatedUser) {
    if (requester.role !== Role.INSTRUCTOR) return;
    if (this.extractRefId(course.instructor) !== requester.userId) {
      throw new ForbiddenException("You can only manage your own courses.");
    }
  }

  /**
   * A ref field (like Course.instructor) is a raw ObjectId on a plain
   * query, but a populated document once `.populate()` has run on it (as
   * findByIdOrThrow does) — `.toString()` only returns the id in the first
   * case, so callers that might see either need this instead.
   */
  private extractRefId(value: unknown): string {
    if (value && typeof value === "object" && "_id" in value) {
      return String((value as { _id: unknown })._id);
    }
    return String(value);
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

  async findAllForAdmin(query: QueryCoursesDto, requester: AuthenticatedUser) {
    // Instructors only ever see their own courses in the admin portal — this
    // is enforced here from the requester's identity, never from a
    // client-suppliable query param, so it can't be spoofed. Admin/Super
    // Admin see everything, same as before.
    const instructorId = requester.role === Role.INSTRUCTOR ? requester.userId : undefined;
    return this.paginate({ ...query, instructorId });
  }

  private async paginate(
    query: QueryCoursesDto & { statuses?: CourseStatus[]; instructorId?: string },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const filter: FilterQuery<CourseDocument> = {};
    if (query.instructorId) filter.instructor = query.instructorId;
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

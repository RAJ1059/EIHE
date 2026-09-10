import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Course, CourseStatus, type CourseDocument } from "./schemas/course.schema";
import { slugify } from "../../common/utils/slugify";
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
  ) {}

  async create(dto: CreateCourseDto) {
    const slug = await this.uniqueSlug(dto.title);
    return this.courseModel.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateCourseDto) {
    const course = await this.findByIdOrThrow(id);

    if (dto.title && dto.title !== course.title) {
      course.slug = await this.uniqueSlug(dto.title, id);
    }

    Object.assign(course, dto);
    await course.save();
    return course;
  }

  async remove(id: string) {
    const course = await this.findByIdOrThrow(id);
    await course.deleteOne();
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

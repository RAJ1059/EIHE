import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FormSubmission, type FormSubmissionDocument, type FormType } from "./schemas/form-submission.schema";
import { Course, type CourseDocument } from "../courses/schemas/course.schema";
import type { CreateFormSubmissionDto } from "./dto/create-form-submission.dto";

@Injectable()
export class FormSubmissionsService {
  constructor(
    @InjectModel(FormSubmission.name)
    private readonly formSubmissionModel: Model<FormSubmissionDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(dto: CreateFormSubmissionDto) {
    let courseTitle = "";
    if (dto.courseId) {
      const course = await this.courseModel.findById(dto.courseId).select("title").exec();
      courseTitle = course?.title ?? "";
    }

    return this.formSubmissionModel.create({
      formType: dto.formType,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      course: dto.courseId ?? null,
      courseTitle,
    });
  }

  async findAllForAdmin(query: { formType?: FormType; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = query.formType ? { formType: query.formType } : {};

    const [items, total] = await Promise.all([
      this.formSubmissionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.formSubmissionModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }
}

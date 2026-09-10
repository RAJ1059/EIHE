import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, type CategoryDocument } from "./schemas/category.schema";
import { slugify } from "../../common/utils/slugify";
import type { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  findAll() {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException("Category not found.");
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name);
    const existing = await this.categoryModel.findOne({ slug }).exec();
    if (existing) {
      throw new ConflictException("A category with this name already exists.");
    }

    return this.categoryModel.create({
      name: dto.name,
      slug,
      description: dto.description ?? "",
      parent: dto.parent ?? null,
    });
  }

  async remove(id: string) {
    const category = await this.findById(id);
    await category.deleteOne();
  }
}

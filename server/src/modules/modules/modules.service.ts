import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Module, type ModuleDocument } from "./schemas/module.schema";
import type { CreateModuleDto } from "./dto/create-module.dto";
import type { UpdateModuleDto } from "./dto/update-module.dto";
import type { ReorderDto } from "./dto/reorder.dto";

@Injectable()
export class ModulesService {
  constructor(@InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>) {}

  findByCourse(courseId: string) {
    return this.moduleModel.find({ course: courseId }).sort({ order: 1 }).exec();
  }

  async findByIdOrThrow(id: string) {
    const module = await this.moduleModel.findById(id).exec();
    if (!module) throw new NotFoundException("Module not found.");
    return module;
  }

  async create(courseId: string, dto: CreateModuleDto) {
    const count = await this.moduleModel.countDocuments({ course: courseId }).exec();
    return this.moduleModel.create({ ...dto, course: courseId, order: count });
  }

  async update(id: string, dto: UpdateModuleDto) {
    const module = await this.findByIdOrThrow(id);
    Object.assign(module, dto);
    await module.save();
    return module;
  }

  async remove(id: string) {
    const module = await this.findByIdOrThrow(id);
    await module.deleteOne();
  }

  async reorder(dto: ReorderDto) {
    await Promise.all(
      dto.orderedIds.map((id, index) =>
        this.moduleModel.updateOne({ _id: id }, { $set: { order: index } }).exec(),
      ),
    );
  }
}

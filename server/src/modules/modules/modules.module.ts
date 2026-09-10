import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Module, ModuleSchema } from "./schemas/module.schema";
import { ModulesService } from "./modules.service";
import { AdminModulesController } from "./modules.controller";

@NestModule({
  imports: [MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }])],
  controllers: [AdminModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}

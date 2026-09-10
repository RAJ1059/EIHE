import { IsMongoId } from "class-validator";

export class ManualEnrollDto {
  @IsMongoId()
  courseId!: string;
}

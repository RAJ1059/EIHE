import { ArrayMinSize, IsArray, IsMongoId } from "class-validator";

export class ReorderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  orderedIds!: string[];
}

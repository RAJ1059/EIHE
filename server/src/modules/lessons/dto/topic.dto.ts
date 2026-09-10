import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

export class TopicDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class TopicsListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicDto)
  topics!: TopicDto[];
}

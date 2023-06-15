import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsDateString()
  @IsOptional()
  releaseDate: string;

  @IsDateString()
  @IsOptional()
  createDate: string;

  @IsBoolean()
  @IsOptional()
  isFinish: boolean;

  @IsBoolean()
  @IsOptional()
  visibility: boolean;

  @IsString()
  @IsOptional()
  resume: string;

  @IsNumber()
  @IsOptional()
  authorId: number;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsNumber()
  @IsOptional()
  editorId: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  tagsId: Array<number>;
}

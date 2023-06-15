import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateVolumeDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  number: number;

  @IsDateString()
  @IsOptional()
  releaseDate: Date;

  @IsDateString()
  @IsOptional()
  createDate: Date;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  resume: string;

  @IsNumber()
  @IsOptional()
  nbrPages: number;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsBoolean()
  @IsOptional()
  visibility: boolean;

  @IsInt()
  @IsOptional()
  editionId: number;

  slug?: string;
}

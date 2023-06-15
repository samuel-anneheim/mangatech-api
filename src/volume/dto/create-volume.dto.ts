import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateVolumeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsDateString()
  releaseDate: Date;

  @IsDateString()
  createDate: Date;

  @IsUrl({ require_tld: false })
  image: string;

  @IsString()
  resume: string;

  @IsNumber()
  nbrPages: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  visibility: boolean;

  @IsInt()
  editionId: number;
}

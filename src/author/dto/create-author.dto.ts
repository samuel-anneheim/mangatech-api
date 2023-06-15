import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @IsEnum({ homme: 'homme', femme: 'femme', autre: 'autre' })
  gender: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  biography: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth: Date;
}

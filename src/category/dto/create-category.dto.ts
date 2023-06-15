import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  image: string;
}

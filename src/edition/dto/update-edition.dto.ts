import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateEditionDto } from './create-edition.dto';

export class UpdateEditionDto extends PartialType(CreateEditionDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;
}

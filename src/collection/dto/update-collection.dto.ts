import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;
}

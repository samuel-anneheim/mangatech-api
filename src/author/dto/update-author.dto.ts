import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @IsString()
  @IsOptional()
  surname: string;

  @IsString()
  @IsOptional()
  name: string;
}

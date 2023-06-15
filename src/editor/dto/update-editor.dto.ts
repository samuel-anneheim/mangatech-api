import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateEditorDto } from './create-editor.dto';

export class UpdateEditorDto extends PartialType(CreateEditorDto) {
  @IsString()
  @IsOptional()
  name: string;

  slug?: string;
}

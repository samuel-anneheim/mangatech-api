import { PartialType } from '@nestjs/swagger';
import { CreateLibraryDto } from './create-library.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
export class UpdateLibraryDto extends PartialType(CreateLibraryDto) {
  @IsBoolean()
  @IsOptional()
  isRead: boolean;

  @IsNumber()
  @IsOptional()
  volumeId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}

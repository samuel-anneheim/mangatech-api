import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLibraryDto {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;

  @IsNotEmpty()
  @IsNumber()
  volumeId: number;
}

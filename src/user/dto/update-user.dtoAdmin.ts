import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateUserDtoAdmin } from './create-user.dtoAdmin';

export class UpdateUserDtoAdmin extends PartialType(CreateUserDtoAdmin) {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsDateString()
  @IsOptional()
  registrationDate: Date;
}

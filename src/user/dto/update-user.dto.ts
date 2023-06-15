import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsDateString()
  @IsOptional()
  registrationDate: Date;

  @IsDateString()
  @IsOptional()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  surname: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  picture: string;

  @IsString()
  @IsOptional()
  @IsEnum({ homme: 'homme', femme: 'femme', autre: 'autre' })
  gender: string;
}

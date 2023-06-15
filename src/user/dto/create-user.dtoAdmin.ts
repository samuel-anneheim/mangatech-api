import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Role } from '../../auth/role/role.enum';

export class CreateUserDtoAdmin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDateString()
  @IsNotEmpty()
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

  @IsString()
  @IsOptional()
  @IsEnum({ admin: 'admin', user: 'user' })
  role: Role;
}

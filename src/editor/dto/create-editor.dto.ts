import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateEditorDto {
  @IsString()
  name: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  officialWebsite: string;
}

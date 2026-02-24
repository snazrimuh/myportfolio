import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tech: string[];

  @IsUrl()
  @IsOptional()
  github?: string;

  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;
}

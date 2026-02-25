import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
  IsBoolean,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { ProjectCategory } from '@prisma/client';

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

  @IsEnum(ProjectCategory)
  @IsOptional()
  category?: ProjectCategory;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;
}

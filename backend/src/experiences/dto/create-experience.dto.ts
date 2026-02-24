import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
} from 'class-validator';

export enum ExperienceType {
  WORK = 'WORK',
  INTERNSHIP = 'INTERNSHIP',
  EDUCATION = 'EDUCATION',
  CERTIFICATION = 'CERTIFICATION',
}

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ExperienceType)
  @IsOptional()
  type?: ExperienceType;

  @IsInt()
  @IsOptional()
  order?: number;
}

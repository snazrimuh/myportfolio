import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AboutCardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nameFirst?: string;

  @IsOptional()
  @IsString()
  nameSecond?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsBoolean()
  freelanceAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  openToWork?: boolean;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  siteTitle?: string;

  @IsOptional()
  @IsString()
  siteDescription?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutCardDto)
  aboutCards?: AboutCardDto[];

  @IsOptional()
  @IsString()
  skillsTagline?: string;

  @IsOptional()
  @IsString()
  resumeTagline?: string;

  @IsOptional()
  @IsString()
  projectsTagline?: string;

  @IsOptional()
  @IsString()
  contactIntro?: string;
}

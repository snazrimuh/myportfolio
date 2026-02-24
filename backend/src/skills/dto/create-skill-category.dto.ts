import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateSkillCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}

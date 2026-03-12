import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

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
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  @IsOptional()
  skills?: CreateSkillDto[] | string[];
}

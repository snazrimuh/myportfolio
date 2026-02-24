import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto'; // eslint-disable-line @typescript-eslint/no-unused-vars

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.skillCategory.findMany({
      include: { skills: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.skillCategory.findUnique({
      where: { id },
      include: { skills: true },
    });
    if (!category) throw new NotFoundException(`Skill category #${id} not found`);
    return category;
  }

  async create(dto: CreateSkillCategoryDto) {
    const { skills, ...categoryData } = dto;

    return this.prisma.skillCategory.create({
      data: {
        ...categoryData,
        skills: skills
          ? { create: skills.map((name) => ({ name })) }
          : undefined,
      },
      include: { skills: true },
    });
  }

  async update(id: number, dto: UpdateSkillCategoryDto) {
    await this.findOne(id); // ensure exists

    const { skills, ...categoryData } = dto as CreateSkillCategoryDto & { skills?: string[] };

    // If skills are provided, replace all skills
    if (skills !== undefined) {
      await this.prisma.skill.deleteMany({ where: { categoryId: id } });
    }

    return this.prisma.skillCategory.update({
      where: { id },
      data: {
        ...categoryData,
        skills: skills
          ? { create: skills.map((name: string) => ({ name })) }
          : undefined,
      },
      include: { skills: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.skillCategory.delete({
      where: { id },
      include: { skills: true },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findByType(type: string) {
    return this.prisma.experience.findMany({
      where: { type: type as any },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) throw new NotFoundException(`Experience #${id} not found`);
    return experience;
  }

  async create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async update(id: number, dto: UpdateExperienceDto) {
    await this.findOne(id);

    const data: Record<string, any> = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) {
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.experience.delete({ where: { id } });
  }
}

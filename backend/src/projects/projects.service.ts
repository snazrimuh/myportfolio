import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findFeatured() {
    return this.prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project #${id} not found`);
    return project;
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }
}

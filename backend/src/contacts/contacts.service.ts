import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnread() {
    return this.prisma.contactMessage.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException(`Message #${id} not found`);
    return message;
  }

  async create(dto: CreateContactDto) {
    return this.prisma.contactMessage.create({ data: dto });
  }

  async markAsRead(id: number) {
    await this.findOne(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}

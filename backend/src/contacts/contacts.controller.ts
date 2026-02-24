import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // ── Public — anyone can send a message ──────────────────
  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  // ── Admin only ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread')
  findUnread() {
    return this.contactsService.findUnread();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(id);
  }
}

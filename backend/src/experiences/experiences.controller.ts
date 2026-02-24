import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  // ── Public ──────────────────────────────────────────────
  @Get()
  findAll(@Query('type') type?: string) {
    if (type) return this.experiencesService.findByType(type.toUpperCase());
    return this.experiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.experiencesService.findOne(id);
  }

  // ── Admin only ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.experiencesService.remove(id);
  }
}

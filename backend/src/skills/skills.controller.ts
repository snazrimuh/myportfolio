import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // ── Public ──────────────────────────────────────────────
  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findOne(id);
  }

  // ── Admin only ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSkillCategoryDto) {
    return this.skillsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillCategoryDto,
  ) {
    return this.skillsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }
}

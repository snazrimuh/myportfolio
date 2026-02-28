import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ── Public ──────────────────────────────────────────────
  @Get()
  get() {
    return this.profileService.get();
  }

  // ── Admin only ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }
}

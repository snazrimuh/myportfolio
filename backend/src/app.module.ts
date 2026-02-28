import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SkillsModule,
    ProjectsModule,
    ExperiencesModule,
    ContactsModule,
    ProfileModule,
  ],
})
export class AppModule {}

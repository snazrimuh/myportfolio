import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const DEFAULT_PROFILE = {
  nameFirst: 'Syah Rizan',
  nameSecond: 'Nazri Muhammad',
  roles: ['Backend Developer', 'Fullstack Engineer', 'API Designer'],
  tagline:
    'Software Engineer specializing in scalable backend systems, API architecture, and fullstack engineering for impactful products.\nBased in Tangerang City, Indonesia.',
  bio: 'I am a Software Engineer with a strong passion for building scalable backend systems, clean APIs, and reliable fullstack applications. With hands-on experience across backend development, mobile, and data-driven projects, I focus on creating efficient, maintainable solutions that solve real-world problems.\nI enjoy designing clean architectures, optimizing system performance, and translating complex requirements into practical and impactful digital products. Adaptable and collaborative by nature, I continuously explore new technologies and best practices to grow as an engineer and contribute to meaningful technology-driven environments.',
  location: 'Tangerang City, Indonesia',
  email: 'snazrimuh@gmail.com',
  degree: 'S1 Informatics',
  freelanceAvailable: true,
  openToWork: true,
  resumeUrl: null,
  githubUrl: 'https://github.com/snazrimuh',
  linkedinUrl: 'https://linkedin.com/in/syahrizannazri/',
  twitterUrl: null,
  instagramUrl: null,
  siteTitle: 'Portfolio — Syah Rizan Nazri Muhammad',
  siteDescription:
    'Software Engineer with experience in backend development, API design, database management, and fullstack engineering for impactful products.',
  aboutCards: [
    {
      title: 'Backend Developer & Software Engineer',
      description:
        'Experienced in backend system development, API design, database management, and IoT-based solutions. Accustomed to working in project-based environments and collaborating effectively to solve problems in a structured and maintainable manner.',
    },
    {
      title: 'ML & AI Engineer',
      description:
        'Experienced in building machine learning pipelines, training deep learning models, and integrating AI capabilities into real-world applications. Passionate about data-driven solutions and applying modern AI techniques to solve practical problems.',
    },
  ],
  skillsTagline: 'Technologies and tools I use to build products from scratch.',
  resumeTagline:
    'My professional journey — from formal education to hands-on industry experience.',
  projectsTagline:
    'A selection of projects I have built — from backend systems to fullstack applications.',
  contactIntro:
    "I'm always open to discussing new projects, creative ideas, or opportunities. Feel free to reach out!",
};

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  /** Always returns the single profile record, creating it with defaults if absent */
  async get() {
    let profile = await this.prisma.profile.findFirst();
    if (!profile) {
      profile = await this.prisma.profile.create({ data: DEFAULT_PROFILE as any });
    }
    return profile;
  }

  async update(dto: UpdateProfileDto) {
    let profile = await this.prisma.profile.findFirst();
    if (!profile) {
      profile = await this.prisma.profile.create({ data: DEFAULT_PROFILE as any });
    }
    return this.prisma.profile.update({ where: { id: profile.id }, data: dto as any });
  }
}

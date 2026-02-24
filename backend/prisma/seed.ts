import { PrismaClient, ExperienceType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Admin ─────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log(`✅ Admin created: ${adminEmail}`);

  // ─── Seed Skill Categories ────────────────────────────
  const existingCategories = await prisma.skillCategory.count();
  if (existingCategories > 0) {
    console.log('⏭️  Skill categories already exist, skipping...');
  } else {
  const skillCategories = [
    {
      name: 'Frontend',
      icon: 'Monitor',
      color: 'rgba(59, 130, 246, 0.1)',
      order: 1,
      skills: ['Vue.js', 'Nuxt.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
    },
    {
      name: 'Backend',
      icon: 'Server',
      color: 'rgba(16, 185, 129, 0.1)',
      order: 2,
      skills: ['NestJS', 'Node.js', 'Express', 'Python', 'REST API', 'GraphQL'],
    },
    {
      name: 'Database',
      icon: 'Database',
      color: 'rgba(245, 158, 11, 0.1)',
      order: 3,
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Prisma', 'TypeORM'],
    },
    {
      name: 'IoT & Embedded',
      icon: 'Cpu',
      color: 'rgba(239, 68, 68, 0.1)',
      order: 4,
      skills: ['ESP8266', 'Orange Pi', 'Arduino', 'Sensor Integration', 'MQTT'],
    },
    {
      name: 'AI & ML',
      icon: 'Brain',
      color: 'rgba(168, 85, 247, 0.1)',
      order: 5,
      skills: ['YOLOv5', 'Machine Learning', 'Computer Vision', 'Python ML'],
    },
    {
      name: 'DevOps & Tools',
      icon: 'Wrench',
      color: 'rgba(139, 92, 246, 0.1)',
      order: 6,
      skills: ['Git', 'Docker', 'CI/CD', 'Linux', 'Nginx', 'Vercel'],
    },
  ];

  for (const cat of skillCategories) {
    const { skills, ...categoryData } = cat;
    await prisma.skillCategory.create({
      data: {
        ...categoryData,
        skills: {
          create: skills.map((name) => ({ name })),
        },
      },
    });
  }
  console.log(`✅ ${skillCategories.length} skill categories seeded`);
  } // end else

  // ─── Seed Projects ────────────────────────────────────
  const existingProjects = await prisma.project.count();
  if (existingProjects > 0) {
    console.log('⏭️  Projects already exist, skipping...');
  } else {
  const projects = [
    {
      title: 'New Arsipku',
      description:
        'A modern correspondence system for AirNav Indonesia built with NestJS, improving performance, scalability, and maintainability for daily internal and external official communications.',
      tech: ['TypeScript', 'NestJS', 'MySQL', 'REST API'],
      github: 'https://github.com/snazrimuh/airnav-korespondensi-be',
      image: '/new-arsipku.png',
      order: 1,
    },
    {
      title: 'NavEvent',
      description:
        'A digital platform for efficiency and transparency in managing AirNav Indonesia activities. Enables real-time paperless workflows, accelerated certificate distribution, and real-time dashboards.',
      tech: ['PHP', 'Laravel', 'MySQL', 'CI/CD'],
      github: 'https://github.com/snazrimuh/airnav-navevent-be',
      image: '/nav-event.png',
      order: 2,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ ${projects.length} projects seeded`);
  } // end else

  // ─── Seed Experiences ─────────────────────────────────
  const existingExperiences = await prisma.experience.count();
  if (existingExperiences > 0) {
    console.log('⏭️  Experiences already exist, skipping...');
  } else {
  const experiences = [
    {
      title: 'Backend Developer Intern',
      company: 'AirNav Indonesia',
      location: 'Tangerang, Indonesia',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-31'),
      description:
        'Developed backend systems and APIs for internal correspondence and event management platforms.',
      type: ExperienceType.INTERNSHIP,
      order: 1,
    },
    {
      title: 'IT Support Intern',
      company: 'DKP3 Sukabumi',
      location: 'Sukabumi, Indonesia',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2023-12-31'),
      description:
        'Provided technical support and system maintenance for government IT infrastructure.',
      type: ExperienceType.INTERNSHIP,
      order: 2,
    },
    {
      title: 'IoT Developer Intern',
      company: 'Joglo Kebun Wangi',
      location: 'Bogor, Indonesia',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-06-30'),
      description:
        'Built IoT monitoring solutions for hydroponic farming systems.',
      type: ExperienceType.INTERNSHIP,
      order: 3,
    },
    {
      title: 'Computer Engineering Technology',
      company: 'Institut Pertanian Bogor',
      location: 'Bogor, Indonesia',
      startDate: new Date('2021-08-01'),
      endDate: new Date('2025-07-31'),
      description: 'GPA 3.48/4.00 — IPB Vocational School',
      type: ExperienceType.EDUCATION,
      order: 4,
    },
    {
      title: 'Software Engineering Certification',
      company: 'BNSP',
      startDate: new Date('2024-06-01'),
      description: 'National Professional Certification in Software Engineering',
      type: ExperienceType.CERTIFICATION,
      order: 5,
    },
    {
      title: 'Hardware Installation Supervisor Certification',
      company: 'BNSP',
      startDate: new Date('2024-06-01'),
      description:
        'National Professional Certification in Hardware Installation Supervision',
      type: ExperienceType.CERTIFICATION,
      order: 6,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ ${experiences.length} experiences seeded`);
  } // end else

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
      skills: ['Vue.js', 'Nuxt.js', 'Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap', 'HTML/CSS', 'Jetpack Compose'],
    },
    {
      name: 'Backend',
      icon: 'Server',
      color: 'rgba(16, 185, 129, 0.1)',
      order: 2,
      skills: ['NestJS', 'Node.js', 'Express.js', 'Laravel', 'PHP', 'REST API', 'Python'],
    },
    {
      name: 'Database',
      icon: 'Database',
      color: 'rgba(245, 158, 11, 0.1)',
      order: 3,
      skills: ['PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Firebase', 'Prisma'],
    },
    {
      name: 'Mobile & IoT',
      icon: 'Cpu',
      color: 'rgba(239, 68, 68, 0.1)',
      order: 4,
      skills: ['Kotlin', 'Retrofit', 'ESP8266', 'Arduino', 'MQTT', 'Sensor Integration', 'Orange Pi'],
    },
    {
      name: 'AI & Machine Learning',
      icon: 'Brain',
      color: 'rgba(168, 85, 247, 0.1)',
      order: 5,
      skills: ['TensorFlow', 'Python', 'Computer Vision', 'Pandas', 'NumPy', 'Scikit-learn'],
    },
    {
      name: 'DevOps & Tools',
      icon: 'Wrench',
      color: 'rgba(139, 92, 246, 0.1)',
      order: 6,
      skills: ['Git', 'Docker', 'CI/CD', 'AWS', 'GCP', 'Firebase', 'Postman', 'Figma', 'Linux', 'Vercel'],
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
      title: 'Correspondence System (New Arsipku)',
      description:
        'A modern correspondence system for AirNav Indonesia built with NestJS, improving performance, scalability, and maintainability for daily internal and external official communications.',
      tech: ['TypeScript', 'NestJS', 'MySQL', 'REST API'],
      github: 'https://github.com/snazrimuh/airnav-korespondensi-be',
      image: '/new-arsipku.png',
      order: 1,
    },
    {
      title: 'Event Management (NavEvent)',
      description:
        'Digital platform for AirNav Indonesia enabling paperless workflows, certificate distribution, and real-time admin dashboards for comprehensive event tracking.',
      tech: ['PHP', 'Laravel', 'MySQL', 'CI/CD'],
      github: 'https://github.com/snazrimuh/airnav-navevent-be',
      image: '/nav-event.png',
      order: 2,
    },
    {
      title: 'Online Service System',
      description:
        'Fullstack web application for Kab. Sukohajo providing online services to citizens with improved accessibility and service delivery capabilities.',
      tech: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'ReactJS'],
      github: 'https://github.com/snazrimuh',
      image: '/online-service.png',
      order: 3,
    },
    {
      title: 'Election System UNS',
      description:
        'Digital election platform for Universitas Sebelas Maret enabling secure voting with real-time result management and authentication systems.',
      tech: ['Laravel', 'MySQL', 'PHP', 'HTML/CSS'],
      github: 'https://github.com/snazrimuh',
      image: '/election-system.png',
      order: 4,
    },
    {
      title: 'Stunting Monitoring System',
      description:
        'Web-based monitoring platform for tracking stunting cases with data visualization and reporting capabilities for healthcare professionals.',
      tech: ['Node.js', 'Express', 'MongoDB', 'ReactJS'],
      github: 'https://github.com/snazrimuh',
      image: '/stunting-monitoring.png',
      order: 5,
    },
    {
      title: 'BCA Revamp Mobile App',
      description:
        'Mobile application with accessibility focus achieving 100% WCAG 2.1 compliance. Improved performance 30% using Kotlin Coroutines with Clean Architecture.',
      tech: ['Kotlin', 'Jetpack Compose', 'Retrofit', 'MVVM'],
      github: 'https://github.com/snazrimuh',
      image: '/bca-revamp.png',
      order: 6,
    },
    {
      title: 'TransJogja Route Optimization',
      description:
        'Machine learning project optimizing public transportation routes using YOLOv5 for object detection and predictive models for route efficiency.',
      tech: ['Python', 'YOLOv5', 'TensorFlow', 'Machine Learning'],
      github: 'https://github.com/snazrimuh',
      image: '/transjogja.png',
      order: 7,
    },
    {
      title: 'Career Recommendation System',
      description:
        'AI-powered platform using machine learning to suggest suitable career paths based on user skills and preferences with multiple learning options.',
      tech: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas'],
      github: 'https://github.com/snazrimuh',
      image: '/career-recommendation.png',
      order: 8,
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
      title: 'Backend Developer',
      company: 'Lembaga Penyelenggara Pelayanan Navigasi Penerbangan Indonesia (AirNav Indonesia)',
      location: 'Tangerang, Indonesia',
      startDate: new Date('2025-10-01'),
      description:
        'Built RESTful APIs for navigation systems. Optimized DB queries by 40%. Implemented CI/CD pipelines.',
      type: ExperienceType.WORK,
      order: 1,
    },
    {
      title: 'AI Specialist',
      company: 'Outlier AI',
      location: 'California, United States (Remote)',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-03-31'),
      description:
        'Enhanced LLM accuracy by 15% through scenario evaluation. Debugged AI code for training datasets.',
      type: ExperienceType.WORK,
      order: 2,
    },
    {
      title: 'Backend Trainee',
      company: 'AWS Back-End Academy',
      location: 'Jakarta, Indonesia',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-02-28'),
      description:
        'Deployed AWS apps with 25% cost improvement. Implemented Docker and CI/CD reducing inconsistencies by 40%.',
      type: ExperienceType.WORK,
      order: 3,
    },
    {
      title: 'Mobile Developer Bootcamp',
      company: 'SYNRGY Academy presented by PT. Bank Central Asia',
      location: 'Jakarta, Indonesia',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-09-30'),
      description:
        'Built BCA Mobile app with 100% WCAG 2.1 compliance. Improved 30% using Kotlin with 30+ APIs.',
      type: ExperienceType.EDUCATION,
      order: 4,
    },
    {
      title: 'Machine Learning Cohort',
      company: 'Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka',
      location: 'Jakarta, Indonesia',
      startDate: new Date('2023-08-01'),
      endDate: new Date('2024-01-31'),
      description:
        'Completed 500+ hours of ML courses. Led team developing Recommendation App scoring 92/100.',
      type: ExperienceType.EDUCATION,
      order: 5,
    },
    {
      title: 'Head of Networking and Collaboration Division',
      company: 'Himpunan Mahasiswa Informatika UNS',
      location: 'Surakarta, Indonesia',
      startDate: new Date('2022-02-01'),
      endDate: new Date('2023-01-31'),
      description:
        'Partnered with 30+ tech companies. Coordinated 10 events with 300+ participants.',
      type: ExperienceType.WORK,
      order: 6,
    },
    {
      title: 'S1 Informatics',
      company: 'Universitas Sebelas Maret',
      location: 'Surakarta, Indonesia',
      startDate: new Date('2021-08-01'),
      endDate: new Date('2025-07-31'),
      description:
        'Degree in Computer Science. Thesis: YOLOv5 Traffic Detection. GPA: 3.75/4.00 (cum laude)',
      type: ExperienceType.EDUCATION,
      order: 7,
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

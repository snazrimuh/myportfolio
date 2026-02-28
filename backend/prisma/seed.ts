import { PrismaClient, ExperienceType, ProjectCategory } from '@prisma/client';
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
      category: ProjectCategory.BACKEND,
      github: 'https://github.com/snazrimuh/airnav-korespondensi-be',
      image: '/new-arsipku.png',
      order: 1,
    },
    {
      title: 'Event Management (NavEvent)',
      description:
        'Digital platform for AirNav Indonesia enabling paperless workflows, certificate distribution, and real-time admin dashboards for comprehensive event tracking.',
      tech: ['PHP', 'Laravel', 'MySQL', 'CI/CD'],
      category: ProjectCategory.BACKEND,
      github: 'https://github.com/snazrimuh/airnav-navevent-be',
      image: '/nav-event.png',
      order: 2,
    },
    {
      title: 'Online Service System',
      description:
        'Fullstack web application for Kab. Sukohajo providing online services to citizens with improved accessibility and service delivery capabilities.',
      tech: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'ReactJS'],
      category: ProjectCategory.FULLSTACK,
      github: 'https://github.com/snazrimuh',
      image: '/online-service.png',
      order: 3,
    },
    {
      title: 'Election System UNS',
      description:
        'Digital election platform for Universitas Sebelas Maret enabling secure voting with real-time result management and authentication systems.',
      tech: ['Laravel', 'MySQL', 'PHP', 'HTML/CSS'],
      category: ProjectCategory.FULLSTACK,
      github: 'https://github.com/snazrimuh',
      image: '/election-system.png',
      order: 4,
    },
    {
      title: 'Document Management Platform',
      description:
        'Web-based document management system for organized storage, retrieval and collaboration with role-based access control and audit trails.',
      tech: ['Laravel', 'MySQL', 'PHP', 'Tailwind CSS'],
      category: ProjectCategory.FULLSTACK,
      github: 'https://github.com/snazrimuh',
      image: '/document-management.png',
      order: 5,
    },
    {
      title: 'BCA Revamp Mobile App',
      description:
        'Mobile application with accessibility focus achieving 100% WCAG 2.1 compliance. Improved performance 30% using Kotlin Coroutines with Clean Architecture.',
      tech: ['Kotlin', 'Jetpack Compose', 'Retrofit', 'MVVM'],
      category: ProjectCategory.MOBILE,
      github: 'https://github.com/snazrimuh',
      image: '/bca-revamp.png',
      order: 6,
    },
    {
      title: 'TransJogja Route Optimization',
      description:
        'Machine learning project optimizing public transportation routes using YOLOv5 for object detection and predictive models for route efficiency.',
      tech: ['Python', 'YOLOv5', 'TensorFlow', 'Machine Learning'],
      category: ProjectCategory.ML_DL,
      github: 'https://github.com/snazrimuh',
      image: '/transjogja.png',
      order: 7,
    },
    {
      title: 'Career Recommendation System',
      description:
        'AI-powered platform using machine learning to suggest suitable career paths based on user skills and preferences with multiple learning options.',
      tech: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas'],
      category: ProjectCategory.ML_DL,
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
      type: ExperienceType.WORK,
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
      type: ExperienceType.WORK,
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
        'Degree in Computer Science. Thesis:  Traf ic Object Detection Using YOLOV8s with Spatial-to-Depth Convolution and Small Detection Head. GPA: 3.75/4.00 (cumlaude)',
      type: ExperienceType.EDUCATION,
      order: 7,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ ${experiences.length} experiences seeded`);
  } // end else

  // ─── Seed Profile ─────────────────────────────────────
  const existingProfile = await prisma.profile.count();
  if (existingProfile > 0) {
    console.log('⏭️  Profile already exists, skipping...');
  } else {
    await prisma.profile.create({
      data: {
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
        githubUrl: 'https://github.com/snazrimuh',
        linkedinUrl: 'https://linkedin.com/in/syahrizannazri/',
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
      },
    });
    console.log('✅ Profile seeded');
  }

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

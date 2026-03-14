import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable compression
  app.use(compression());

  // Add Cache-Control for GET requests (1 hour cache for public data)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.url.includes('/auth') && !req.url.includes('/admin')) {
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    }
    next();
  });

  // Global prefix: all routes start with /api
  app.setGlobalPrefix('api');

  // Enable CORS for the Nuxt frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      /\.vercel\.app$/,   // semua subdomain vercel
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Portfolio API running on http://localhost:${port}/api`);
}

bootstrap();

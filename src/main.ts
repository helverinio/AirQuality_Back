import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar el límite del tamaño del body y asegurar que se parsee JSON
  app.use(express.json({ limit: '50mb' }));
// Enable CORS for all origins (for development)
  app.enableCors({
    origin: true, // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite cookies y credenciales
  });
  // Enable global class serializer interceptor so @Exclude on entities works
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Optional: enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

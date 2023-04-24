import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { WEB_SITE_URL } from './app.config';
import { EntityNotFoundExceptionFilter } from './modules/todos/exception/entity.not-found.exception.filter';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: WEB_SITE_URL });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  return app;
}

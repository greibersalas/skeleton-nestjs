import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // add this line
  app.setGlobalPrefix('api');
  app.use(express.static(join(process.cwd(), '../uploads/')));
  await app.listen(AppModule.port);
}
bootstrap();

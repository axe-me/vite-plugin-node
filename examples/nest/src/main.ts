/// <reference types="vite/client" />
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

if (import.meta.env?.PROD) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }

  bootstrap();
}

export const viteNodeApp = NestFactory.create(AppModule);

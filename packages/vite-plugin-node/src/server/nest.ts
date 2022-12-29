import type { INestApplication } from '@nestjs/common';
import type { RequestAdapter } from '..';

let prevApp: INestApplication;

export const NestHandler: RequestAdapter<INestApplication> = async ({ app, req, res }) => {
  if (!(<any>app).isInitialized) {
    if (prevApp)
      await prevApp.close();

    await app.init();
    prevApp = app;
  }
  const instance = app.getHttpAdapter().getInstance();

  // Todo: handle nest-fastify case

  instance(req, res);
};

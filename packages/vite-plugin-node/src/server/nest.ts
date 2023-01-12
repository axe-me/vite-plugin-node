import type { INestApplication } from '@nestjs/common';
import type { RequestAdapter } from '..';

let prevApp: INestApplication;

export const NestHandler: RequestAdapter<INestApplication> = async ({ app, req, res }) => {
  // @ts-expect-error nest app typing error
  if (!app.isInitialized) {
    if (prevApp)
      await prevApp.close();

    await app.init();
    prevApp = app;
  }

  const instance = app.getHttpAdapter().getInstance();

  if (typeof instance === 'function') {
    instance(req, res);
  } else {
    const fastifyApp = await instance.ready();
    fastifyApp.routing(req, res);
  }
};

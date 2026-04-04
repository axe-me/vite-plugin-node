import type { INestApplication } from '@nestjs/common';
import type { RequestAdapter } from '..';

let prevApp: INestApplication;
let initializing = false;

export const NestHandler: RequestAdapter<INestApplication> = async ({ app, req, res }) => {
  // @ts-expect-error nest app typing error
  if (!app.isInitialized) {
    while (initializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    initializing = true;

    try {
      if (prevApp)
        await prevApp.close();

      await app.init();
      prevApp = app;
    } finally {
      initializing = false;
    }
  }

  const instance = app.getHttpAdapter().getInstance();

  if (typeof instance === 'function') {
    instance(req, res);
  } else {
    const fastifyApp = await instance.ready();
    fastifyApp.routing(req, res);
  }
};

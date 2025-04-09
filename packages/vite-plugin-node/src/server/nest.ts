import type { INestApplication } from '@nestjs/common';
import { RawServerDefault } from 'fastify';
let prevApp: NestFastifyApplication<RawServerDefault>;
import type { RequestAdapter } from '..';

let prevApp: NestFastifyApplication<RawServerDefault>;
let nestInitInProgress: Promise<void> | undefined;

export const NestHandler: RequestAdapter<INestApplication> = async ({ app, req, res }) => {
  // If not initialized, ensure that we only initialize once
  if (!app.isInitialized) {
    if (!nestInitInProgress) {
      nestInitInProgress = (async () => {
        if (prevApp) {
          await prevApp.close();
        }
        await app.init();
        prevApp = app;
        nestInitInProgress = undefined;
      })();
    }
    await nestInitInProgress;
  }

  const instance = app.getHttpAdapter().getInstance();

  if (typeof instance === 'function') {
    instance(req, res);
  } else {
    const fastifyApp = await instance.ready();
    fastifyApp.routing(req, res);
  }
};

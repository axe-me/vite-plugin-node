import type { INestApplication } from '@nestjs/common';
import type { RequestAdapter } from '..';

export const NestHandler: RequestAdapter<INestApplication> = async ({ app, req, res }) => {
  await app.init();
  const instance = app.getHttpAdapter().getInstance();

  if(typeof instance === 'function')
    instance(req, res);
  else {
    const fastifyApp = await instance.ready();
    fastifyApp.routing(req, res);
  }
};

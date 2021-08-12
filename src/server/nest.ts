import type { INestApplication } from '@nestjs/common';
import { RequestHandler } from "..";

export const NestHandler: RequestHandler<INestApplication> = async (app, req, res) => {
  const nestApp = await app as INestApplication;
  await nestApp.init();
  const instance = nestApp.getHttpAdapter().getInstance();

  // Todo: handle nest-fastify case

  instance(req, res)
}

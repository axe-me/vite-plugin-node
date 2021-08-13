import type { INestApplication } from '@nestjs/common';
import { RequestHandler } from "..";

export const NestHandler: RequestHandler<INestApplication> = async (app, req, res) => {
  await app.init();
  const instance = app.getHttpAdapter().getInstance();

  // Todo: handle nest-fastify case

  instance(req, res)
}

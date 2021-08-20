import type { INestApplication } from '@nestjs/common';
import { RequestAdapter } from "..";

export const NestHandler: RequestAdapter<INestApplication> = async (app, req, res) => {
  await app.init();
  const instance = app.getHttpAdapter().getInstance();

  // Todo: handle nest-fastify case

  instance(req, res)
}

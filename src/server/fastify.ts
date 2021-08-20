import { RequestAdapter } from "..";
import { FastifyInstance } from "fastify"

export const FastifyHandler: RequestAdapter<FastifyInstance> = async (app, req, res) => {
  await app.ready();

  // @ts-ignore wait this PR https://github.com/fastify/fastify/pull/3270
  app.routing(req, res);
}

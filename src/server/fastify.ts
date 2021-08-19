import { RequestHandler } from "..";
import { FastifyInstance } from "fastify"

export const FastifyHandler: RequestHandler<FastifyInstance> = async (app, req, res) => {
  await app.ready();

  // @ts-ignore wait this PR https://github.com/fastify/fastify/pull/3270
  app.routing(req, res);
}

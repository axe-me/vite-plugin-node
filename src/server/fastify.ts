import { RequestHandler } from "..";
import { FastifyInstance } from "fastify"

export const FastifyHandler: RequestHandler<FastifyInstance> = async (app, req, res) => {
  await app.ready();

  app.server.emit('request', req, res);
}

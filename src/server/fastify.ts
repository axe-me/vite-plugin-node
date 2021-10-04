import { FastifyInstance } from "fastify";
import { RequestAdapter } from "..";

export const FastifyHandler: RequestAdapter<FastifyInstance> = async (
  app,
  req,
  res
) => {
  await app.ready();
  app.routing(req, res);
};

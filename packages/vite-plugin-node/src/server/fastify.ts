import type { FastifyInstance } from 'fastify';
import type { RequestAdapter } from '..';

export const FastifyHandler: RequestAdapter<FastifyInstance> = async ({ app, req, res }) => {
  await app.ready();
  app.routing(req, res);
};

import type { FastifyInstance } from 'fastify';
import type { RequestAdapter } from '../index.js';

export const FastifyHandler: RequestAdapter<FastifyInstance> = async ({ app, req, res }) => {
  await app.ready();
  app.routing(req, res);
};

import type Koa from 'koa';
import type { RequestAdapter } from '../index.js';

export const KoaHandler: RequestAdapter<Koa> = ({ app, req, res }) => {
  app.callback()(req, res);
};

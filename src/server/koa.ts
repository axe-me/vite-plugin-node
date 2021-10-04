import Koa from 'koa';
import { RequestAdapter } from '..';

export const KoaHandler: RequestAdapter<Koa> = (app, req, res) => {
  app.callback()(req, res);
};

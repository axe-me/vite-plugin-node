import Koa from 'koa';
import { RequestHandler } from "..";

export const KoaHandler: RequestHandler<Koa> = (app, req, res) => {
  app.callback()(req, res);
}

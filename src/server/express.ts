import { Application } from 'express';
import { RequestHandler } from "..";

export const ExpressHandler: RequestHandler<Application> = (app, req, res) => {
  app(req, res)
}
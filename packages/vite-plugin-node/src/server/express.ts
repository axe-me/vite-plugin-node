import type { Application } from 'express';
import type { RequestAdapter } from '..';

export const ExpressHandler: RequestAdapter<Application> = ({ app, req, res }) => {
  app(req, res);
};

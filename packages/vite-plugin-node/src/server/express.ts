import type { Application } from 'express';
import type { RequestAdapter } from '../index.js';

export const ExpressHandler: RequestAdapter<Application> = ({ app, req, res }) => {
  app(req, res);
};

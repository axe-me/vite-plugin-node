import { Application } from "express";
import { RequestAdapter } from "..";

export const ExpressHandler: RequestAdapter<Application> = (app, req, res) => {
  app(req, res);
};

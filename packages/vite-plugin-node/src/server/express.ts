import type { Application } from 'express';
import type { RequestAdapter } from '..';

export const ExpressHandler: RequestAdapter<Application> = ({ app, req, res, server, next: nextType }) => {
  // Add error handling middleware to fix stack traces
  app.use((err: unknown, _req: typeof req, _res: typeof res, next: typeof nextType) => {
    if (err instanceof Error)
      server.ssrFixStacktrace(err);

    next(err);
  });

  app(req, res);
};

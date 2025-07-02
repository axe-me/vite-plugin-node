import type { IncomingMessage, ServerResponse } from 'http';
import chalk from 'chalk';
import type {
  Connect,
  ViteDevServer,
} from 'vite';
import debounce from 'debounce';
import type {
  RequestAdapter,
  RequestAdapterOption,
  VitePluginNodeConfig,
} from '..';
import { createDebugger } from '../utils';
import { ExpressHandler } from './express';
import { FastifyHandler } from './fastify';
import { KoaHandler } from './koa';
import { NestHandler } from './nest';
import { MarbleHandler } from './marble';

export const debugServer = createDebugger('vite:node-plugin:server');

export const SUPPORTED_FRAMEWORKS = {
  express: ExpressHandler,
  nest: NestHandler,
  koa: KoaHandler,
  fastify: FastifyHandler,
  marble: MarbleHandler,
};

const getRequestHandler = (
  handler: RequestAdapterOption,
): RequestAdapter | undefined => {
  if (typeof handler === 'function') {
    debugServer(chalk.dim`using custom server handler`);
    return handler;
  }
  debugServer(chalk.dim`creating ${handler} node server`);
  return SUPPORTED_FRAMEWORKS[handler] as RequestAdapter;
};

export const createMiddleware = async (
  server: ViteDevServer,
  config: VitePluginNodeConfig,
): Promise<Connect.HandleFunction> => {
  const logger = server.config.logger;
  const requestHandler = getRequestHandler(config.adapter);

  async function _loadApp(config: VitePluginNodeConfig) {
    const appModule = await server.ssrLoadModule(config.appPath);
    let app = appModule[config.exportName!];
    if (!app) {
      logger.error(
        `Failed to find a named export ${config.exportName} from ${config.appPath}`,
      );
      process.exit(1);
    } else {
      // some app may be created with a function returning a promise
      app = await app;
      return app;
    }
  }

  if (!requestHandler) {
    console.error('Failed to find a request handler');
    process.exit(1);
  }

  if (config.initAppOnBoot) {
    server.httpServer!.once('listening', async () => {
      await _loadApp(config);
    });
  }

  if (config.watchFileChanges) {
    const debounceDelayMs = 500;

    server.watcher.on('change', debounce(async () => {
      await _loadApp(config);
    }, debounceDelayMs));
  }

  return async function (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ): Promise<void> {
    const app = await _loadApp(config);
    if (app)
      await requestHandler({ app, server, req, res, next });
  };
};

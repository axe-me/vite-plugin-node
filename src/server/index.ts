import chalk from 'chalk';
import http from 'http';
import { exit } from 'process';
import { Connect, Plugin, ViteDevServer } from 'vite';
import {
  PLUGIN_NAME,
  RequestAdapter,
  RequestAdapterOption,
  ViteConfig,
  VitePluginNodeConfig,
} from '..';
import { createDebugger } from '../utils';
import { ExpressHandler } from './express';
import { FastifyHandler } from './fastify';
import { KoaHandler } from './koa';
import { NestHandler } from './nest';

export const debugServer = createDebugger('vite:node-plugin:server');

export const SUPPORTED_FRAMEWORKS = {
  express: ExpressHandler,
  nest: NestHandler,
  koa: KoaHandler,
  fastify: FastifyHandler,
};

export const getPluginConfig = (
  server: ViteDevServer
): VitePluginNodeConfig => {
  const plugin = server.config.plugins.find(
    (p) => p.name === PLUGIN_NAME
  ) as Plugin;

  if (!plugin) {
    console.error('Please setup VitePluginNode in your vite.config.js first');
    exit(1);
  }

  return (plugin.config!({}, { command: 'serve', mode: '' }) as ViteConfig)
    .VitePluginNodeConfig;
};

const getRequestHandler = (
  handler: RequestAdapterOption
): RequestAdapter | undefined => {
  if (typeof handler === 'function') {
    debugServer(chalk.dim`server config set to custom`);
    return handler;
  }
  debugServer(chalk.dim`creating ${handler} node server`);
  return SUPPORTED_FRAMEWORKS[handler] as RequestAdapter;
};

export const createMiddleware = (
  server: ViteDevServer
): Connect.HandleFunction => {
  const config = getPluginConfig(server);
  const logger = server.config.logger;
  const requestHandler = getRequestHandler(config.adapter);

  if (!requestHandler) {
    console.error('Failed to find a request handler');
    process.exit(1);
  }

  return async function (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    const appModule = await server.ssrLoadModule(config.appPath);
    let app = appModule[config.exportName!];
    if (!app) {
      logger.error(
        `Failed to find a named export ${config.exportName} from ${config.appPath}`
      );
      process.exit(1);
    } else {
      // some app may be created with a function returning a promise
      app = await app;
      await requestHandler(app, req, res);
    }
  };
};

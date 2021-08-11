import chalk from 'chalk';
import { exit } from "process";
import { Plugin, ViteDevServer } from "vite";
import { IServer, PLUGIN_NAME, SupportedServer, ViteConfig, VitePluginNodeConfig } from "..";
import { createDebugger } from '../utils';
import { ExpressServer } from "./express-server";
import { NestServer } from "./nest-server";
import { KoaServer } from "./koa-server";
import { FastifyServer } from "./fastify-server";

export const debugServer = createDebugger('vite:node-plugin:server')

export const SUPPORTED_SERVERS: Record<SupportedServer, IServer> = {
  'express': ExpressServer,
  'nest': NestServer,
  'koa': KoaServer,
  'fastify': FastifyServer
}

export const GetPluginConfig = (server: ViteDevServer): VitePluginNodeConfig => {
  const plugin = server.config.plugins.find((p) => p.name === PLUGIN_NAME) as Plugin;

  if (!plugin) {
    console.error('Please setup VitePluginNode in your vite.config.js first');
    exit(1);
  }

  return (plugin.config!({}, { command: 'serve', mode: '' }) as ViteConfig).VitePluginNodeConfig
}

export const MakeServer = async (server: ViteDevServer): Promise<IServer> => {
  let nodeServer: IServer | undefined;

  const config = GetPluginConfig(server);

  if (config.server === 'custom') {
    debugServer(chalk.dim`server config set to custom`);

    if (config.createCustomServer) {
      debugServer(chalk.dim`creating custom node server`);
      nodeServer = config.createCustomServer();
    }
  } else {
    debugServer(chalk.dim`creating ${config.server} node server`);
    nodeServer = SUPPORTED_SERVERS[config.server] as IServer;
  }

  if (nodeServer) {
    debugServer(chalk.dim`creating ${config.server} app`);
    await nodeServer.start(server, config);
  } else {
    console.error('Failed to create node server');
    process.exit(1)
  }

  return nodeServer;
}


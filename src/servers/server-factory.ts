import chalk from 'chalk';
import { exit } from "process";
import { HMRPayload, Plugin, ViteDevServer } from "vite";
import { client as WebSocketClient } from 'websocket';
import { IServer, PLUGIN_NAME, SupportedServer, ViteConfig, VitePluginNodeConfig, WS_PORT } from "..";
import { createDebugger } from '../utils';
import { ExpressServer } from "./express-server";
import { NestServer } from "./nest-server";

export const debugServer = createDebugger('vite:node-plugin:server')

export const SUPPORTED_SERVERS: Record<SupportedServer, IServer> = {
  'express': ExpressServer,
  'nest': NestServer
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
    await nodeServer.create(server, config);
    createWebsoketClient(server, nodeServer, config);
  } else {
    console.error('Failed to create node server');
    process.exit(1)
  }

  return nodeServer;
}

const createWebsoketClient = (server: ViteDevServer, nodeServer: IServer, config: VitePluginNodeConfig): WebSocketClient => {
  const wsc = new WebSocketClient();
  const logger = server.config.logger;

  wsc.on('connectFailed', async (error) => {
      logger.info(chalk.red`Fail to connect to Vite WebSocket, Error: ${error.toString()}\n`);
      await nodeServer.close();
  });

  wsc.on('connect', (connection) => {
      logger.info('Connected to Vite WebSocket');

      connection.on('error', async (error) => {
          logger.info(chalk.red`Vite WebSocket Connection Error: ${error.toString()}`);
          await nodeServer.close();
      });
      connection.on('close', async () => {
          logger.info(chalk.yellow`Vite WebSocket Connection Closed`);
          await nodeServer.close();
      });
      connection.on('message', async (message) => {
        if (message.type === 'utf8') {
          const payload = JSON.parse(message.utf8Data as string) as HMRPayload;
          debugServer(chalk.dim`[ws] recived: ${payload}`);

          if (payload.type === 'connected') {
            logger.clearScreen('info');
            logger.info(chalk.green`Connected to Vite Dev Server`, { timestamp: true });

            await nodeServer.start();
            debugServer(chalk.dim`[ws] server started`);

            logger.info(chalk.green`Node Server Started`, { timestamp: true });
          } else if (payload.type === 'error') {
            logger.error(chalk.red`Something went wrong with HMR, shutting down...`, { timestamp: true });
            await nodeServer.close();
            debugServer(chalk.dim`[ws] server closed`);
            exit(1);
          } else { // handle module updates
            debugServer(chalk.dim`[ws] on updated, reloading app`);
            await nodeServer.create(server, config); // reload app
            debugServer(chalk.dim`[ws] on updated, app reloaded, retarting server`);
            await nodeServer.restart();
            debugServer(chalk.dim`[ws] on updated, server retarted`);
            logger.info(chalk.yellow`Node Server Reloaded`, { timestamp: true });
          }
        }
      });
  });

  wsc.connect(`ws://localhost:${WS_PORT}`);

  return wsc;
}


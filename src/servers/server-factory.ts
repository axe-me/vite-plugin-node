import chalk from 'chalk';
import { exit } from "process";
import { HMRPayload, Plugin, ViteDevServer } from "vite";
import { client as WebSocketClient } from 'websocket';
import { IServer, PLUGIN_NAME, SupportedServer, ViteConfig, VitePluginNodeConfig, WS_PORT } from "..";
import { ExpressServer } from "./express-server";
import { NestServer } from "./nest-server";

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
    if (config.createCustomServer) {
      nodeServer = config.createCustomServer();
    }
  } else {
    nodeServer = SUPPORTED_SERVERS[config.server] as IServer;
  }

  if (nodeServer) {
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

          if (payload.type === 'connected') {
            logger.clearScreen('info');
            logger.info(chalk.green`Connected to Vite Dev Server \n`, { timestamp: true });

            await nodeServer.start();

            logger.info(chalk.green`Node Server Started \n`, { timestamp: true });
          } else if (payload.type === 'error') {
            logger.error(chalk.red`Something went wrong with HMR, shutting down... \n`, { timestamp: true });
            await nodeServer.close();
            exit(1);
          } else { // handle module updates
            await nodeServer.restart();
            logger.info(chalk.yellow`Node Server Reloaded \n`, { timestamp: true });
          }
        }
      });
  });

  wsc.connect(`ws://localhost:${WS_PORT}`);

  return wsc;
}


import chalk from 'chalk';
import { exit } from 'process';
import { createServer, HMRPayload } from 'vite';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import { WS_PORT } from '.';
import { MakeServer } from './servers/server-factory';

async function bootstrap() {
  // vite server config is managed by the plugin
  const viteServer = await createServer();
  const logger = viteServer.config.logger;
  logger.clearScreen('info');
  logger.info(chalk.yellow`Vite Dev Server Created \n`, { timestamp: true });

  const wsc = new WebSocketClient(`ws://localhost:${WS_PORT}`);

  const nodeServer = await MakeServer(viteServer);

  wsc.onmessage = async ({ data }) => {
    const payload = JSON.parse(data as string) as HMRPayload;
    logger.info(data as string, { timestamp: true });
    if (payload.type === 'connected') {
      logger.clearScreen('info');
      logger.info(chalk.green`Connected to Vite Dev Server \n`, { timestamp: true });

      await nodeServer.start();

      logger.info(chalk.green`Node Server Started \n`, { timestamp: true });
    } else if (payload.type === 'error') {
      logger.error(chalk.red`Something went wrong with HMR, shutting down... \n`, { timestamp: true });
      await nodeServer.close();
      wsc.close();
      exit(1);
    } else {
      await nodeServer.restart();
      logger.info(chalk.yellow`Node Server Reloaded \n`, { timestamp: true });
    }
  };
}

bootstrap();

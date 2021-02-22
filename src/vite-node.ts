import { exit } from 'process';
import { createServer, HMRPayload } from 'vite';
import * as WebSocket from 'ws';
import { WS_PORT } from '.';
import { MakeServer } from './servers/ServerFactory';

async function bootstrap() {
  // vite server config is managed by the plugin
  const viteServer = await createServer();

  const ws = new WebSocket(`ws://localhost:${WS_PORT}`);

  const logger = viteServer.config.logger;

  const nodeServer = await MakeServer(viteServer);

  ws.onmessage = async ({ data }) => {
    const payload = JSON.parse(data as string) as HMRPayload;
    logger.info(data as string);
    if (payload.type === 'connected') {
      await nodeServer.start();
    } else if (payload.type === 'error') {
      logger.error('something went wrong from HMR');
      await nodeServer.close();
      ws.close();
      exit(1);
    } else {
      await nodeServer.restart();
    }
  };
}

bootstrap();

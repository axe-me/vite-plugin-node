import { exit } from 'process';
import { createServer, HMRPayload } from 'vite';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import { WS_PORT } from '.';
import { MakeServer } from './servers/server-factory';

async function bootstrap() {
  // vite server config is managed by the plugin
  const viteServer = await createServer();

  const wsc = new WebSocketClient(`ws://localhost:${WS_PORT}`);

  const logger = viteServer.config.logger;

  const nodeServer = await MakeServer(viteServer);

  wsc.onmessage = async ({ data }) => {
    const payload = JSON.parse(data as string) as HMRPayload;
    logger.info(data as string);
    if (payload.type === 'connected') {
      await nodeServer.start();
    } else if (payload.type === 'error') {
      logger.error('something went wrong from HMR');
      await nodeServer.close();
      wsc.close();
      exit(1);
    } else {
      await nodeServer.restart();
    }
  };
}

bootstrap();

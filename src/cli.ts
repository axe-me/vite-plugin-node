import { INestApplication } from '@nestjs/common';
import { exit } from 'process';
import { createServer, HMRPayload } from 'vite';
import * as WebSocket from 'ws';

async function bootstrap() {
  console.log('bootstrap');
  let app: INestApplication;

  const viteServer = await createServer({
    server: {
      middlewareMode: true,
    },
  });

  const ws = new WebSocket('ws://localhost:24678');

  const logger = viteServer.config.logger;

  async function createNestApp(): Promise<INestApplication> {
    const { createApp } = await viteServer.ssrLoadModule('./src/main.ts');
    app = await createApp;
    app.use(viteServer.middlewares);

    return app;
  }

  ws.onmessage = async ({ data }) => {
    const payload = JSON.parse(data as string) as HMRPayload;
    logger.info(data as string);
    if (payload.type === 'connected') {
      app = await createNestApp();
      await app.listen(3000);
    } else if (payload.type === 'error') {
      logger.error('something went wrong');
      ws.close();
      exit(0);
    } else {
      if (app) {
        await app.close();
      }
      app = await createNestApp();
      await app.listen(3000);
    }
  };
}

bootstrap();

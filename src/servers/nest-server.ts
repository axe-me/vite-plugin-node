import type { INestApplication } from '@nestjs/common';
import { IServer } from "..";
import { createDebugger } from '../utils';
import http from 'http';
import chalk from "chalk"

export const debugNest = createDebugger('vite:node-plugin:nest')

export const NestServer: IServer<INestApplication> = {
  async start (server, config) {
    const logger = server.config.logger;
    const httpServer = http.createServer(async (req, res) => {
      const { viteNodeApp } = await server.ssrLoadModule(config.appPath);
      const nestApp = await viteNodeApp as INestApplication;
      nestApp.use(server.middlewares);
      await nestApp.init();
      const app = nestApp.getHttpAdapter().getInstance();

      app(req, res)
    });

    httpServer.listen(config.port, config.host, () => {
      logger.info(chalk.greenBright`Server started on http://${config.host}:${config.port}`);
    });
  },
}
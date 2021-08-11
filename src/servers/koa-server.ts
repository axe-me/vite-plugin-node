import Koa from 'koa';
import { IServer } from "..";
import http from "http"
import c2k from 'koa-connect';
import chalk from "chalk"

export const KoaServer: IServer<Koa> = {
  async start (server, config) {
    const logger = server.config.logger;
    const httpServer = http.createServer(async (req, res) => {
      const { viteNodeApp } = await server.ssrLoadModule(config.appPath) as { viteNodeApp: Koa };
      viteNodeApp.use(c2k(server.middlewares));

      viteNodeApp.callback()(req, res);
    });

    httpServer.listen(config.port, config.host, () => {
      logger.info(chalk.greenBright`Server started on http://${config.host}:${config.port}`);
    });
  }
}
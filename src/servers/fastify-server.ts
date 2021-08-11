import { IServer } from "..";
import { FastifyInstance } from "fastify"
import chalk from "chalk"
import http from 'http'

export const FastifyServer: IServer<FastifyInstance> = {
  async start (server, config) {
    const logger = server.config.logger;
  
    const httpServer = http.createServer(async (req, res) => {
      const { viteNodeApp } = await server.ssrLoadModule(config.appPath) as { viteNodeApp: FastifyInstance };
      await viteNodeApp.ready();

      viteNodeApp.server.emit('request', req, res);
    });

    httpServer.listen(config.port, config.host, () => {
      logger.info(chalk.greenBright`Server started on http://${config.host}:${config.port}`);
    });
  }
}
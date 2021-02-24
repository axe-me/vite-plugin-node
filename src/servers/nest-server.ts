import { INestApplication } from '@nestjs/common';
import chalk from 'chalk';
import { IServer } from "..";
import { createDebugger } from '../utils';

export const debugNest = createDebugger('vite:node-plugin:nest')

export const NestServer: IServer<INestApplication> = {
  _app: undefined,
  _server: undefined,
  _config: undefined,
  async create (server, config) {
    this._config = config
    const { createViteNodeApp } = await server.ssrLoadModule(config.appPath);
    this._app = await createViteNodeApp as INestApplication;
    this._app.use(server.middlewares);
    debugNest(chalk.dim`app created`);
  },
  async start () {
    await this._app?.listen(this._config?.port as number);
    debugNest(chalk.dim`server started at port` + chalk.green`${this._config?.port}`);
  },
  async close () {
    await this._app?.close();
    debugNest(chalk.dim`server closed`);
  },
  async restart () {
    debugNest(chalk.dim`server restarting`);
    if (this._app) {
      await this.close();
    }
    await this.start()
  },
}
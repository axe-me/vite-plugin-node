import chalk from 'chalk';
import { Application } from 'express';
import { Server } from 'http';
import { IServer } from "..";
import { createDebugger } from '../utils';

export const debugExpress = createDebugger('vite:node-plugin:express')

export const ExpressServer: IServer<Application> = {
  _app: undefined,
  _server: undefined,
  _config: undefined,
  async create (server, config) {
    this._config = config
    const { createViteNodeApp } = await server.ssrLoadModule(this._config.appPath);
    this._app = createViteNodeApp as Application;
    this._app.use(server.middlewares);
    debugExpress(chalk.dim`app created`);
  },
  async start () {
    this._server = await new Promise((resolve, reject) => {
      const server = this._app?.listen(this._config?.port, () => {
        resolve(server)
      });
    })
    debugExpress(chalk.dim`server started at port ${this._config?.port}`);
  },
  async close () {
    await (this._server as Server)?.close();
    debugExpress(chalk.dim`server closed`);
  },
  async restart () {
    debugExpress(chalk.dim`server restarting`);
    if (this._server) {
      await this.close();
    }
    await this.start()
  },
}
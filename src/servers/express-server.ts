import { Application } from 'express';
import { IServer } from "..";

export const ExpressServer: IServer<Application> = {
  _app: undefined,
  _server: undefined,
  _config: undefined,
  async create (server, config) {
    this._config = config
    const { createViteNodeApp } = await server.ssrLoadModule(this._config.appPath);
    this._app = createViteNodeApp as Application;
    this._app.use(server.middlewares);
  },
  async start () {
    this._server = await new Promise((resolve, reject) => {
      const server = this._app?.listen(this._config?.port, () => {
        resolve(server)
      });
    })
  },
  async close () {
    await this._server?.close();
  },
  async restart () {
    if (this._app) {
      await this.close();
    }
    await this.start()
  },
}
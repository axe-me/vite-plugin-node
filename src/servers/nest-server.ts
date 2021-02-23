import { INestApplication } from '@nestjs/common';
import { IServer } from "..";

export const NestServer: IServer<INestApplication> = {
  _app: undefined,
  _server: undefined,
  _config: undefined,
  async create (server, config) {
    const { createViteNodeApp } = await server.ssrLoadModule(config.appPath);
    this._app = await createViteNodeApp as INestApplication;
    this._app.use(server.middlewares);
  },
  async start () {
    await this._app?.listen(this._config?.port as number);
  },
  async close () {
    await this._app?.close();
  },
  async restart () {
    if (this._app) {
      await this.close();
    }
    this.start()
  },
}
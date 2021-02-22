import { INestApplication } from '@nestjs/common';
import { IServer } from "..";

export const NestServer: IServer<INestApplication> = {
  _app: null,
  _server: null,
  _config: null,
  async create (server, config) {
    const { createApp } = await server.ssrLoadModule(config.appPath);
    this._app = await createApp as INestApplication;
    this._app.use(server.middlewares);
  },
  async start () {
    await this._app.listen(this._config.port);
  },
  async close () {
    await this._app.close();
  },
  async restart () {
    if (this._app) {
      await this.close();
    }
    this.start()
  },
}
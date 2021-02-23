import { exit } from "process";
import { Plugin, ViteDevServer } from "vite";
import { IServer, PLUGIN_NAME, SupportedServer, ViteConfig, VitePluginNodeConfig } from "..";
import { ExpressServer } from "./express-server";
import { NestServer } from "./nest-server";

export const SUPPORTED_SERVERS: Record<SupportedServer, IServer> = {
  'express': ExpressServer,
  'nest': NestServer
}

export const GetPluginConfig = (server: ViteDevServer): VitePluginNodeConfig => {
  const plugin = server.config.plugins.find((p) => p.name === PLUGIN_NAME) as Plugin;

  if (!plugin) {
    console.error('Please setup VitePluginNode in your vite.config.js first');
    exit(1);
  }

  return (plugin.config!({}, { command: 'serve', mode: '' }) as ViteConfig).VitePluginNodeConfig
}

export const MakeServer = async (server: ViteDevServer): Promise<IServer> => {
  let nodeServer: IServer | undefined;

  const config = GetPluginConfig(server);

  if (config.server === 'custom') {
    if (config.createCustomServer) {
      nodeServer = config.createCustomServer();
    }
  } else {
    nodeServer = SUPPORTED_SERVERS[config.server] as IServer;
  }

  if (nodeServer) {
    await nodeServer.create(server, config);
  } else {
    console.error('Failed to create node server')
    process.exit(1)
  }

  return nodeServer;
}


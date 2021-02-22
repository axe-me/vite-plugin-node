import { ViteDevServer } from "vite";
import { IServer, PLUGIN_NAME, ViteConfig, VitePluginNodeConfig } from "..";
import { ExpressServer } from "./ExpressServer";
import { NestServer } from "./NestServer";

export const SUPPORTED_SERVERS = {
  'express': ExpressServer,
  'nest': NestServer
}

export const GetPluginConfig = (server: ViteDevServer): VitePluginNodeConfig => {
  const plugin = server.config.plugins.find((p) => p.name === PLUGIN_NAME);

  return (plugin.config({}, { command: 'serve', mode: '' }) as ViteConfig).VitePluginNodeConfig
}

export const MakeServer = async (server: ViteDevServer): Promise<IServer> => {
  let nodeServer: IServer;

  const config = GetPluginConfig(server);

  if (config.framework === 'custom') {
    if (config.createCustomServer) {
      nodeServer = config.createCustomServer();
    }
  } else {
    nodeServer = SUPPORTED_SERVERS[config.framework] as IServer;
  }

  if (nodeServer) {
    await nodeServer.create(server, config);
  } else {
    console.error('Failed to create node server')
    process.exit(1)
  }

  return nodeServer;
}


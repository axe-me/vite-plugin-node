import * as http from 'http';
import { UserConfig, ViteDevServer } from "vite";
export { VitePluginNode } from "./vite-plugin-node";

export declare interface IServer<APP = {}, SERVER = http.Server> {
  _app?: APP;
  _server?: SERVER;
  _config?: VitePluginNodeConfig;
  create: (server: ViteDevServer, config: VitePluginNodeConfig) => Promise<void> | void;
  start: () => Promise<void> | void;
  close: () => Promise<void> | void;
  restart: () => Promise<void> | void;
}

export const WS_PORT = 24678;

export const PLUGIN_NAME = 'vite-plugin-node'

export declare type SupportedServer = 'express' | 'nest'
export declare type CustomServer = 'custom'
export declare type ServerConfig = SupportedServer | CustomServer

export declare type SupportedTSCompiler = 'esbuild' | 'swc'

export interface VitePluginNodeConfig {
  appPath: string;
  port: number;
  server: ServerConfig;
  tsCompiler: SupportedTSCompiler;
  createCustomServer?: () => IServer;
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig;
}

import * as http from 'http';
import { UserConfig, ViteDevServer } from "vite";
export { VitePluginNode } from "./vite-plugin-node";

export interface IServer<APP = {}, SERVER = http.Server> {
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

export interface VitePluginNodeConfig {
  appPath: string;
  port: number;
  framework: 'express' | 'nest' | 'custom';
  tsCompiler: 'esbuild' | 'swc';
  createCustomServer?: () => IServer;
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig;
}

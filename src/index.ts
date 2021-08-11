import { UserConfig, ViteDevServer } from "vite";
export { RollupPluginSwc } from "./rollup-plugin-swc";
export { VitePluginNode } from "./vite-plugin-node";

export declare interface IServer<APP = {}> {
  start: (server: ViteDevServer, config: VitePluginNodeConfig) => Promise<void> | void;
}

export const WS_PORT = 24678;

export const PLUGIN_NAME = 'vite-plugin-node'

export declare type SupportedServer = 'express' | 'nest' | 'koa' | 'fastify'
export declare type CustomServer = 'custom'
export declare type ServerConfig = SupportedServer | CustomServer

export declare type SupportedTSCompiler = 'esbuild' | 'swc'

export interface VitePluginNodeConfig {
  appPath: string;
  port: number;
  host?: string;
  server: ServerConfig;
  tsCompiler?: SupportedTSCompiler;
  createCustomServer?: () => IServer;
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig;
}

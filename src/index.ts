import { ListenOptions } from "net";
import { UserConfig } from "vite";
import http from "http"

export { RollupPluginSwc } from "./rollup-plugin-swc";
export { VitePluginNode } from "./vite-plugin-node";

export const WS_PORT = 24678;

export const PLUGIN_NAME = 'vite-plugin-node'

export declare type SupportedFrameworks = 'express' | 'nest' | 'koa' | 'fastify'
export declare type RequestHandler<App = {}> = (app: App, req: http.IncomingMessage, res: http.ServerResponse) => void | Promise<void>
export declare type RequestHandlerOption = SupportedFrameworks | RequestHandler

export declare type SupportedTSCompiler = 'esbuild' | 'swc'

export interface VitePluginNodeConfig {
  appPath: string;
  handler: RequestHandlerOption;
  exportName?: string;
  server?: ListenOptions;
  tsCompiler?: SupportedTSCompiler;
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig;
}

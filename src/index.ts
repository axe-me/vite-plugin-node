import http from 'http';
import { UserConfig } from 'vite';

export { RollupPluginSwc } from './rollup-plugin-swc';
export { VitePluginNode } from './vite-plugin-node';

export const PLUGIN_NAME = 'vite-plugin-node';

export declare type SupportedFrameworks =
  | 'express'
  | 'nest'
  | 'koa'
  | 'fastify';
export declare type RequestAdapter<App = {}> = (
  app: App,
  req: http.IncomingMessage,
  res: http.ServerResponse
) => void | Promise<void>;
export declare type RequestAdapterOption = SupportedFrameworks | RequestAdapter;

export declare type SupportedTSCompiler = 'esbuild' | 'swc';

export interface VitePluginNodeConfig {
  appPath: string;
  adapter: RequestAdapterOption;
  exportName?: string;
  tsCompiler?: SupportedTSCompiler;
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig;
}

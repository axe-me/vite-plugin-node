import { Options } from '@swc/core';
import http from 'http';
import { UserConfig, ViteDevServer } from 'vite';

export { RollupPluginSwc } from './rollup-plugin-swc';
export { VitePluginNode } from './vite-plugin-node';

export const PLUGIN_NAME = 'vite-plugin-node';

export declare type SupportedFrameworks =
  | 'express'
  | 'nest'
  | 'koa'
  | 'fastify'
  | 'marble';

export declare type RequestAdapter<App = any> = (
  app: App,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  server: ViteDevServer
) => void | Promise<void>;

export declare type RequestAdapterOption = SupportedFrameworks | RequestAdapter;

export declare type SupportedTSCompiler = 'esbuild' | 'swc';

export interface VitePluginNodeConfig {
  appPath: string;
  adapter: RequestAdapterOption;
  appName?: string;
  exportName?: string;
  tsCompiler?: SupportedTSCompiler;
  swcOptions?: Options
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig;
}

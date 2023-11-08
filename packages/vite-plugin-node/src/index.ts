import type { IncomingMessage, ServerResponse } from 'http';
import type { Options } from '@swc/core';
import type { Connect, UserConfig, ViteDevServer } from 'vite';

export { RollupPluginSwc } from './rollup-plugin-swc';
export { VitePluginNode } from './vite-plugin-node';

export const PLUGIN_NAME = 'vite-plugin-node';

export declare type SupportedFrameworks =
  | 'express'
  | 'nest'
  | 'koa'
  | 'fastify'
  | 'marble';

export declare interface RequestAdapterParams<App> {
  app: App
  server: ViteDevServer
  req: IncomingMessage
  res: ServerResponse
  next: Connect.NextFunction
}

export declare type RequestAdapter<App = any> = (params: RequestAdapterParams<App>) => void | Promise<void>;

export declare type RequestAdapterOption = SupportedFrameworks | RequestAdapter;

export declare type SupportedTSCompiler = 'esbuild' | 'swc';

export interface VitePluginNodeConfig {
  appPath: string
  adapter: RequestAdapterOption
  appName?: string
  initAppOnBoot?: boolean
  exportName?: string
  tsCompiler?: SupportedTSCompiler
  swcOptions?: Options
}

export declare interface ViteConfig extends UserConfig {
  VitePluginNodeConfig: VitePluginNodeConfig
}

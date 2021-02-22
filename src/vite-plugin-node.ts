import swc from 'rollup-plugin-swc';
import { Plugin } from 'vite';

export const PLUGIN_NAME = 'vite-plugin-node'

export interface VitePluginNodeConfig {
  appPath: string;
  framework: 'express' | 'nest';
  tsCompiler: 'esbuild' | 'swc'
}

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin {
  const config = {
    framework: 'express',
    tsCompiler: 'esbuild',
    ...cfg
  };

  const plugins = [];

  if (config.tsCompiler === 'swc') {
    plugins.push({
      ...swc({
        jsc: {
          loose: true,
          target: 'es2020',
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      }),
      enforce: 'pre',
    })
  }

  return {
    name: PLUGIN_NAME,
    config: () => ({
      server: {
        middlewareMode: true,
      },
      plugins
    }),
  };
}

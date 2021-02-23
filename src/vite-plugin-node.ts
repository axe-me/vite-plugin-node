import swc from 'rollup-plugin-swc';
import { Plugin } from 'vite';
import { PLUGIN_NAME, VitePluginNodeConfig, WS_PORT } from '.';

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin {
  const config: VitePluginNodeConfig = {
    tsCompiler: 'esbuild',
    ...cfg
  };

  const plugins: Plugin[] = [];

  if (config.tsCompiler === 'swc') {
    plugins.push({
      ...swc({
        jsc: {
          loose: true,
          target: 'es2019',
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
      apply: 'serve'
    })
  }

  return {
    name: PLUGIN_NAME,
    config: () => ({
      server: {
        middlewareMode: true,
        hmr: {
          port: WS_PORT
        }
      },
      plugins,
      VitePluginNodeConfig: config
    }),
  };
}

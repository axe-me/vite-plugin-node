import { Plugin } from 'vite';
import { PLUGIN_NAME, VitePluginNodeConfig, WS_PORT } from '.';
import { RollupPluginSwc } from "./rollup-plugin-swc";

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin[] {
  const config: VitePluginNodeConfig = {
    appPath: cfg.appPath,
    handler: cfg.handler,
    tsCompiler: cfg.tsCompiler ?? 'esbuild',
    exportName: cfg.exportName ?? 'viteNodeApp',
    server: {
      port: 3000,
      host: 'localhost',
      ...cfg.server
    },
  };

  const plugins: Plugin[] = [
    {
      name: PLUGIN_NAME,
      config: () => ({
        server: {
          middlewareMode: true,
          hmr: {
            port: WS_PORT
          }
        },
        esbuild: config.tsCompiler === 'esbuild' ? {} : false,
        VitePluginNodeConfig: config,
      }),
      apply: 'serve'
    }
  ];

  if (config.tsCompiler === 'swc') {
    plugins.push({
      ...RollupPluginSwc({
        jsc: {
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
      })
    })
  }

  return plugins;
}

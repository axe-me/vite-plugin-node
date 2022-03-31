import { Plugin } from 'vite';
import { PLUGIN_NAME, VitePluginNodeConfig } from '.';
import { RollupPluginSwc } from './rollup-plugin-swc';
import { createMiddleware } from './server';
import mergeDeep from './utils';

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin[] {
  const swcOptions = mergeDeep({
    module: {
      type: 'es6',
    },
    jsc: {
      target: 'es2019',
      parser: {
        syntax: 'typescript',
        decorators: true
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true
      }
    }
  }, cfg.swcOptions ?? {});

  const config: VitePluginNodeConfig = {
    appPath: cfg.appPath,
    adapter: cfg.adapter,
    appName: cfg.appName ?? 'app',
    tsCompiler: cfg.tsCompiler ?? 'esbuild',
    exportName: cfg.exportName ?? 'viteNodeApp',
    swcOptions
  };

  const plugins: Plugin[] = [
    {
      name: PLUGIN_NAME,
      config: () => ({
        build: {
          ssr: config.appPath,
          rollupOptions: {
            input: config.appPath,
          },
        },
        server: {
          hmr: false
        },
        esbuild: config.tsCompiler === 'esbuild' ? {} : false,
        VitePluginNodeConfig: config
      }),
      configureServer: (server) => {
        server.middlewares.use(createMiddleware(server));
      }
    }
  ];

  if (config.tsCompiler === 'swc') {
    plugins.push({
      ...RollupPluginSwc(config.swcOptions!),
    });
  }

  return plugins;
}

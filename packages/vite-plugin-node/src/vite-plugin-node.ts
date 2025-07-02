import type { Plugin } from 'vite';
import { RollupPluginSwc } from './rollup-plugin-swc';
import { createMiddleware } from './server';
import mergeDeep from './utils';
import { PLUGIN_NAME } from '.';
import type { ViteConfig, VitePluginNodeConfig } from '.';

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin[] {
  const swcOptions = mergeDeep({
    module: {
      type: 'es6',
    },
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
  }, cfg.swcOptions ?? {});

  const config: VitePluginNodeConfig = {
    appPath: cfg.appPath,
    adapter: cfg.adapter,
    appName: cfg.appName ?? 'app',
    tsCompiler: cfg.tsCompiler ?? 'esbuild',
    exportName: cfg.exportName ?? 'viteNodeApp',
    initAppOnBoot: cfg.initAppOnBoot ?? false,
    outputFormat: cfg.outputFormat ?? 'cjs',
    swcOptions,
  };

  const plugins: Plugin[] = [
    {
      name: PLUGIN_NAME,
      config: () => {
        const plugincConfig: ViteConfig = {
          build: {
            ssr: config.appPath,
            rollupOptions: {
              input: config.appPath,
              output: {
                format: config.outputFormat,
              },
            },
          },
          server: {
            hmr: false,
          },
          optimizeDeps: {
            noDiscovery: true,
            // Vite does not work well with optionnal dependencies,
            // mark them as ignored for now
            exclude: [
              '@swc/core',
            ],
          },
          VitePluginNodeConfig: config,
        };

        if (config.tsCompiler === 'swc')
          plugincConfig.esbuild = false;

        return plugincConfig;
      },
      configureServer: async (server) => {
        server.middlewares.use(await createMiddleware(server, config));
      },
    },
  ];

  if (config.tsCompiler === 'swc') {
    plugins.push({
      ...RollupPluginSwc(config.swcOptions!),
    });
  }

  return plugins;
}

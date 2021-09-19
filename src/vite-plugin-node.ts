import { Plugin } from 'vite';
import path from 'path';
import { pathToFileURL } from 'url';
import { PLUGIN_NAME, VitePluginNodeConfig } from '.';
import { RollupPluginSwc } from "./rollup-plugin-swc";
import { createMiddleware } from './server';

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin[] {
  const config: VitePluginNodeConfig = {
    appPath: cfg.appPath,
    adapter: cfg.adapter,
    tsCompiler: cfg.tsCompiler ?? 'esbuild',
    exportName: cfg.exportName ?? 'viteNodeApp'
  };

  const singlelineCommentsRE = /\/\/.*/g;
  const multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//gm;

  const plugins: Plugin[] = [
    {
      name: PLUGIN_NAME,
      config: () => ({
        server: {
          hmr: false
        },
        esbuild: config.tsCompiler === 'esbuild' ? {} : false,
        VitePluginNodeConfig: config,
      }),
      transform(code, id) {
        // only transform on development env
        if (process.env.NODE_ENV === 'production') return;

        // transform `import.meta.url` to `normal file url` as nodejs does
        if (/import\.meta\.url/.test(code)) {
          const fileUrl = pathToFileURL(path.resolve(process.cwd(), id)).href;
          const source = 'import.meta.url';
          const target = `'${fileUrl}'`;

          return {
            // first replace all, then retract all replacement for the comments
            code: code.replaceAll(source, target)
              .replace(singlelineCommentsRE, (v) => v.replaceAll(target, source))
              .replace(multilineCommentsRE, (v) => v.replaceAll(target, source)),
          }
        }
      },
      configureServer: (server) => {
        server.middlewares.use(createMiddleware(server))
      },
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

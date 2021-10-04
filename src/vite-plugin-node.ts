import { Plugin } from "vite";
import { PLUGIN_NAME, VitePluginNodeConfig } from ".";
import { RollupPluginSwc } from "./rollup-plugin-swc";
import { createMiddleware } from "./server";

export function VitePluginNode(cfg: VitePluginNodeConfig): Plugin[] {
  const config: VitePluginNodeConfig = {
    appPath: cfg.appPath,
    adapter: cfg.adapter,
    tsCompiler: cfg.tsCompiler ?? "esbuild",
    exportName: cfg.exportName ?? "viteNodeApp",
  };

  const plugins: Plugin[] = [
    {
      name: PLUGIN_NAME,
      config: () => ({
        server: {
          hmr: false,
        },
        esbuild: config.tsCompiler === "esbuild" ? {} : false,
        VitePluginNodeConfig: config,
      }),
      configureServer: (server) => {
        server.middlewares.use(createMiddleware(server));
      },
      apply: "serve",
    },
  ];

  if (config.tsCompiler === "swc") {
    plugins.push({
      ...RollupPluginSwc({
        jsc: {
          target: "es2019",
          parser: {
            syntax: "typescript",
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      }),
    });
  }

  return plugins;
}

import { createFilter } from '@rollup/pluginutils';
import type { Compiler, Options } from '@swc/core';
import type { Plugin } from 'vite';
import { SwcFileUpdate, cleanUrl } from './utils';

export function RollupPluginSwc(options: Options, appPath: string): Plugin {
  let swc: Compiler;
  // todo: load swc/tsconfig from config files
  const config: Options = {
    // options from swc config
    ...options,
  };

  const filter = createFilter(/\.(tsx?|jsx)$/, /\.js$/);

  return {
    name: 'rollup-plugin-swc',
    async transform(code, id) {
      if (filter(id) || filter(cleanUrl(id))) {
        if (!swc)
          swc = await import('@swc/core');
        SwcFileUpdate(id, appPath);
        const result = await swc.transform(code, {
          ...config,
          filename: id,
        });
        return {
          code: result.code,
          map: result.map,
        };
      }
    },
  };
}

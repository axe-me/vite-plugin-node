import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  ssr: {
    format: 'cjs',
  },
  server: {
    port: 3699,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './app.ts',
      initAppOnBoot: true,
    }),
  ],
});

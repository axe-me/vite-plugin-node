import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePluginNode } from './../../dist/index';

export default defineConfig({
  build: {
    ssr: true,
    minify: 'esbuild',
    rollupOptions: {
      input: resolve(__dirname, 'app.ts')
    }
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'marble',
      appPath: './app.ts'
    })
  ]
});

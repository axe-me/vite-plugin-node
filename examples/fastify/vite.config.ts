import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      handler: 'fastify',
      appPath: './app.ts',
      server: {
        port: 8888,
      }
    })
  ]
})

import { VitePluginNode } from 'vite-plugin-node';
    /**
     * @type {import('vite').UserConfig}
    */
    const config = {
      // ...
      plugins: [
        ...VitePluginNode({
          server: 'fastify',
          appPath: './app.ts',
          port: 3000,
          host: 'localhost'
        })
      ]
    }

    export default config;
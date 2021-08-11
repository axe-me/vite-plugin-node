import { VitePluginNode } from 'vite-plugin-node';
/**
 * @type {import('vite').UserConfig}
*/
const config = {
  // ...
  plugins: [
    ...VitePluginNode({
      server: 'nest',
      appPath: './src/main.ts',
      port: 3000,
      host: 'localhost',
      tsCompiler: 'swc'
    })
  ]
}

export default config;
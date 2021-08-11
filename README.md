# Vite Plugin Node
-----
> Note: this plugin is still under active development

A [vite](https://vitejs.dev/) plugin to allow you to use vite as node dev server.

## Why?
---
 While frontend development tooling is evolving rapidly in recent years, backend DX is still like in stone age. No hot module replacement; Typescript recompiling slow as funk; Lack of plugin system etc. Thanks to Vitejs created by Evan You (A.K.A creator of vuejs; my biggest idol developer), makes all those dreams for backend development come true!

## How?
----
Vite by design have a middlewareMode which allow us to use vite programmatically inside other module. It's originally made for SSR web app originally. So that for each request, vite can load the renderer to render the latest changes you made to your app. This plugin leverage this feature to load and execute your server app entry.  
  
You may ask isn't super slow since it re-compile/reload entire app from the entry? The answer is NO, because vite is smart. Vite has a builtin module graph as a cache layer, the graph is built up at the first time your app load. After that, when you update one file, vite will only invalidate itself and its parents modules, so that for next request, only those invalidated module need to be re-compiled which is super fast thanks to esbuild and swc.

## Get started
---
1. Install vite and this plugin with your favourite package manager, here use npm as example:
    ```bash
    $ npm install vite vite-plugin-node -D
    ```
2. Create a `vite.config.js` file in your project root to config vite to actually use this plugin:
    ```js
    import { VitePluginNode } from 'vite-plugin-node';
    /**
     * @type {import('vite').UserConfig}
    */
    const config = {
      // ...
      plugins: [
        ...VitePluginNode({
          // the node framework yout are using, 
          // currently this plugin support 'express', 'nest' and 'custom',
          // more framework support incoming!
          // when set this to 'custom', you have to the createCustomServer option // to tell the plugin how to create/start/... your node server
          server: 'express', 

          // tell the plugin where is your project entry
          appPath: './app.ts',

          // the port you want the server to run on
          port: 3000,

          // Optional, default 'localhost' 
          // the host you want the server to run on, default 
          host: 'localhost',

          // Optional, the TypeScript compiler you want to use
          // by default this plugin is using vite default ts compiler which is esbuild
          // 'swc' compiler is supported to use as well for frameworks
          // like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
          tsCompiler: 'esbuild',

          // Required field when set server option to 'custom'
          // For examples, check out './src/servers' folder
          createCustomServer: () => ({
            // your implementation...
          })
        })
      ]
    }

    export default config;

    ```  

3. Update your server entry to export your app named `viteNodeApp`
    ### ExpressJs
    ```ts
    const app = express();

    // your beautiful code...

    if (process.env.NODE_ENV === 'production') {
      app.listen(3000)
    }

    export const viteNodeApp = app;
    ```

    ### KoaJs
    ```ts
    import Koa from 'koa';

    const app = new Koa();
    
    // your beautiful code...

    if (process.env.NODE_ENV === 'production') {
        app.listen(3000)
    }

    export const viteNodeApp = app;
    ```

    ### NestJs
    ```ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';

    if (process.env.NODE_ENV === 'production') {
      async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        await app.listen(3000);
      }

      bootstrap();
    }

    export const viteNodeApp = NestFactory.create(AppModule);
    ```
4. Add a npm script to run the dev server:
    ```json
    "scripts": {
      "dev": "vite-node"
    },
    ```  

5. Run the script! `npm run dev`

## Custom server
If your favourite framework not support yet, you can either create an issue to request it or use the `createCustomServer` option to tell the plugin how to start it. You can take a look how the supported frameworks implement from the `./src/servers` folder. One example:
```js
    import { VitePluginNode } from 'vite-plugin-node';
    /**
     * @type {import('vite').UserConfig}
    */
    const config = {
      // ...
      plugins: [
        ...VitePluginNode({
          server: 'custom', 
          appPath: './app.ts',
          port: 3000,
          createCustomServer: () => ({
            async start (server, config) {
              // we want to load the app on each request, so here we need a http server to
              // pass down the req to your app
              const httpServer = http.createServer(async (req, res) => {
                // use the ssrLoadModule method from Vite dev server to load the app
                const { viteNodeApp } = await server.ssrLoadModule(config.appPath);
                // optionally you can bind the Connect middlewares to your app 
                viteNodeApp.use(server.middlewares);
                // pass the node req and res to your app to handle
                viteNodeApp(req, res)
              });

              // start the http server
              httpServer.listen(config.port, config.host, () => {
                console.log(`Server started on ${config.host}:${config.port}`);
              });
            }
          })
        })
      ]
    }

    export default config;

    ```  
## Examples
See the examples folder. 

## To-Do
As this plugin just fresh developed, there are still lots ideas need to be implemented, including:  
  - [ ] Build the app into a bundle for production.
  - [ ] Support Fastify framework
  - [ ] Read swc config file
  - [ ] Test with large node project
  - [ ] Unit tests

## Bugs
Create an issue if you found any bugs to help me to improve this project please!

# Vite Plugin Node
-----

A [vite](https://vitejs.dev/) plugin to allow you to use vite as node dev server.

## Features
- All the perks from Vite plus:
- Node server HMR! (hot module replacement)
- Support Express, Fastify, Koa and Nest out of box
- Support Custom Server
- You can choose to use `esbuild` or `swc` to compile your typescript files
## Get started
---
1. Install vite and this plugin with your favourite package manager, here use npm as example:
    ```bash
    $ npm install vite vite-plugin-node -D
    ```
2. Create a `vite.config.ts` file in your project root to config vite to actually use this plugin:
    ```ts
    import { defineConfig } from 'vite';
    import { VitePluginNode } from 'vite-plugin-node';

    export default defineConfig({
      plugins: [
        ...VitePluginNode({
          // the node framework yout are using, 
          // currently this plugin support 'express', 'nest', 'koa' and 'fastify',
          // you can also pass a function if you are using other frameworks, see Custom Handler section
          handler: 'express', 

          // tell the plugin where is your project entry
          appPath: './app.ts',

          // Optional, the name of named export of you app from the appPath file
          exportName: 'viteNodeApp',

          // Optional, options pass to server.listen function
          server: { port: 3000, host: 'localhost' }

          // Optional, the TypeScript compiler you want to use
          // by default this plugin is using vite default ts compiler which is esbuild
          // 'swc' compiler is supported to use as well for frameworks
          // like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
          tsCompiler: 'esbuild',
        })
      ]
    }
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

    ### Fastify
    ```ts
    import fastify from 'fastify';

    const app = fastify();

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

## Custom Handler
If your favourite framework not supported yet, you can either create an issue to request it or use the `handler` option to tell the plugin how to pass down the request to your app. You can take a look how the supported frameworks implement from the `./src/server` folder.  
Example:
```ts
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      handler: function(app, req, res) {
        app(res, res)
      },
      appPath: './app.ts'
    })
  ]
})


```
## Examples
See the examples folder. 

## Why?
---
 While frontend development tooling is evolving rapidly in recent years, backend DX is still like in stone age. No hot module replacement; Typescript recompiling slow as funk; Lack of plugin system etc. Thanks to Vitejs created by Evan You (A.K.A creator of vuejs; my biggest idol developer), makes all those dreams for backend development come true!

## How?
----
Vite by design have a middlewareMode which allow us to use vite programmatically inside other module. It's originally made for SSR web app originally. So that for each request, vite can load the renderer to render the latest changes you made to your app. This plugin leverage this feature to load and execute your server app entry.  
  
You may ask isn't super slow since it re-compile/reload entire app from the entry? The answer is NO, because vite is smart. Vite has a builtin module graph as a cache layer, the graph is built up at the first time your app load. After that, when you update one file, vite will only invalidate itself and its parents modules, so that for next request, only those invalidated module need to be re-compiled which is super fast thanks to esbuild and swc.

## To-Do
As this plugin just fresh developed, there are still lots ideas need to be implemented, including:  
  - [ ] Build the app into a bundle for production.
  - [ ] Test with large node project, I need y'all helps on this!
  - [ ] Unit tests

## Bugs
Create an issue if you found any bugs to help me to improve this project please!

# Vite Plugin Node
-----
A [vite](https://vitejs.dev/) plugin to allow you to use vite as node dev server.

## Why?
- While frontend development tooling is evolving rapidly in recent years, backend DX is still like in stone age. No hot module replacement; Typescript recompiling slow as funk; Lack of plugin system etc. Thanks to Vitejs created by Evan You (a.k.a creator of vuejs; my biggest idol developer), makes all those dreams for backend development come true!

## Get started
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
        VitePluginNode({
          // the node framework yout are using, 
          // currently this plugin support 'express', 'nest' and 'custom',
          // more framework support incoming!
          // when set this to 'custom', you have to the createCustomServer option // to tell the plugin how to create/start/... your node server
          server: 'express', 

          // tell the plugin where is your project entry
          appPath: './app.ts',

          // the port you want the server to run on
          port: 3000,

          // Optional, the TypeScript compiler you want to use
          // by default this plugin is using vite default ts compiler which is esbuild
          // 'swc' compiler is supported to use as well for frameworks
          // like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
          tsCompiler: 'esbuild',

          // Required field when set server option to 'custom'
          // For examples, check out './src/servers' folder
          createCustomServer: () => IServer
        })
      ]
    }

    export default config;

    ```  

3. Update your server entry to export your app named `createViteNodeApp`
    ### ExpressJs
    ```ts
    const app = express();

    // your beautiful code...

    if (process.env.NODE_ENV === 'production') {
      app.listen(3000)
    }

    export const createViteNodeApp = app;
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

    export const createViteNodeApp = NestFactory.create(AppModule);

    ```
4. Add a npm script to run the dev server:
    ```json
    "scripts": {
      "dev": "vite-node"
    },
    ```  

5. Run the script! `npm run dev`

## To-Do
As this plugin just fresh developed, there are still lots ideas need to be implemented, including:  
- [ ] Read swc config file
- [ ] Support static files serving
- [ ] Figure out how to do things like run typeorm migrations
- [ ] Unit tests

## Bugs
Create an issue if you found any bugs to helpe me to improve this project

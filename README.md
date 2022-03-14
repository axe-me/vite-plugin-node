<p align="center">
  <img src="./node-vite.png" width="200px">
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vite-plugin-node"><img src="https://img.shields.io/npm/v/vite-plugin-node.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite-plugin-node.svg" alt="node compatibility"></a>
</p>

# Vite Plugin Node

> A [vite](https://vitejs.dev/) plugin to allow you to use vite as node dev server.

## Features

- All the perks from Vite plus:
- Node server HMR! (hot module replacement)
- Support Express, Fastify, Koa and Nest out of the box
- Support Custom Request Adapter
- You can choose to use `esbuild` or `swc` to compile your typescript files

## Get started

---

1. Install vite and this plugin with your favorite package manager, here use npm as example:

   ```bash
   npm install vite vite-plugin-node -D
   ```

2. Create a `vite.config.ts` file in your project root to config vite to actually use this plugin:

   ```ts
   import { defineConfig } from 'vite';
   import { VitePluginNode } from 'vite-plugin-node';

   export default defineConfig({
     // ...vite configures
     server: {
       // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
       port: 3000
     },
     plugins: [
       ...VitePluginNode({
         // Nodejs native Request adapter
         // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
         // you can also pass a function if you are using other frameworks, see Custom Adapter section
         adapter: 'express',

         // tell the plugin where is your project entry
         appPath: './app.ts',

         // Optional, default: 'viteNodeApp'
         // the name of named export of you app from the appPath file
         exportName: 'viteNodeApp',

         // Optional, default: 'esbuild'
         // The TypeScript compiler you want to use
         // by default this plugin is using vite default ts compiler which is esbuild
         // 'swc' compiler is supported to use as well for frameworks
         // like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
         // you need to INSTALL `@swc/core` as dev dependency if you want to use swc
         tsCompiler: 'esbuild',

         // Optional, default: {
         // jsc: {
         //   target: 'es2019',
         //   parser: {
         //     syntax: 'typescript',
         //     decorators: true
         //   },
         //  transform: {
         //     legacyDecorator: true,
         //     decoratorMetadata: true
         //   }
         // }
         //}
         // swc configs, see [swc doc](https://swc.rs/docs/configuration/swcrc)
         swcOptions: {}
       })
     ]
   });
   ```

3. Update your server entry to export your app named `viteNodeApp` or the name you configured.

### ExpressJs

```ts
const app = express();

// your beautiful code...

if (import.meta.env.PROD) {
  app.listen(3000);
}

export const viteNodeApp = app;
```

### KoaJs

```ts
import Koa from 'koa';

const app = new Koa();

// your beautiful code...

if (import.meta.env.PROD) {
  app.listen(3000);
}

export const viteNodeApp = app;
```

### Cloud Functions

```ts
const app = async (req, res) => {
  // your beautiful code...
};

export const viteNodeApp = app;
```

### Fastify

```ts
import fastify from 'fastify';

const app = fastify();

// your beautiful code...

if (import.meta.env.PROD) {
  app.listen(3000);
}

export const viteNodeApp = app;
```

if the app created by an async factory function you can just export the promise.

```ts
import fastify from 'fastify';

const app = async (options) => {
  const app = fastify(options);
  // app logics...
  return app;
};

// note here we need to run the function to get the promise.
export const viteNodeApp = app(options);
```

### NestJs

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

if (import.meta.env.PROD) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }

  bootstrap();
}

export const viteNodeApp = NestFactory.create(AppModule); // this returns a Promise, which is ok, this plugin can handle it
```

4. Add a npm script to run the dev server:

   ```json
   "scripts": {
     "dev": "vite"
   },
   ```

5. Run the script! `npm run dev`

## Custom Adapter

If your favorite framework not supported yet, you can either create an issue to request it or use the `adapter` option to tell the plugin how to pass down the request to your app. You can take a look how the supported frameworks implementations from the `./src/server` folder.
Example:

```ts
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: function (app, req, res) {
        app(res, res);
      },
      appPath: './app.ts'
    })
  ]
});
```

## Build
This plugin leverages Vite SSR mode to build your app. All you need to do is add a build script to your package.json:

   ```json
   "scripts": {
     "build": "vite build"
   },
   ```
For more build config please check [vite doc](https://vitejs.dev/config/#build-target)

## Examples

See the examples folder.

## Why?

---

While frontend development tooling is evolving rapidly in recent years, backend DX is still like in stone age. No hot module replacement; Typescript recompiling slow as funk; Lack of plugin system etc. Thanks to Vite.js created by Evan You (A.K.A creator of vue.js; my biggest idol developer), makes all those dreams for backend development come true!

## How?

---

Vite by design has a middleware mode, which allows us to use it programmatically inside other modules. It's originally made for SSR, so that for each request, vite can load the renderer and render the latest changes you made to your app (<https://vitejs.dev/guide/ssr.html>). This plugin leverages this feature to load and execute your server app entry.

You may ask, isn't super slow, since it re-compiles/reloads the entire app? The answer is NO, because vite is smart. It has a builtin module graph as a cache layer, the graph is built up the first time your app loads. After that, when you update a file, vite will only invalidate that one and its parent modules, so that for next request, only those invalidated modules need to be re-compiled which is super fast thanks to esbuild or swc.

## To-Do

As this plugin just fresh developed, there are still lots ideas need to be implemented, including:

- [ ] Test with a large node project, I need y'all helps on this!
- [ ] Unit tests

## Bugs

Please create an issue if you found any bugs, to help me improve this project!

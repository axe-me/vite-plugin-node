# Changelog

## 2.0.0
### ⚠️ **Breaking Changes!** ⚠️
- update vite to 3.x

- add apollo example

## 1.0.0
- lazy load swc

## 1.0.0-rc
### ⚠️ **Breaking Changes!** ⚠️
- The custom adapter function signature has been changed, see readme for more details.
### other changes
- bump peer dependency vite version to 2.9.x
- now use Eslint instead of Prettier
- now use pnpm instead of yarn for monorepo
- you can truely disable esbuild when use swc as tsCompiler
- added '@swc/core' to excluded optimized modules
- add raw node server example

## 0.0.19
- set swc default config module to es6
- do deep merge for swc config

## 0.0.18
### ⚠️ **Breaking Changes!** ⚠️
- @swc/core now is an optional peer dependency. if you want to use it as typescript compiler, you need to install it as dev dependency.

### other changes
- config vite rollup config to tell vite the entry point to mute the warning
- now support customize swc config.

## 0.0.17
use ssr mode to build for production instead of using library mode
## 0.0.16

- Pass the dev server to the handler
- Requires vite 2.8 as peer dependency
- add vite build!

## 0.0.15

- remove node version requirement

## 0.0.14

- Starting from this patch, this plugin will use the vite http server instead of creating its own.

### ⚠️ **Breaking Changes!** ⚠️

- config option `handler` renamed to `adapter`
- removed `server` config options, now you can just use vite server options, see [vite doc](https://vitejs.dev/config/#server-host)

## 0.0.13

- fastify: use fastify.routing to handle incoming request

## 0.0.12

- Support async app

## 0.0.11

- code refactor for framework adapters. move out the http server from the adapter.
- now support to customize the export name of your app

### ⚠️ **Breaking Changes** ⚠️

- plugin config updated. Please take a look and update your config.

## 0.0.10

- add fastify support!

## 0.0.9

I re-implemented how this plugin works internally. Previously, this plugin relay on vite dev server HMR signals to restart the server, which is too slow. In this new version, the app is loaded on each request and the http server is always running.

### ⚠️ **Breaking Changes** ⚠️

- the named exported required from your entry renamed from `createViteNodeApp` to `viteNodeApp`

### **Updates**

- update readme.md with new _How?_ section
- add koa as builtin supported framework
- update usages section in readme.md
- add examples for all the supported framework

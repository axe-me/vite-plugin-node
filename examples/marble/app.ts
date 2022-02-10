import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { createServer, httpListener } from '@marblejs/http';
import { isTestEnv, getPortEnv } from '@marblejs/core/dist/+internal/utils';
import { logger$ } from '@marblejs/middleware-logger';
import { bodyParser$ } from '@marblejs/middleware-body';
import { r } from '@marblejs/http';
import { mapTo } from 'rxjs/operators';
import { reader } from '@marblejs/core';

const middlewares = [logger$(), bodyParser$()];

export const api$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect((req$) =>
    req$.pipe(mapTo({ body: 'change me to see updates, express, hmr' }))
  )
);

const effects = [api$];

export const listener = httpListener({
  middlewares,
  effects
});

export const server = () =>
  createServer({
    port: 3000,
    listener
  });

if (import.meta.env.PROD) {
  const main = pipe(
    server,
    T.map((run) => run())
  );
  main();
}

export const viteNodeApp = { server: server(), listener: listener };

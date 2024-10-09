import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Change Me and Refresh to see HMR!!';
});

if (import.meta.env.PROD) {
  app.listen(3000);
  console.log('running on http://localhost:3000');
}

export const viteNodeApp = app;

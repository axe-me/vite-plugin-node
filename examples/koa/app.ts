import Koa from "koa";

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Change Me and Refresh to see HMR!Koa";
});

if (process.env.NODE_ENV === "production") {
  app.listen(3000);
}

export const viteNodeApp = app;

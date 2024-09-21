import express, { type Express, type RequestHandler } from 'express';

async function makeApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('change me to see updates, cloud functions!!');
  });

  return Promise.resolve(app);
}

const appPromise = makeApp();

export const viteNodeApp: Promise<Awaited<Express>> = appPromise;
export const main: RequestHandler = async (req, res) => {
  const app = await appPromise;

  app(req, res);
};

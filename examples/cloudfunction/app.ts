import express from 'express';

async function makeApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('change me to see updates, cloud functions!!');
  });

  return Promise.resolve(app);
}

const appPromise = makeApp();

export const viteNodeApp = appPromise;
export const main = async (req, res) => {
  const app = await appPromise;

  app(req, res);
};

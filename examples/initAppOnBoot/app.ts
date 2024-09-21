import express, { type Express } from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('change me to see updates, express~!');
});

app.get('/ip', async (req, res) => {
  const resp = await fetch('https://api.ipify.org?format=json');
  const json = await resp.json();
  res.json(json);
});

if (import.meta.env.PROD) {
  app.listen(3000);
  console.log('listening on http://localhost:3000/');
}

console.log('app is loaded');

export const viteNodeApp: Express = app;

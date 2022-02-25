import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('change me to see updates, express!!');
});

if (import.meta.env.PROD) {
  app.listen(3000);
  console.log('listening on http://localhost:3000/');
}

export const viteNodeApp = app;

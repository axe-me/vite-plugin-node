import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('change me to see updates, express, hmr');
});

if (process.env.NODE_ENV === 'production') {
  app.listen(3000);
}

export const viteNodeApp = app;

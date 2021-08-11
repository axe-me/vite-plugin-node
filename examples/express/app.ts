import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('change me123');
});

if (process.env.NODE_ENV === 'production') {
    app.listen(3000)
}

export const viteNodeApp = app;

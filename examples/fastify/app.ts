import fastify from 'fastify';

const app = fastify();

app.get('/', (req, reply) => {
  reply.send('change me to see updates!');
});

app.get('/ping', (req, reply) => {
  reply.send({ msg: 'pong' });
});

if (process.env.NODE_ENV === 'production') {
    app.listen(3000)
}

export const viteNodeApp = app;

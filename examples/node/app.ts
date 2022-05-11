import http from "http";

const requestListener: http.RequestListener = (req, res) => {
  res.writeHead(200);
  res.end("raw node server!~");
};

if (import.meta.env.PROD) {
  const server = http.createServer(requestListener);
  server.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
  });
}

export const viteNodeApp = requestListener;

import chalk from 'chalk';
import { createServer } from 'vite';
import { debugServer, startServer } from './server';

async function bootstrap() {
  // vite server config is managed by the plugin
  const viteServer = await createServer();
  const logger = viteServer.config.logger;
  logger.clearScreen('info');
  debugServer(chalk.dim`Vite Dev Server Created`);

  await startServer(viteServer);
}

bootstrap();

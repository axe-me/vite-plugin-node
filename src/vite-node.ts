import chalk from 'chalk';
import { createServer } from 'vite';
import { MakeServer } from './servers/server-factory';

async function bootstrap() {
  // vite server config is managed by the plugin
  const viteServer = await createServer();
  const logger = viteServer.config.logger;
  logger.clearScreen('info');
  logger.info(chalk.yellow`Vite Dev Server Created \n`, { timestamp: true });

  await MakeServer(viteServer);
}

bootstrap();

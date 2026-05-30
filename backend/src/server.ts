import 'dotenv/config';
import { createApp } from './app';
import { initializeDataSources } from './config/database';
import { logger } from './middleware/request-logger';
import { env } from './config/env';

const PORT = env.PORT;

async function start(): Promise<void> {
  try {
    await initializeDataSources();
    logger.info('Database connections established / 数据库连接已建立');

    const app = createApp();
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT} / 服务器监听端口 ${PORT}`);
    });
  } catch (err) {
    logger.error(err, 'Failed to start server / 服务器启动失败');
    process.exit(1);
  }
}

start();

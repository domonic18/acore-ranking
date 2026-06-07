import 'dotenv/config';
import { createApp } from './app';
import { initializeDataSources } from './config/database';
import { logger } from './middleware/request-logger';
import { env } from './config/env';

const PORT = env.PORT;
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

async function start(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await initializeDataSources();
      logger.info('Database connections established / 数据库连接已建立');

      const app = createApp();
      app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT} / 服务器监听端口 ${PORT}`);
      });
      return;
    } catch (err) {
      logger.warn(
        err,
        `Database connection failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms... / 数据库连接失败，${RETRY_DELAY_MS}毫秒后重试...`
      );
      if (attempt === MAX_RETRIES) {
        logger.error(err, 'Failed to start server / 服务器启动失败');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

start();

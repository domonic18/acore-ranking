import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';

import { requestLogger } from './middleware/request-logger';
import { errorHandler } from './middleware/error-handler';
import { responseFormatter } from './middleware/response-formatter';
import { iframeCors } from './middleware/iframe-cors';

import onlineRoutes from './routes/online.routes';
import rankingRoutes from './routes/ranking.routes';
import hardcoreRoutes from './routes/hardcore.routes';
import achievementRoutes from './routes/achievement.routes';
import banlistRoutes from './routes/banlist.routes';
import characterRoutes from './routes/character.routes';
import healthRoutes from './routes/health.routes';
import iconRoutes from './routes/icon.routes';
import playermapRoutes from './routes/playermap.routes';
import encounterRoutes from './routes/encounter.routes';
import auctionRoutes from './routes/auction.routes';
import { areDataSourcesReady, waitForDataSourcesReady } from './config/database';

export function createApp(): Application {
  const app = express();

  app.use(helmet({ frameguard: false }));
  app.use(iframeCors);
  app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(',') || '*',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(responseFormatter);

  // 静态资源优先，不经过 API 路由层和数据库检查
  app.use(express.static(path.join(__dirname, 'public')));

  // API 路由健康检查：数据库未就绪时先等待（冷启动窗口），超时再返回 503
  app.use('/api', async (req, res, next) => {
    if (req.path === '/health' || areDataSourcesReady()) {
      next();
      return;
    }
    const ready = await waitForDataSourcesReady(10_000);
    if (ready) {
      next();
      return;
    }
    res.status(503).json({
      success: false,
      error: 'Database not available, please retry later / 数据库暂不可用，请稍后重试',
    });
  });

  app.use('/api/online', onlineRoutes);
  app.use('/api/ranking', rankingRoutes);
  app.use('/api/hardcore', hardcoreRoutes);
  app.use('/api/achievement', achievementRoutes);
  app.use('/api/banlist', banlistRoutes);
  app.use('/api/character', characterRoutes);
  app.use('/api/health', healthRoutes);
  app.use('/api/icons', iconRoutes);
  app.use('/api/playermap', playermapRoutes);
  app.use('/api/encounter', encounterRoutes);
  app.use('/api/auction', auctionRoutes);

  // SPA fallback：前端路由回退到 index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.use(errorHandler);
  return app;
}

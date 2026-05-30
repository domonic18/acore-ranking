import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';

import { requestLogger } from './middleware/request-logger';
import { errorHandler } from './middleware/error-handler';
import { responseFormatter } from './middleware/response-formatter';
import { apiKeyAuth } from './middleware/api-key-auth';
import { iframeCors } from './middleware/iframe-cors';

import onlineRoutes from './routes/online.routes';
import rankingRoutes from './routes/ranking.routes';
import hardcoreRoutes from './routes/hardcore.routes';
import achievementRoutes from './routes/achievement.routes';
import banlistRoutes from './routes/banlist.routes';
import characterRoutes from './routes/character.routes';
import healthRoutes from './routes/health.routes';

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

  app.use('/api/online', apiKeyAuth, onlineRoutes);
  app.use('/api/ranking', apiKeyAuth, rankingRoutes);
  app.use('/api/hardcore', apiKeyAuth, hardcoreRoutes);
  app.use('/api/achievement', apiKeyAuth, achievementRoutes);
  app.use('/api/banlist', apiKeyAuth, banlistRoutes);
  app.use('/api/character', apiKeyAuth, characterRoutes);
  app.use('/api/health', healthRoutes);

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.use(errorHandler);
  return app;
}

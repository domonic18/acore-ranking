import { Router } from 'express';
import { env } from '../config/env';

const router = Router();

router.get('/widget', (_req, res) => {
  // Debug: log env values to help diagnose SCF env var issues
  console.log('[ConfigRoutes] WIDGET_DETAIL_URL from env:', env.WIDGET_DETAIL_URL);
  console.log('[ConfigRoutes] WIDGET_ONLINE_URL from env:', env.WIDGET_ONLINE_URL);
  res.jsonSuccess({
    detailUrl: env.WIDGET_DETAIL_URL,
    onlineUrl: env.WIDGET_ONLINE_URL,
  });
});

export default router;

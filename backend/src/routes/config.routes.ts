import { Router } from 'express';
import { env } from '../config/env';

const router = Router();

router.get('/widget', (_req, res) => {
  res.jsonSuccess({
    detailUrl: env.WIDGET_DETAIL_URL,
    onlineUrl: env.WIDGET_ONLINE_URL,
  });
});

export default router;

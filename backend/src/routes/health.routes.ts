import { Router } from 'express';
import { areDataSourcesReady } from '../config/database';

const router = Router();

router.get('/', (_req, res) => {
  res.jsonSuccess({
    status: 'ok',
    dbReady: areDataSourcesReady(),
    timestamp: new Date().toISOString(),
  });
});

export default router;

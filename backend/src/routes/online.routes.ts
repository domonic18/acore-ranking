import { Router } from 'express';
import { OnlineService } from '../services/online.service';

const router = Router();
const service = new OnlineService();

router.get('/count', async (_req, res) => {
  const data = await service.getOnlineCount();
  res.jsonSuccess(data);
});

router.get('/players', async (_req, res) => {
  const data = await service.getOnlinePlayers();
  res.jsonSuccess(data);
});

export default router;

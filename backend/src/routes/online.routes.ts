import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { OnlineService } from '../services/online.service';

const router = Router();
const service = new OnlineService();

router.get('/count', asyncHandler(async (_req, res) => {
  const data = await service.getOnlineCount();
  res.jsonSuccess(data);
}));

router.get('/players', asyncHandler(async (_req, res) => {
  const data = await service.getOnlinePlayers();
  res.jsonSuccess(data);
}));

export default router;

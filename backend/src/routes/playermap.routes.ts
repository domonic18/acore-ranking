import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { PlayerMapService } from '../services/playermap.service';

const router = Router();
const service = new PlayerMapService();

router.get('/players', asyncHandler(async (_req, res) => {
  const data = await service.getMapData();
  res.jsonSuccess(data);
}));

router.get('/status', asyncHandler(async (_req, res) => {
  const status = await service.getServerStatus();
  res.jsonSuccess(status);
}));

export default router;

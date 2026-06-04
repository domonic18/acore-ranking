import { Router } from 'express';
import { PlayerMapService } from '../services/playermap.service';

const router = Router();
const service = new PlayerMapService();

router.get('/players', async (req, res) => {
  const data = await service.getMapData();
  res.jsonSuccess(data);
});

router.get('/status', async (req, res) => {
  const status = await service.getServerStatus();
  res.jsonSuccess(status);
});

export default router;

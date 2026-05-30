import { Router } from 'express';
import { BanlistService } from '../services/banlist.service';

const router = Router();
const service = new BanlistService();

router.get('/recent', async (_req, res) => {
  const data = await service.getRecent();
  res.jsonSuccess(data);
});

export default router;

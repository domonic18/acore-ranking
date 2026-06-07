import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { BanlistService } from '../services/banlist.service';

const router = Router();
const service = new BanlistService();

router.get('/recent', asyncHandler(async (_req, res) => {
  const data = await service.getRecent();
  res.jsonSuccess(data);
}));

export default router;

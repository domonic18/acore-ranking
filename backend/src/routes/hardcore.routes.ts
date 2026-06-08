import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { HardcoreService } from '../services/hardcore.service';

const router = Router();
const service = new HardcoreService();

router.get('/completed/:level', asyncHandler(async (req, res) => {
  const level = parseInt(req.params.level, 10);
  const data = await service.getCompleted(level);
  res.jsonSuccess(data);
}));

router.get('/fail', asyncHandler(async (_req, res) => {
  const data = await service.getFail();
  res.jsonSuccess(data);
}));

router.get('/incomplete', asyncHandler(async (_req, res) => {
  const data = await service.getIncomplete();
  res.jsonSuccess(data);
}));

export default router;

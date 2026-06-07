import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { AchievementService } from '../services/achievement.service';

const router = Router();
const service = new AchievementService();

router.get('/recent', asyncHandler(async (_req, res) => {
  const data = await service.getRecent();
  res.jsonSuccess(data);
}));

export default router;

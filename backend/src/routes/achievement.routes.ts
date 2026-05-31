import { Router } from 'express';
import { AchievementService } from '../services/achievement.service';

const router = Router();
const service = new AchievementService();

router.get('/recent', async (_req, res) => {
  const data = await service.getRecent();
  res.jsonSuccess(data);
});

export default router;

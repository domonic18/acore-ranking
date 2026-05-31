import { Router } from 'express';
import { RankingService } from '../services/ranking.service';

const router = Router();
const service = new RankingService();

router.get('/gold', async (_req, res) => {
  const data = await service.getGoldRanking();
  res.jsonSuccess(data);
});

router.get('/playtime', async (_req, res) => {
  const data = await service.getPlaytimeRanking();
  res.jsonSuccess(data);
});

router.get('/mount', async (_req, res) => {
  const data = await service.getMountRanking();
  res.jsonSuccess(data);
});

router.get('/honor', async (_req, res) => {
  const data = await service.getHonorRanking();
  res.jsonSuccess(data);
});

router.get('/achievement', async (_req, res) => {
  const data = await service.getAchievementRanking();
  res.jsonSuccess(data);
});

export default router;

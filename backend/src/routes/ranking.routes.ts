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

router.get('/kills', async (_req, res) => {
  const data = await service.getKillsRanking();
  res.jsonSuccess(data);
});

router.get('/deaths', async (_req, res) => {
  const data = await service.getDeathRanking();
  res.jsonSuccess(data);
});

router.get('/reputation', async (_req, res) => {
  const data = await service.getReputationRanking();
  res.jsonSuccess(data);
});

router.get('/quest', async (_req, res) => {
  const data = await service.getQuestRanking();
  res.jsonSuccess(data);
});

router.get('/legendary', async (_req, res) => {
  const data = await service.getLegendaryRanking();
  res.jsonSuccess(data);
});

router.get('/today-kills', async (_req, res) => {
  const data = await service.getTodayKillsRanking();
  res.jsonSuccess(data);
});

router.get('/yesterday-kills', async (_req, res) => {
  const data = await service.getYesterdayKillsRanking();
  res.jsonSuccess(data);
});

router.get('/achievement', async (_req, res) => {
  const data = await service.getAchievementRanking();
  res.jsonSuccess(data);
});

export default router;

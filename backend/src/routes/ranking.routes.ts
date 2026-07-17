import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { RankingService } from '../services/ranking.service';

const router = Router();
const service = new RankingService();

router.get('/gold', asyncHandler(async (_req, res) => {
  const data = await service.getGoldRanking();
  res.jsonSuccess(data);
}));

router.get('/playtime', asyncHandler(async (_req, res) => {
  const data = await service.getPlaytimeRanking();
  res.jsonSuccess(data);
}));

router.get('/mount', asyncHandler(async (_req, res) => {
  const data = await service.getMountRanking();
  res.jsonSuccess(data);
}));

router.get('/honor', asyncHandler(async (_req, res) => {
  const data = await service.getHonorRanking();
  res.jsonSuccess(data);
}));

router.get('/kills', asyncHandler(async (_req, res) => {
  const data = await service.getKillsRanking();
  res.jsonSuccess(data);
}));

router.get('/deaths', asyncHandler(async (_req, res) => {
  const data = await service.getDeathRanking();
  res.jsonSuccess(data);
}));

router.get('/monster-kills', asyncHandler(async (_req, res) => {
  const data = await service.getMonsterKillRanking();
  res.jsonSuccess(data);
}));

router.get('/critter-kills', asyncHandler(async (_req, res) => {
  const data = await service.getCritterKillRanking();
  res.jsonSuccess(data);
}));

router.get('/flight-paths', asyncHandler(async (_req, res) => {
  const data = await service.getFlightPathRanking();
  res.jsonSuccess(data);
}));

router.get('/healing-potions', asyncHandler(async (_req, res) => {
  const data = await service.getHealingPotionRanking();
  res.jsonSuccess(data);
}));

router.get('/dungeon-5', asyncHandler(async (_req, res) => {
  const data = await service.getDungeon5Ranking();
  res.jsonSuccess(data);
}));

router.get('/raid-10', asyncHandler(async (_req, res) => {
  const data = await service.getRaid10Ranking();
  res.jsonSuccess(data);
}));

router.get('/raid-25', asyncHandler(async (_req, res) => {
  const data = await service.getRaid25Ranking();
  res.jsonSuccess(data);
}));

router.get('/reputation', asyncHandler(async (_req, res) => {
  const data = await service.getReputationRanking();
  res.jsonSuccess(data);
}));

router.get('/quest', asyncHandler(async (_req, res) => {
  const data = await service.getQuestRanking();
  res.jsonSuccess(data);
}));

router.get('/legendary', asyncHandler(async (_req, res) => {
  const data = await service.getLegendaryRanking();
  res.jsonSuccess(data);
}));

router.get('/rare-items', asyncHandler(async (_req, res) => {
  const data = await service.getRareItemRanking();
  res.jsonSuccess(data);
}));

router.get('/today-kills', asyncHandler(async (_req, res) => {
  const data = await service.getTodayKillsRanking();
  res.jsonSuccess(data);
}));

router.get('/achievement', asyncHandler(async (_req, res) => {
  const data = await service.getAchievementRanking();
  res.jsonSuccess(data);
}));

export default router;

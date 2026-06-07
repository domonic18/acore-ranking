import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { CharacterService } from '../services/character.service';

const router = Router();
const service = new CharacterService();

router.get('/:name', asyncHandler(async (req, res) => {
  const { name } = req.params;
  const data = await service.getCharacterInfo(name);
  res.jsonSuccess(data);
}));

router.get('/:name/items', asyncHandler(async (req, res) => {
  const { name } = req.params;
  const data = await service.getCharacterItems(name);
  res.jsonSuccess(data);
}));

router.get('/:name/talents', asyncHandler(async (req, res) => {
  const { name } = req.params;
  const data = await service.getCharacterTalents(name);
  res.jsonSuccess(data);
}));

router.get('/:name/achievements', asyncHandler(async (req, res) => {
  const { name } = req.params;
  const data = await service.getCharacterAchievements(name);
  res.jsonSuccess(data);
}));

export default router;

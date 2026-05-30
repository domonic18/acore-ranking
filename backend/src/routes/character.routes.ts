import { Router } from 'express';
import { CharacterService } from '../services/character.service';

const router = Router();
const service = new CharacterService();

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const data = await service.getCharacterInfo(name);
  res.jsonSuccess(data);
});

router.get('/:name/items', async (req, res) => {
  const { name } = req.params;
  const data = await service.getCharacterItems(name);
  res.jsonSuccess(data);
});

export default router;

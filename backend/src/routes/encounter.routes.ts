import { Router } from 'express';
import { EncounterService } from '../services/encounter.service';

const router = Router();
const service = new EncounterService();

router.get('/bosses', async (_req, res) => {
  const data = await service.getFirstKills();
  res.jsonSuccess(data);
});

export default router;

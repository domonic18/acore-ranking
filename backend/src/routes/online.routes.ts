import { Router } from 'express';

const router = Router();

router.get('/count', async (_req, res) => {
  // TODO: implement online count
  res.jsonSuccess({ total_count: 0, alliance_count: 0, horde_count: 0 });
});

router.get('/players', async (_req, res) => {
  // TODO: implement online players list
  res.jsonSuccess([]);
});

export default router;

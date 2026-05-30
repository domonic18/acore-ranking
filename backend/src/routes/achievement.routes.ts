import { Router } from 'express';

const router = Router();

router.get('/recent', async (_req, res) => {
  res.jsonSuccess([]);
});

export default router;

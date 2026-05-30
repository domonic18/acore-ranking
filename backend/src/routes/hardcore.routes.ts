import { Router } from 'express';

const router = Router();

router.get('/completed/:level', async (req, res) => {
  const { level } = req.params;
  res.jsonSuccess([]);
});

router.get('/fail', async (_req, res) => {
  res.jsonSuccess([]);
});

router.get('/incomplete', async (_req, res) => {
  res.jsonSuccess([]);
});

export default router;

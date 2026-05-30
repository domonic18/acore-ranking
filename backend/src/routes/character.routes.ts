import { Router } from 'express';

const router = Router();

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  res.jsonSuccess(null);
});

router.get('/:name/items', async (req, res) => {
  const { name } = req.params;
  res.jsonSuccess([]);
});

export default router;

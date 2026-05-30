import { Router } from 'express';

const router = Router();

router.get('/gold', async (_req, res) => {
  res.jsonSuccess([]);
});

router.get('/playtime', async (_req, res) => {
  res.jsonSuccess([]);
});

router.get('/mount', async (_req, res) => {
  res.jsonSuccess([]);
});

router.get('/honor', async (_req, res) => {
  res.jsonSuccess([]);
});

router.get('/achievement', async (_req, res) => {
  res.jsonSuccess([]);
});

export default router;

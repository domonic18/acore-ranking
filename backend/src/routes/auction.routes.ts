import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { AuctionService } from '../services/auction.service';

const router = Router();
const service = new AuctionService();

router.get('/', asyncHandler(async (_req, res) => {
  const data = await service.getAuctionList();
  res.jsonSuccess(data);
}));

export default router;

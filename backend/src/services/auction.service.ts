import { CacheService, CacheKeys, CacheTTL } from './cache.service';
import { AuctionRepository } from '../repositories/auction.repository';
import { ITEM_DISPLAY_INFO } from '../generated/itemDisplayInfo';

export class AuctionService {
  private cache = new CacheService();
  private repo = new AuctionRepository();

  async getAuctionList(): Promise<unknown[]> {
    const cacheKey = CacheKeys.auctionList;
    const cached = await this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const auctions = await this.repo.findAuctions() as any[];
      const result = auctions.map((a) => ({
        id: a.id,
        house_id: a.houseid,
        item_guid: a.itemguid,
        item_entry: a.itemEntry,
        display_id: a.displayid,
        item_name: a.item_name || '未知物品',
        quality: a.Quality,
        icon: ITEM_DISPLAY_INFO[a.displayid] || null,
        owner_name: a.owner_name || '已删号',
        owner_guid: a.itemowner,
        start_bid: a.startbid,
        last_bid: a.lastbid,
        buyout_price: a.buyoutprice,
        deposit: a.deposit,
        expire_time: a.time,
        buyer_guid: a.buyguid,
      }));

      await this.cache.set(cacheKey, result, CacheTTL.realtime);
      return result;
    } catch (err) {
      console.error('[AuctionService] getAuctionList failed:', err);
      return [];
    }
  }
}

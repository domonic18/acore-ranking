export interface AuctionItem {
  id: number;
  house_id: number;
  item_guid: number;
  item_entry: number;
  display_id: number;
  item_name: string;
  quality: number;
  icon: string | null;
  owner_name: string;
  owner_guid: number;
  start_bid: number;
  last_bid: number;
  buyout_price: number;
  deposit: number;
  expire_time: number;
  buyer_guid: number;
}

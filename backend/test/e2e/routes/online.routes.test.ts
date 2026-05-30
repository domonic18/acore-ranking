import request from 'supertest';
import express, { Application } from 'express';
import { responseFormatter } from '../../../src/middleware/response-formatter';
import onlineRoutes from '../../../src/routes/online.routes';
import { OnlineService } from '../../../src/services/online.service';

jest.mock('../../../src/services/online.service');

describe('GET /api/online', () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(responseFormatter);
    app.use('/api/online', onlineRoutes);
  });

  describe('GET /api/online/count', () => {
    it('returns online count in legacy format', async () => {
      const mockData = { total_count: 10, alliance_count: 6, horde_count: 4 };
      (OnlineService.prototype.getOnlineCount as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/api/online/count');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: mockData,
      });
    });
  });

  describe('GET /api/online/players', () => {
    it('returns online players list', async () => {
      const mockData = [{ guid: 1, name: 'Test', side: 'alliance' }];
      (OnlineService.prototype.getOnlinePlayers as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/api/online/players');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        count: 1,
        data: mockData,
      });
    });
  });
});

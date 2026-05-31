import request from 'supertest';
import express, { Application } from 'express';
import { responseFormatter } from '../../../src/middleware/response-formatter';
import rankingRoutes from '../../../src/routes/ranking.routes';
import { RankingService } from '../../../src/services/ranking.service';

jest.mock('../../../src/services/ranking.service');

describe('GET /api/ranking', () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(responseFormatter);
    app.use('/api/ranking', rankingRoutes);
  });

  const endpoints = [
    { path: '/api/ranking/gold', method: 'getGoldRanking' },
    { path: '/api/ranking/playtime', method: 'getPlaytimeRanking' },
    { path: '/api/ranking/honor', method: 'getHonorRanking' },
    { path: '/api/ranking/achievement', method: 'getAchievementRanking' },
    { path: '/api/ranking/mount', method: 'getMountRanking' },
  ];

  endpoints.forEach(({ path, method }) => {
    it(`${path} returns legacy API format`, async () => {
      const mockData = [{ guid: 1, name: 'Test' }];
      (RankingService.prototype[method as keyof RankingService] as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get(path);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        count: 1,
        data: mockData,
      });
    });
  });
});

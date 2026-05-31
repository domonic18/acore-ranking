import request from 'supertest';
import express, { Application } from 'express';
import { responseFormatter } from '../../../src/middleware/response-formatter';
import characterRoutes from '../../../src/routes/character.routes';
import { CharacterService } from '../../../src/services/character.service';

jest.mock('../../../src/services/character.service');

describe('GET /api/character', () => {
  let app: Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(responseFormatter);
    app.use('/api/character', characterRoutes);
  });

  describe('GET /api/character/:name', () => {
    it('returns character info', async () => {
      const mockData = { guid: 1, name: 'Hero', level: 80, side: 'alliance' };
      (CharacterService.prototype.getCharacterInfo as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/api/character/Hero');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: mockData,
      });
    });

    it('returns null for unknown character', async () => {
      (CharacterService.prototype.getCharacterInfo as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/character/Unknown');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: null,
      });
    });
  });

  describe('GET /api/character/:name/items', () => {
    it('returns character items', async () => {
      const mockData = [{ item_guid: 100, slot: 0, name: 'Sword' }];
      (CharacterService.prototype.getCharacterItems as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/api/character/Hero/items');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        count: 1,
        data: mockData,
      });
    });
  });
});

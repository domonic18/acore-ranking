import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = (req.query._key as string) || (req.headers['x-api-key'] as string);
  const expectedKey = env.API_KEY;

  if (!expectedKey || apiKey === expectedKey) {
    next();
    return;
  }

  res.status(401).json({ success: false, error: 'Unauthorized / 未授权' });
}

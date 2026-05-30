import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * API Key 认证中间件。
 * 从查询参数 _key 或请求头 x-api-key 中读取 API Key。
 * 若 API_KEY 环境变量未配置，则放行所有请求（开发环境便利）。
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = (req.query._key as string) || (req.headers['x-api-key'] as string);
  const expectedKey = env.API_KEY;

  if (!expectedKey || apiKey === expectedKey) {
    next();
    return;
  }

  res.status(401).json({ success: false, error: 'Unauthorized / 未授权' });
}

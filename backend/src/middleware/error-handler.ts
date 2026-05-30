import { Request, Response, NextFunction } from 'express';
import { logger } from './request-logger';
import { isProduction } from '../config/env';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = (err as any).status || 500;
  logger.error({ err, req: { method: req.method, url: req.url } }, err.message);

  res.status(status).json({
    success: false,
    error: isProduction
      ? 'Internal Server Error / 内部服务器错误'
      : err.message,
  });
}

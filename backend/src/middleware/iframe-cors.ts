import { Request, Response, NextFunction } from 'express';

export function iframeCors(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
}

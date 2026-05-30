import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  error?: string;
}

declare global {
  namespace Express {
    interface Response {
      jsonSuccess: <T>(data: T) => void;
    }
  }
}

export function responseFormatter(req: Request, res: Response, next: NextFunction): void {
  res.jsonSuccess = <T>(data: T): void => {
    const response: ApiResponse<T> = {
      success: true,
      count: Array.isArray(data) ? data.length : undefined,
      data,
    };
    res.json(response);
  };
  next();
}

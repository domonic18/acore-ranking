import { ApiResponse } from '../middleware/response-formatter';

declare global {
  namespace Express {
    interface Response {
      jsonSuccess: <T>(data: T) => void;
    }
  }
}

export {};

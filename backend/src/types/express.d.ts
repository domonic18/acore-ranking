declare global {
  namespace Express {
    interface Response {
      jsonSuccess: <T>(data: T) => void;
    }
  }
}

export {};

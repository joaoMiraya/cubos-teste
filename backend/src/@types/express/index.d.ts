declare namespace Express {
  export interface Request {
    userId?: string;
    user?: {
      id: string;
      email: string;
      role?: string;
    };
  }
}
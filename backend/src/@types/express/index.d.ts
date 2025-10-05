declare namespace Express {
  export interface Request {
    userId?: string;
    user?: {
      id: string;
      email: string;
      role?: string;
    };
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  }
}
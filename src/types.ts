import { Request, Response } from "express";

export type MyContext = {
  req: Request & { session?: { userId?: number } };
  res: Response;
};

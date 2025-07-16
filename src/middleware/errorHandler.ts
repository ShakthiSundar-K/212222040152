import { Request, Response, NextFunction } from 'express';
import { log } from './logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  log('backend', 'error', 'middleware', message);

  res.status(status).json({ error: message });
};

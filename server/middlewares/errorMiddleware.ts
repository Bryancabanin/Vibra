import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ServerError } from '../types/errorMiddleware';

// 404 or “Not Found” Handler
export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const error: ServerError = {
    log: '404 Not Found',
    status: 404,
    message: { err: '404 Not Found' },
  };
  next(error);
};

// 500 or “Global” Error handler
export const errorHandler: ErrorRequestHandler = (
  err: ServerError,
  _req,
  res,
) => {
  // Default error object
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  // const errorObj: ServerError = Object.assign({}, defaultErr, err);
  const errorObj: ServerError = { ...defaultErr, ...err };
  // Log the error object
  console.log('Error object:', errorObj);

  res.status(errorObj.status).json(errorObj.message);
};

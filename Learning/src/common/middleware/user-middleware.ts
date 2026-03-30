import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.url}`, 'This Is Middleware');
    next(); // MUST call
  }

  //  use(req: any, res: any, next: () => void) {
  //   const token = req.headers.authorization;

  //   if (!token) {
  //     return res.status(401).json({
  //       message: 'Unauthorized',
  //     });
  //   }

  //   // verify token logic here

  //   next();
  // }
}

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class GrantAccessToken implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
      if (!accessToken) {
        if (refreshToken) {
          const decodeRefreshTokenData = jwt.verify(
            refreshToken,
            process.env.SECRET_KEY || '',
          );

          const newAccessToken = jwt.sign(
            decodeRefreshTokenData,
            process.env.SECRET_KEY || '',
          );

          req['user'] = decodeRefreshTokenData;

          res.cookie('accessToken', newAccessToken, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          });

          return next();
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      } else {
        next();
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}

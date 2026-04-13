import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithCookies } from '../../lib/type';

export class GrantAccessToken implements NestMiddleware {
  use(req: RequestWithCookies, res: Response, next: NextFunction) {
    const publicPaths = ['/auth/register', '/auth/login'];
    if (publicPaths.includes(req.originalUrl)) {
      return next();
    }

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
      if (!accessToken) {
        if (refreshToken) {
          const decodeRefreshTokenData = jwt.verify(
            refreshToken,
            process.env.SECRET_KEY || '',
          );

          const grantNewAccessToken = jwt.sign(
            decodeRefreshTokenData,
            process.env.SECRET_KEY || '',
          );

          req['user'] = decodeRefreshTokenData;

          res.cookie('accessToken', grantNewAccessToken, {
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
      return res
        .status(401)
        .json({ error: (error as Error).message, message: 'Invalid token' });
    }
  }
}

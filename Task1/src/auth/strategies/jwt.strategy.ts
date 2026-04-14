import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtConfig from '../config/jwt-config';
import * as config from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JwtConfig.KEY)
    private jwtConfiguration: config.ConfigType<typeof JwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration?.secret as string,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}

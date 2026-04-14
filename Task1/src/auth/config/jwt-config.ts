import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.ACCESS_TOKEN_SECRETKEY as string,
    signOptions: {
      expiresIn: '1d',
    },
  }),
);

import { Request } from 'express';

export type RequestWithCookies = Request & {
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export interface mailType {
  to: string;
  subject: string;
  html: string;
}

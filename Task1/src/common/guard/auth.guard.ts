import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      return false;
    }
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY || '') as {
      role: string;
    };

    return requiredRoles.includes(decoded?.role);
  }
}

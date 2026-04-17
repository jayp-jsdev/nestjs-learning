import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Calling API...');

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `Req-Method: ${request.method}, Req-URL: ${request.url}, Time: ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}

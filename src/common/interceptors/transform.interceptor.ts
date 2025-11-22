import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T = any> implements NestInterceptor<T, { data: T; success: boolean }> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<{ data: T; success: boolean }> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}

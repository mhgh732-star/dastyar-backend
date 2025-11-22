import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface ThrottlerState {
  count: number;
  expiresAt: number;
}

@Injectable()
export class SimpleThrottlerGuard implements CanActivate {
  private readonly cache = new Map<string, ThrottlerState>();
  private readonly limit = Number(process.env.RATE_LIMIT_REQUESTS || 60);
  private readonly ttlMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.ip || request.headers['x-forwarded-for'] || 'anonymous';
    const now = Date.now();
    const state = this.cache.get(key);

    if (!state || state.expiresAt < now) {
      this.cache.set(key, { count: 1, expiresAt: now + this.ttlMs });
      return true;
    }

    if (state.count >= this.limit) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    state.count += 1;
    this.cache.set(key, state);
    return true;
  }
}

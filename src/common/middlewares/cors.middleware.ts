import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomCorsMiddleware implements NestMiddleware {
  private readonly allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);

  use(req: Request, res: Response, next: NextFunction): void {
    const origin = req.headers.origin as string | undefined;
    if (!origin || this.allowedOrigins.length === 0 || this.allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  }
}

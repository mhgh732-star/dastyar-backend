import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter(), new ValidationExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor(), new TimeoutInterceptor());
  const requestLogger = new RequestLoggerMiddleware();
  app.use(requestLogger.use.bind(requestLogger));
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

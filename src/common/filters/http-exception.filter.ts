import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = isHttpException
      ? exception.getResponse()
      : {
          statusCode: status,
          message: 'Internal server error',
        };

    const payload = typeof errorResponse === 'string' ? { message: errorResponse } : (errorResponse as Record<string, any>);

    this.logger.error(
      `${request.method} ${request.url} -> ${status}`,
      isHttpException ? undefined : (exception as Error)?.stack,
    );

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      ...payload,
    });
  }
}

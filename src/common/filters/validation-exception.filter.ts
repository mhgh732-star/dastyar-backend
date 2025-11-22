import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exceptionResponse = exception.getResponse() as { message?: string | string[]; error?: string };
    const messages = Array.isArray(exceptionResponse?.message) ? exceptionResponse.message : [exceptionResponse?.message];

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: messages?.filter(Boolean) ?? [],
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

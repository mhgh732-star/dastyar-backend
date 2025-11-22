"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const validation_exception_filter_1 = require("./common/filters/validation-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
const request_logger_middleware_1 = require("./common/middlewares/request-logger.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(), new validation_exception_filter_1.ValidationExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor(), new timeout_interceptor_1.TimeoutInterceptor());
    const requestLogger = new request_logger_middleware_1.RequestLoggerMiddleware();
    app.use(requestLogger.use.bind(requestLogger));
    app.enableCors();
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
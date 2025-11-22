import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator برگرداننده اطلاعات کاربر استخراج‌شده توسط JwtStrategy.
 */
export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user ?? null;
  if (!data || !user) {
    return user;
  }
  return user[data];
});

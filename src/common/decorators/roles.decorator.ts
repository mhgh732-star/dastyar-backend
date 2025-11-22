import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator برای مشخص کردن نقش‌های مجاز یک هندلر یا کنترلر.
 * نمونه استفاده:
 * `@Roles('admin', 'manager')`
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

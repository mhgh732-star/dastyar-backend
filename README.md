# Backend Guide

این پوشه شامل سرویس NestJS برای سامانه یادگیری است. ماژول‌ها به تفکیک دامنه (Auth, Users, Courses, Files, Notifications, Chat و ...) پیاده‌سازی شده‌اند.

## نصب و اجرای توسعه
```bash
cd backend
npm install
cp .env.example .env   # مقادیر را تنظیم کنید
npm run dev            # اجرا با ts-node-dev
```

برای تولید نسخه نهایی:
```bash
npm run build
npm start
```

## متغیرهای محیطی
| کلید | توضیح |
|------|-------|
| `PORT` | پورت سرویس HTTP (پیش‌فرض 3000) |
| `DATABASE_URL` یا ترکیب `DB_*` | مشخصات پایگاه‌داده Postgres یا SQLite |
| `APPLY_SQL_MIGRATIONS` | در صورت `true`، فایل‌های `database/migrations` هنگام بوت اعمال می‌شوند |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | کلیدهای امضای توکن |
| `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` | زمان انقضا |
| `MFA_ISSUER` | نام نمایشی MFA در Google Authenticator |
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` | اتصال به S3 |
| `AWS_SIGNED_URL_EXPIRES_IN` | زمان انقضای لینک آپلود مستقیم (ثانیه) |
| `SOCKET_CORS` | لیست آدرس‌های مجاز برای Socket.IO (جداشده با کاما) |

نمونه پیکربندی PostgreSQL:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=lms
APPLY_SQL_MIGRATIONS=true
```

## ذخیره‌سازی فایل و S3
1. در جدول `storage_locations` یک رکورد با `provider='s3'` و `bucket` موردنظر ایجاد کنید.
2. مقادیر AWS را در `.env` قرار دهید (یا به‌صورت JSON در فیلد `credentials` رکورد ذخیره کنید تا برای هر bucket متفاوت باشد).
3. Endpoint `POST /files/presign` لینک PUT موقتی برای آپلود مستقیم به S3 برمی‌گرداند.
4. حذف فایل‌ها با `DeleteObjectCommand` انجام می‌شود و لینک دسترسی عمومی از `bucket + region` ساخته می‌شود.

## وب‌سوکت و رویدادها
- `/notifications`: رویدادهای `new_notification` و `unread_count` ارسال می‌شوند. برای اتصال باید token در `auth.token` ارسال شود.
- `/chat`: رویدادهای `new_message`, `room_updated`, `user_typing` و ... پشتیبانی می‌شود. کلاینت باید با `join_room` و `leave_room` اتاق‌ها را مدیریت کند.

## تست‌ها
```bash
npm test
```
Vitest/Nest TestModule می‌تواند برای ماژول‌های جدید توسعه یابد (پوشه `test/` نمونه دارد).

## MFA (TOTP)
1. فعال‌سازی: `POST /auth/mfa/enable` → پاسخ شامل `secretBase32` و `otpauthUrl`.
2. تأیید: `POST /auth/mfa/verify` با `code`.
3. ورود: `POST /auth/login` با فیلد اختیاری `otp` در صورت فعال بودن.

## توصیه‌ها برای Production
- از PostgreSQL و مایگریشن‌های SQL استفاده کنید، `synchronize` را فعال نکنید.
- Secrets (JWT/AWS) را از Secret Manager یا متغیرهای امن تزریق کنید.
- `SOCKET_CORS` را محدود به دامنه‌های معتبر خود نمایید.
- حتماً CloudWatch/S3 access logging را فعال کنید تا رخدادهای فایل قابل ردیابی باشد.

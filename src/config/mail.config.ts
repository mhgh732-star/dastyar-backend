export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
  defaultFrom: string;
}

export const loadMailConfig = (): MailConfig => ({
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.MAIL_PORT || 2525),
  user: process.env.MAIL_USER || '',
  password: process.env.MAIL_PASSWORD || '',
  secure: process.env.MAIL_SECURE === 'true',
  defaultFrom: process.env.MAIL_DEFAULT_FROM || 'LMS <no-reply@example.com>',
});

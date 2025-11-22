"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMailConfig = void 0;
const loadMailConfig = () => ({
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAIL_PORT || 2525),
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    secure: process.env.MAIL_SECURE === 'true',
    defaultFrom: process.env.MAIL_DEFAULT_FROM || 'LMS <no-reply@example.com>',
});
exports.loadMailConfig = loadMailConfig;
//# sourceMappingURL=mail.config.js.map
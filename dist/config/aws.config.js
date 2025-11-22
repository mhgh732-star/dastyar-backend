"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAwsConfig = void 0;
const loadAwsConfig = () => ({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucket: process.env.AWS_S3_BUCKET || 'lms-dev-bucket',
    signedUrlExpiresIn: Number(process.env.AWS_SIGNED_URL_EXPIRES_IN || 900),
});
exports.loadAwsConfig = loadAwsConfig;
//# sourceMappingURL=aws.config.js.map
import { Injectable, BadRequestException } from '@nestjs/common';
import { StorageLocationEntity, StorageProvider } from '../entities/storage-location.entity';
import { GetPresignedUrlDto } from '../dto/upload-presign.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { loadAwsConfig } from '../../../config/aws.config';

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type UploadingFile = {
  originalname: string;
  buffer: Buffer;
  mimetype?: string;
};

@Injectable()
export class StorageService {
  async uploadFile(
    file: UploadingFile,
    storage: StorageLocationEntity,
    courseId?: string | null,
  ): Promise<string> {
    switch (storage.provider) {
      case 'local':
        return this.uploadToLocal(file, storage, courseId);
      case 's3':
        return this.uploadToS3(file, storage, courseId);
      default:
        throw new BadRequestException(`Storage provider ${storage.provider} not implemented`);
    }
  }

  async deleteFile(filePath: string, storage: StorageLocationEntity): Promise<void> {
    switch (storage.provider) {
      case 'local':
        await this.deleteFromLocal(filePath, storage);
        break;
      case 's3':
        await this.deleteFromS3(filePath, storage);
        break;
      default:
        throw new BadRequestException(`Storage provider ${storage.provider} not implemented`);
    }
  }

  async getFileUrl(filePath: string, storage: StorageLocationEntity): Promise<string> {
    switch (storage.provider) {
      case 'local':
        return this.getLocalFileUrl(filePath, storage);
      case 's3':
        return this.getS3FileUrl(filePath, storage);
      default:
        throw new BadRequestException(`Storage provider ${storage.provider} not implemented`);
    }
  }

  private async uploadToLocal(
    file: UploadingFile,
    storage: StorageLocationEntity,
    courseId?: string | null,
  ): Promise<string> {
    const uploadDir = courseId
      ? path.join(storage.basePath, 'courses', courseId)
      : path.join(storage.basePath, 'general');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${fileId}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  private async deleteFromLocal(filePath: string, storage: StorageLocationEntity): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, ignore
    }
  }

  private getLocalFileUrl(filePath: string, storage: StorageLocationEntity): string {
    const relativePath = path.relative(storage.basePath, filePath);
    return `/files/${relativePath.replace(/\\/g, '/')}`;
  }

  private async uploadToS3(file: UploadingFile, storage: StorageLocationEntity, courseId?: string | null): Promise<string> {
    const bucket = this.getBucket(storage);
    const client = this.getS3Client(storage);
    const key = this.buildS3Key(file.originalname, storage, courseId);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype ?? 'application/octet-stream',
      }),
    );

    return key;
  }

  private async deleteFromS3(filePath: string, storage: StorageLocationEntity): Promise<void> {
    const bucket = this.getBucket(storage);
    const client = this.getS3Client(storage);
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: filePath,
      }),
    );
  }

  private getS3FileUrl(filePath: string, storage: StorageLocationEntity): string {
    const bucket = this.getBucket(storage);
    const region = storage.region ?? loadAwsConfig().region;

    if (storage.endpoint) {
      return `${storage.endpoint.replace(/\/$/, '')}/${filePath}`;
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
  }

  async createPresignedUpload(dto: GetPresignedUrlDto, storage: StorageLocationEntity) {
    switch (storage.provider) {
      case 's3':
        return this.createS3PresignedUrl(dto, storage);
      case 'local':
      default:
        return {
          provider: storage.provider,
          method: 'POST',
          url: '/files/upload',
          headers: {},
          fields: {},
          filePath: null,
          expiresIn: 0,
        };
    }
  }

  private async createS3PresignedUrl(dto: GetPresignedUrlDto, storage: StorageLocationEntity) {
    const bucket = this.getBucket(storage);
    const client = this.getS3Client(storage);
    const key = this.buildS3Key(dto.filename, storage, dto.courseId);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: dto.mimeType,
      ContentLength: dto.fileSize,
    });

    const awsConfig = loadAwsConfig();
    const expiresIn = Number(storage.credentials?.signedUrlExpiresIn ?? awsConfig.signedUrlExpiresIn ?? 900);
    const url = await getSignedUrl(client, command, { expiresIn });

    return {
      provider: 's3' as StorageProvider,
      method: 'PUT',
      url,
      headers: {
        'Content-Type': dto.mimeType,
      },
      fields: {},
      filePath: key,
      bucket,
      expiresIn,
    };
  }

  private buildS3Key(filename: string, storage: StorageLocationEntity, courseId?: string | null) {
    const sanitized = this.sanitizeFilename(filename);
    const base = (storage.basePath || '').replace(/^\//, '').replace(/\/$/, '');
    const segments = [];
    if (base) segments.push(base);
    segments.push(courseId ? `courses/${courseId}` : 'general');
    const prefix = segments.filter(Boolean).join('/');
    return `${prefix}/${uuidv4()}-${sanitized}`.replace(/\/{2,}/g, '/');
  }

  private sanitizeFilename(filename: string) {
    return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  }

  private getBucket(storage: StorageLocationEntity) {
    const bucket = storage.bucket || loadAwsConfig().bucket;
    if (!bucket) {
      throw new BadRequestException('S3 bucket is not configured for this storage location');
    }
    return bucket;
  }

  private getS3Client(storage: StorageLocationEntity) {
    const awsConfig = loadAwsConfig();
    const credentials = storage.credentials || {};
    const accessKeyId = credentials.accessKeyId ?? awsConfig.accessKeyId;
    const secretAccessKey = credentials.secretAccessKey ?? awsConfig.secretAccessKey;

    if (!accessKeyId || !secretAccessKey) {
      throw new BadRequestException('S3 credentials are not configured');
    }

    return new S3Client({
      region: storage.region ?? awsConfig.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: storage.endpoint,
      forcePathStyle: Boolean(storage.endpoint && !storage.endpoint.includes('amazonaws.com')),
    });
  }
}

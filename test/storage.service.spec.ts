import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageService } from '../src/modules/file-manager/services/storage.service';
import { StorageLocationEntity } from '../src/modules/file-manager/entities/storage-location.entity';
import type { GetPresignedUrlDto } from '../src/modules/file-manager/dto/upload-presign.dto';

const mockSend = vi.fn();

vi.mock('@aws-sdk/client-s3', () => {
  class PutObjectCommand {
    constructor(public readonly input: any) {}
  }
  class DeleteObjectCommand {
    constructor(public readonly input: any) {}
  }
  class S3Client {
    send = mockSend;
    constructor(public readonly config: any) {}
  }
  return { S3Client, PutObjectCommand, DeleteObjectCommand };
});

const mockGetSignedUrl = vi.fn(() => Promise.resolve('https://signed-url'));
vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args: any[]) => mockGetSignedUrl(...args),
}));

vi.mock('../src/config/aws.config', () => ({
  loadAwsConfig: () => ({
    region: 'us-east-1',
    accessKeyId: 'test',
    secretAccessKey: 'secret',
    bucket: 'main-bucket',
    signedUrlExpiresIn: 600,
  }),
}));

describe('StorageService', () => {
  const service = new StorageService();
  const s3Storage = {
    provider: 's3',
    basePath: 'uploads',
    bucket: 'custom-bucket',
    region: 'eu-central-1',
  } as StorageLocationEntity;

  beforeEach(() => {
    mockSend.mockClear();
    mockGetSignedUrl.mockClear();
  });

  it('generates S3 presigned upload payload', async () => {
    const dto: GetPresignedUrlDto = {
      filename: 'report.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024,
    };

    const result = await service.createPresignedUpload(dto, s3Storage);

    expect(result.provider).toBe('s3');
    expect(result.method).toBe('PUT');
    expect(result.filePath).toContain('report.pdf');
    expect(mockGetSignedUrl).toHaveBeenCalledOnce();
  });

  it('falls back to local upload info when provider is local', async () => {
    const localStorage = {
      provider: 'local',
      basePath: '/data/uploads',
    } as StorageLocationEntity;

    const dto: GetPresignedUrlDto = { filename: 'demo.txt', mimeType: 'text/plain' };
    const result = await service.createPresignedUpload(dto, localStorage);

    expect(result.url).toBe('/files/upload');
    expect(result.provider).toBe('local');
    expect(result.filePath).toBeNull();
  });
});


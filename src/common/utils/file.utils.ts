import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';

export interface FileMetadata {
  filename: string;
  mimetype: string;
  size: number;
}

export function buildStoragePath(basePath: string, filename: string): string {
  return path.join(basePath, filename);
}

export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  return `${randomUUID()}${ext}`;
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function deleteFileIfExists(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }
}

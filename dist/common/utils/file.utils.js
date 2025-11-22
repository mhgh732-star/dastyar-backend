"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStoragePath = buildStoragePath;
exports.generateFileName = generateFileName;
exports.ensureDir = ensureDir;
exports.deleteFileIfExists = deleteFileIfExists;
const path = require("path");
const fs = require("fs/promises");
const crypto_1 = require("crypto");
function buildStoragePath(basePath, filename) {
    return path.join(basePath, filename);
}
function generateFileName(originalName) {
    const ext = path.extname(originalName);
    return `${(0, crypto_1.randomUUID)()}${ext}`;
}
async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}
async function deleteFileIfExists(filePath) {
    try {
        await fs.unlink(filePath);
    }
    catch (error) {
        if (error.code !== 'ENOENT')
            throw error;
    }
}
//# sourceMappingURL=file.utils.js.map
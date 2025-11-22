import * as bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 12;

export async function hashPassword(plainTextPassword: string, saltRounds: number = DEFAULT_SALT_ROUNDS): Promise<string> {
  if (!plainTextPassword || plainTextPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plainTextPassword, salt);
}

export async function verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  if (!hashedPassword) return false;
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

export function getPasswordStrengthScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0..5
}

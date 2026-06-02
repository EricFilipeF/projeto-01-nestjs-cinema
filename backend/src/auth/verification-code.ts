import { randomInt, createHash } from 'crypto';

export const generateVerificationCode = (): string => {
  return randomInt(100000, 1000000).toString();
};

export const hashVerificationCode = (code: string): string =>
  createHash('sha256').update(code.trim()).digest('hex');
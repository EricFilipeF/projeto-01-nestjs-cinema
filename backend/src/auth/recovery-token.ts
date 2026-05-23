import { createHash, randomBytes } from 'crypto';

export const generateRecoveryToken = (): string => randomBytes(24).toString('hex');

export const hashRecoveryToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
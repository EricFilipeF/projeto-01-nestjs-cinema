import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const deriveKey = (password: string, salt: string) => scryptSync(password, salt, 64);

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = deriveKey(password, salt).toString('hex');

  return `${salt}:${derivedKey}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, hashedPassword] = storedHash.split(':');

  if (!salt || !hashedPassword) {
    return false;
  }

  const derivedKey = deriveKey(password, salt);
  const storedKey = Buffer.from(hashedPassword, 'hex');

  return derivedKey.length === storedKey.length && timingSafeEqual(derivedKey, storedKey);
};
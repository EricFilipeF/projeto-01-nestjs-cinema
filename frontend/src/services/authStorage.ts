import type { AuthSession } from '../models/Auth';

const STORAGE_KEY = 'cineweb-auth-session';

export const getStoredAuth = (): AuthSession | null => {
  const rawSession = window.localStorage.getItem(STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setStoredAuth = (session: AuthSession) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAuth = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getStoredToken = (): string | null => getStoredAuth()?.accessToken ?? null;
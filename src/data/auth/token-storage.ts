/**
 * Secure token storage using Keychain (iOS) / Keystore (Android).
 * Tokens must not be stored in AsyncStorage/MMKV.
 */
import * as SecureStore from 'expo-secure-store';
import { logger } from '../../shared/lib/logger';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/** Coerce to string; SecureStore accepts only strings. */
function toStoredValue(value: unknown): string {
  if (value == null) {
    throw new Error('Token value is null or undefined');
  }
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

export type TokenStorage = {
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (token: string) => Promise<void>;
  deleteAccessToken: () => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
  setRefreshToken: (token: string) => Promise<void>;
  deleteRefreshToken: () => Promise<void>;
  clearTokens: () => Promise<void>;
};

export function createTokenStorage(): TokenStorage {
  return {
    async getAccessToken() {
      return SecureStore.getItemAsync(ACCESS_TOKEN_KEY, SECURE_OPTIONS);
    },
    async setAccessToken(token: string) {
      const value = toStoredValue(token);
      logger.debug('[TokenStorage] setAccessToken', { type: typeof token, length: value.length });
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, value, SECURE_OPTIONS);
    },
    async deleteAccessToken() {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, SECURE_OPTIONS);
    },
    async getRefreshToken() {
      return SecureStore.getItemAsync(REFRESH_TOKEN_KEY, SECURE_OPTIONS);
    },
    async setRefreshToken(token: string) {
      const value = toStoredValue(token);
      logger.debug('[TokenStorage] setRefreshToken', { type: typeof token, length: value.length });
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, value, SECURE_OPTIONS);
    },
    async deleteRefreshToken() {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, SECURE_OPTIONS);
    },
    async clearTokens() {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, SECURE_OPTIONS),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, SECURE_OPTIONS),
      ]);
    },
  };
}

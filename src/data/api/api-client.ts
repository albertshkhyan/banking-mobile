import { err, ok, type Result, type AppError } from '../../shared/types/result';
import { env } from '../../shared/config/env';
import { logger } from '../../shared/lib/logger';

export type ApiResponse<T> = Result<T, AppError>;

async function normalizeError(e: unknown, status?: number): Promise<AppError> {
  if (e && typeof e === 'object' && 'message' in e) {
    return {
      code: 'API_ERROR',
      message: (e as { message: string }).message,
      statusCode: status,
      details: e,
    };
  }
  return {
    code: 'UNKNOWN',
    message: e instanceof Error ? e.message : 'Unknown error',
    statusCode: status,
  };
}

export type ApiClient = {
  get: <T>(path: string) => Promise<ApiResponse<T>>;
};

export function createApiClient(baseURL: string = env.apiUrl): ApiClient {
  return {
    async get<T>(path: string): Promise<ApiResponse<T>> {
      const url = `${baseURL}${path}`;
      logger.debug('API request', { method: 'GET', url });
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = (await res.json().catch(() => ({}))) as T;
        if (!res.ok) {
          const error = await normalizeError(data, res.status);
          const isAuthGate401 = path === '/auth/me' && res.status === 401;
          if (isAuthGate401) {
            logger.debug('Auth check (not logged in)', { path, status: 401 });
          } else {
            logger.warn('API response error', { method: 'GET', path, status: res.status, code: error.code });
          }
          return err(error);
        }
        logger.debug('API response', { method: 'GET', path, status: res.status, ok: true });
        return ok(data);
      } catch (e) {
        const error = await normalizeError(e);
        logger.warn('API request failed', { method: 'GET', path, code: error.code, message: error.message });
        return err(error);
      }
    },
  };
}

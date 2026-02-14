import { err, ok, type Result, type AppError } from '../../shared/types/result';
import { logger } from '../../shared/lib/logger';
import type { TokenStorage } from '../auth/token-storage';

export type ApiResponse<T> = Result<T, AppError>;

const AUTH_ERROR_CODE = 'AUTH_ERROR';
const AUTH_REFRESH_PATH = '/auth/refresh';

/** Redact password in auth request bodies for safe logging */
function redactAuthBody(path: string, body: unknown): unknown {
  if (body == null || typeof body !== 'object') return body;
  const p = path.toLowerCase();
  if (!p.includes('auth')) return body;
  const copy = { ...(body as Record<string, unknown>) };
  if ('password' in copy) copy.password = '[REDACTED]';
  if ('confirmPassword' in copy) copy.confirmPassword = '[REDACTED]';
  return copy;
}

function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

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
  post: <T, B = unknown>(path: string, body: B) => Promise<ApiResponse<T>>;
};

export type CreateApiClientDeps = {
  baseURL: string;
  tokenStorage: TokenStorage;
  /** Called on 401 to refresh tokens. Must not add Authorization. */
  performRefresh: () => Promise<Result<void, AppError>>;
};

export function createApiClient(deps: CreateApiClientDeps): ApiClient {
  const { baseURL, tokenStorage, performRefresh } = deps;
  let refreshPromise: Promise<Result<void, AppError>> | null = null;

  async function clearTokensAndFail(): Promise<never> {
    await tokenStorage.clearTokens();
    throw err<AppError>({
      code: AUTH_ERROR_CODE,
      message: 'Session expired. Please sign in again.',
      statusCode: 401,
    });
  }

  async function request<T, B = undefined>(
    method: 'GET' | 'POST',
    path: string,
    body?: B,
    retried = false
  ): Promise<ApiResponse<T>> {
    const requestId = generateRequestId();
    const url = `${baseURL}${path}`;
    const isRefreshRequest = path === AUTH_REFRESH_PATH;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
    };

    if (!isRefreshRequest) {
      const accessToken = await tokenStorage.getAccessToken();
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const init: RequestInit = {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    logger.debug('API request', { method, url, requestId });
    let res: Response;
    try {
      res = await fetch(url, init);
    } catch (e) {
      const error = await normalizeError(e);
      logger.warn('API request failed', { method, path, requestId, code: error.code });
      return err(error);
    }

    const data = (await res.json().catch(() => ({}))) as T;

    if (res.status === 401 && !retried) {
      if (isRefreshRequest) {
        await tokenStorage.clearTokens();
        return err({
          code: AUTH_ERROR_CODE,
          message: 'Session expired. Please sign in again.',
          statusCode: 401,
        });
      }
      try {
        if (!refreshPromise) refreshPromise = performRefresh();
        const refreshResult = await refreshPromise;
        refreshPromise = null;
        if (!refreshResult.ok) return err(refreshResult.error);
      } catch {
        return await clearTokensAndFail();
      }
      return request<T, B>(method, path, body, true);
    }

    if (!res.ok) {
      const error = await normalizeError(data, res.status);
      const isAuthGate401 = path === '/auth/me' && res.status === 401;
      if (isAuthGate401) {
        logger.debug('Auth check (not logged in)', { path, status: 401 });
      } else {
        logger.warn('API response error', { method, path, requestId, status: res.status, code: error.code });
      }
      return err(error);
    }

    logger.debug('API response', { method, path, requestId, status: res.status });
    return ok(data);
  }

  return {
    async get<T>(path: string): Promise<ApiResponse<T>> {
      return request<T>('GET', path);
    },
    async post<T, B>(path: string, body: B): Promise<ApiResponse<T>> {
      const safeBody = redactAuthBody(path, body);
      logger.debug('API request body', { path, requestBody: safeBody });
      return request<T, B>('POST', path, body);
    },
  };
}

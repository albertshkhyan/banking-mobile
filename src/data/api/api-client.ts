import { err, ok, type Result, type AppError } from '../../shared/types/result';
import { env } from '../../shared/config/env';

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
      try {
        const res = await fetch(`${baseURL}${path}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = (await res.json().catch(() => ({}))) as T;
        if (!res.ok) {
          return err(await normalizeError(data, res.status));
        }
        return ok(data);
      } catch (e) {
        return err(await normalizeError(e));
      }
    },
  };
}

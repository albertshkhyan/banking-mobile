import type { AuthRepository, LoginParams, RegisterParams } from '../../domain/repositories/auth-repository';
import type { User } from '../../domain/entities/user';
import type { ApiClient } from '../api/api-client';
import type { TokenStorage } from '../auth/token-storage';
import { isErr } from '../../shared/types/result';
import { logger } from '../../shared/lib/logger';
import type {
  AuthResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
} from '../dto/auth-dto';
import type { MeDto } from '../dto/me-dto';

function mapAuthUserToEntity(dto: AuthResponseDto['user']): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
  };
}

/** Extract token string from response; supports camelCase and snake_case. */
function pickToken(raw: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = raw[k];
    if (v != null && typeof v === 'string') return v;
  }
  const receivedKeys = Object.keys(raw);
  logger.warn('[AuthRepo] token missing or not a string', {
    expectedKeys: keys,
    receivedKeys,
    receivedTypes: keys.map((k) => [k, typeof raw[k]]),
  });
  throw new Error(
    `Login response must include access and refresh tokens. Expected one of [${keys.join(', ')}]. Received keys: ${receivedKeys.join(', ') || '(none)'}`
  );
}

/** Unwrap { data: { user, accessToken, ... } } or use body as-is. */
function unwrapLoginPayload(value: Record<string, unknown>): Record<string, unknown> {
  const data = value.data;
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return value;
}

export function createAuthRepository(api: ApiClient, tokenStorage: TokenStorage): AuthRepository {
  return {
    async login(params: LoginParams) {
      logger.debug('[AuthRepo] login request', { email: params.email });
      const res = await api.post<LoginResponseDto, LoginParams>('/auth/login', params);
      if (isErr(res)) return res;
      const body = res.value as unknown as Record<string, unknown>;
      const raw = unwrapLoginPayload(body);
      logger.debug('[AuthRepo] login response keys', { topLevel: Object.keys(body), unwrapped: Object.keys(raw) });
      const accessToken = pickToken(raw, 'accessToken', 'access_token');
      const refreshToken = pickToken(raw, 'refreshToken', 'refresh_token');
      await tokenStorage.setAccessToken(accessToken);
      await tokenStorage.setRefreshToken(refreshToken);
      logger.debug('[AuthRepo] tokens stored after login');
      const user = (raw.user ?? body.user) as AuthResponseDto['user'];
      return { ok: true, value: mapAuthUserToEntity(user) };
    },
    async register(params: RegisterParams) {
      const res = await api.post<AuthResponseDto, RegisterParams>('/auth/register', params);
      if (isErr(res)) return res;
      return { ok: true, value: mapAuthUserToEntity(res.value.user) };
    },
    async refresh() {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        return {
          ok: false,
          error: { code: 'AUTH_ERROR', message: 'No refresh token', statusCode: 401 },
        };
      }
      logger.debug('[AuthRepo] refresh request');
      const res = await api.post<RefreshResponseDto, { refreshToken: string }>('/auth/refresh', {
        refreshToken,
      });
      if (isErr(res)) return res;
      const body = res.value as unknown as Record<string, unknown>;
      const raw = body.data != null && typeof body.data === 'object' && !Array.isArray(body.data)
        ? (body.data as Record<string, unknown>)
        : body;
      const newAccess = pickToken(raw, 'accessToken', 'access_token');
      const newRefresh = pickToken(raw, 'refreshToken', 'refresh_token');
      await tokenStorage.setAccessToken(newAccess);
      await tokenStorage.setRefreshToken(newRefresh);
      logger.debug('[AuthRepo] tokens stored after refresh');
      return { ok: true, value: undefined };
    },
    async logout() {
      await tokenStorage.clearTokens();
    },
    async getMe() {
      const res = await api.get<MeDto>('/me');
      if (!isErr(res)) {
        return { ok: true as const, value: { id: res.value.id, firstName: res.value.firstName, lastName: res.value.lastName } };
      }
      if (res.error.statusCode === 404) {
        const fallback = await api.get<{ user: { id: string; name: string } }>('/auth/me');
        if (!isErr(fallback)) {
          const [firstName, ...rest] = (fallback.value.user.name || 'User').trim().split(/\s+/);
          return { ok: true as const, value: { id: fallback.value.user.id, firstName: firstName ?? 'User', lastName: rest.join(' ') || '' } };
        }
      }
      return res;
    },
  };
}

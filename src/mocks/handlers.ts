import { http, HttpResponse } from 'msw';
import type { AccountDto } from '../data/dto/account-dto';
import type { TransactionDto } from '../data/dto/transaction-dto';
import type { NotificationDto } from '../data/dto/notification-dto';
import type { AuthResponseDto, LoginResponseDto } from '../data/dto/auth-dto';

const accounts: AccountDto[] = [
  { id: '1', name: 'Main', type: 'checking', balance: 12500.5, currency: 'USD' },
  { id: '2', name: 'Savings', type: 'savings', balance: 50000, currency: 'USD' },
];

const transactions: TransactionDto[] = [
  {
    id: 't1',
    accountId: '1',
    amount: -50,
    currency: 'USD',
    type: 'debit',
    description: 'Coffee shop',
    date: new Date().toISOString(),
  },
  {
    id: 't2',
    accountId: '1',
    amount: 200,
    currency: 'USD',
    type: 'credit',
    description: 'Transfer in',
    date: new Date().toISOString(),
  },
];

const notifications: NotificationDto[] = [
  {
    id: 'n1',
    title: 'Payment received',
    body: 'You received $200.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

const authUser: AuthResponseDto['user'] = { id: '1', name: 'Mock User', email: 'user@example.com' };

/** In-memory token store for MSW: access tokens expire after this ms to simulate expiry and trigger refresh. */
const ACCESS_TOKEN_TTL_MS = 2000;

const accessTokens = new Map<string, number>();
const refreshTokens = new Set<string>();

function generateToken(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function isAccessTokenValid(token: string): boolean {
  const issuedAt = accessTokens.get(token);
  if (issuedAt == null) return false;
  return Date.now() - issuedAt < ACCESS_TOKEN_TTL_MS;
}

function requireAuth(request: Request): HttpResponse<{ message: string }> | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return HttpResponse.json({ message: 'Missing or invalid Authorization' }, { status: 401 });
  }
  const token = auth.slice(7);
  if (!isAccessTokenValid(token)) {
    return HttpResponse.json({ message: 'Token expired or invalid' }, { status: 401 });
  }
  return null;
}

/** GET /auth/me: 200 if valid Bearer token, else 401. */
function handleAuthMe(request: Request) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return new HttpResponse(null, { status: 401 });
  }
  const token = auth.slice(7);
  if (!isAccessTokenValid(token)) {
    return new HttpResponse(null, { status: 401 });
  }
  return HttpResponse.json({ user: authUser });
}

export const handlers = [
  http.get('*/auth/me', ({ request }) => handleAuthMe(request)),
  http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body?.email || !body?.password) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const accessToken = generateToken('at');
    const refreshToken = generateToken('rt');
    accessTokens.set(accessToken, Date.now());
    refreshTokens.add(refreshToken);
    const payload: LoginResponseDto = {
      user: { ...authUser, email: body.email },
      accessToken,
      refreshToken,
    };
    return HttpResponse.json(payload);
  }),
  http.post('*/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string };
    const refreshToken = body?.refreshToken;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      return HttpResponse.json({ message: 'Invalid or expired refresh token' }, { status: 401 });
    }
    refreshTokens.delete(refreshToken);
    const newAccessToken = generateToken('at');
    const newRefreshToken = generateToken('rt');
    accessTokens.set(newAccessToken, Date.now());
    refreshTokens.add(newRefreshToken);
    return HttpResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }),
  http.post('*/auth/register', async ({ request }) => {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    if (body?.name && body?.email && body?.password) {
      return HttpResponse.json(
        { user: { id: '2', name: body.name, email: body.email } },
        { status: 201 }
      );
    }
    return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }),
  http.get('*/accounts', ({ request }) => {
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    return HttpResponse.json(accounts);
  }),
  http.get('*/transactions', ({ request }) => {
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    return HttpResponse.json(transactions.slice(0, limit));
  }),
  http.get('*/notifications', ({ request }) => {
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    return HttpResponse.json(notifications);
  }),
];

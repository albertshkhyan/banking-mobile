import { http, HttpResponse } from 'msw';
import type { AccountDto } from '../data/dto/account-dto';
import type { TransactionDto } from '../data/dto/transaction-dto';
import type { NotificationDto } from '../data/dto/notification-dto';
import type { AuthResponseDto, LoginResponseDto } from '../data/dto/auth-dto';
import type { MeDto } from '../data/dto/me-dto';
import type { AccountsSummaryDto } from '../data/dto/accounts-summary-dto';
import type { UnreadCountDto } from '../data/dto/unread-count-dto';

// ─── Error simulation: set to true to force one endpoint to fail (for testing error state)
const SIMULATE_ERROR = false;

const MOCK_DELAY_MS_MIN = 300;
const MOCK_DELAY_MS_MAX = 800;

function delay(): Promise<void> {
  const ms = MOCK_DELAY_MS_MIN + Math.random() * (MOCK_DELAY_MS_MAX - MOCK_DELAY_MS_MIN);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const accounts: AccountDto[] = [
  { id: '1', name: 'Main', type: 'checking', balance: 12500.5, currency: 'USD' },
  { id: '2', name: 'Savings', type: 'savings', balance: 50000, currency: 'USD' },
];

const transactions: TransactionDto[] = [
  {
    id: 't1',
    accountId: '1',
    amount: -8.5,
    currency: 'USD',
    type: 'debit',
    description: 'Coffee shop',
    date: new Date().toISOString(),
    merchant: 'Starbucks Coffee',
    status: 'posted',
  },
  {
    id: 't2',
    accountId: '1',
    amount: 5250,
    currency: 'USD',
    type: 'credit',
    description: 'Transfer in',
    date: new Date(Date.now() - 864e5).toISOString(),
    merchant: 'Salary Deposit',
    status: 'posted',
  },
  {
    id: 't3',
    accountId: '1',
    amount: -156.42,
    currency: 'USD',
    type: 'debit',
    description: 'Online purchase',
    date: new Date(Date.now() - 2 * 864e5).toISOString(),
    merchant: 'Amazon Purchase',
    status: 'posted',
  },
  {
    id: 't4',
    accountId: '1',
    amount: -15.99,
    currency: 'USD',
    type: 'debit',
    description: 'Subscription',
    date: new Date(Date.now() - 3 * 864e5).toISOString(),
    merchant: 'Netflix Subscription',
    status: 'posted',
  },
  {
    id: 't5',
    accountId: '1',
    amount: -50,
    currency: 'USD',
    type: 'debit',
    description: 'Grocery',
    date: new Date(Date.now() - 4 * 864e5).toISOString(),
    merchant: 'Whole Foods',
    status: 'pending',
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
  {
    id: 'n2',
    title: 'Security alert',
    body: 'New device logged in.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

const authUser: AuthResponseDto['user'] = { id: '1', name: 'Mock User', email: 'user@example.com' };

const meUser: MeDto = {
  id: '1',
  firstName: 'Mock',
  lastName: 'User',
};

const accountsSummary: AccountsSummaryDto = {
  totalBalance: 62500.5,
  availableFunds: 61234.5,
  currency: 'USD',
};

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
  http.get('*/auth/me', async ({ request }) => {
    await delay();
    return handleAuthMe(request);
  }),
  http.get('*/me', async ({ request }) => {
    await delay();
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    if (SIMULATE_ERROR) {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    }
    return HttpResponse.json(meUser);
  }),
  http.get('*/accounts/summary', async ({ request }) => {
    await delay();
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    if (SIMULATE_ERROR) {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 });
    }
    return HttpResponse.json(accountsSummary);
  }),
  http.get('*/notifications/unread-count', async ({ request }) => {
    await delay();
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    const count = notifications.filter((n) => !n.read).length;
    const payload: UnreadCountDto = { count };
    return HttpResponse.json(payload);
  }),
  http.post('*/auth/login', async ({ request }) => {
    await delay();
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
    await delay();
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
    await delay();
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    if (body?.name && body?.email && body?.password) {
      return HttpResponse.json(
        { user: { id: '2', name: body.name, email: body.email } },
        { status: 201 }
      );
    }
    return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }),
  http.get('*/accounts', async ({ request }) => {
    await delay();
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    return HttpResponse.json(accounts);
  }),
  http.get('*/transactions', async ({ request }) => {
    await delay();
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 10) || 10, 100);
    return HttpResponse.json(transactions.slice(0, limit));
  }),
  http.get('*/notifications', async ({ request }) => {
    await delay();
    const unauth = requireAuth(request);
    if (unauth) return unauth;
    return HttpResponse.json(notifications);
  }),
];

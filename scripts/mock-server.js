/**
 * Local mock API for the app when EXPO_PUBLIC_USE_MOCKS is on.
 * Supports access + refresh token flow; protected routes require Bearer token.
 * Run: npm run mock:server (or npm run dev).
 */
const http = require('http');

const PORT = 3099;
const ACCESS_TOKEN_TTL_MS = 2000;

const accounts = [
  { id: '1', name: 'Main', type: 'checking', balance: 12500.5, currency: 'USD' },
  { id: '2', name: 'Savings', type: 'savings', balance: 50000, currency: 'USD' },
];

const transactions = [
  { id: 't1', accountId: '1', amount: -50, currency: 'USD', type: 'debit', description: 'Coffee shop', date: new Date().toISOString() },
  { id: 't2', accountId: '1', amount: 200, currency: 'USD', type: 'credit', description: 'Transfer in', date: new Date().toISOString() },
];

const notifications = [
  { id: 'n1', title: 'Payment received', body: 'You received $200.', read: false, createdAt: new Date().toISOString() },
];

const accessTokens = new Map();
const refreshTokens = new Set();

function generateToken(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function isAccessValid(token) {
  const issuedAt = accessTokens.get(token);
  if (issuedAt == null) return false;
  return Date.now() - issuedAt < ACCESS_TOKEN_TTL_MS;
}

function getAuthHeader(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

function requireAuth(res, req) {
  const token = getAuthHeader(req);
  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Missing or invalid Authorization' }));
    return false;
  }
  if (!isAccessValid(token)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Token expired or invalid' }));
    return false;
  }
  return true;
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (path === '/auth/login' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { email, password } = body;
      if (email && password) {
        const accessToken = generateToken('at');
        const refreshToken = generateToken('rt');
        accessTokens.set(accessToken, Date.now());
        refreshTokens.add(refreshToken);
        send(res, 200, {
          user: { id: '1', name: 'Mock User', email },
          accessToken,
          refreshToken,
        });
      } else {
        send(res, 401, { message: 'Invalid credentials' });
      }
    } catch {
      send(res, 400, { message: 'Bad request' });
    }
    return;
  }

  if (path === '/auth/refresh' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { refreshToken } = body;
      if (!refreshToken || !refreshTokens.has(refreshToken)) {
        send(res, 401, { message: 'Invalid or expired refresh token' });
        return;
      }
      refreshTokens.delete(refreshToken);
      const newAccess = generateToken('at');
      const newRefresh = generateToken('rt');
      accessTokens.set(newAccess, Date.now());
      refreshTokens.add(newRefresh);
      send(res, 200, { accessToken: newAccess, refreshToken: newRefresh });
    } catch {
      send(res, 400, { message: 'Bad request' });
    }
    return;
  }

  if (path === '/auth/register' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { name, email, password } = body;
      if (name && email && password) {
        send(res, 201, { user: { id: '2', name: name || 'New User', email } });
      } else {
        send(res, 400, { message: 'Missing required fields' });
      }
    } catch {
      send(res, 400, { message: 'Bad request' });
    }
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405);
    res.end();
    return;
  }

  if (path === '/auth/me') {
    const token = getAuthHeader(req);
    if (!token || !isAccessValid(token)) {
      res.writeHead(401);
      res.end();
      return;
    }
    send(res, 200, { user: { id: '1', name: 'Mock User' } });
    return;
  }

  if (path === '/accounts') {
    if (!requireAuth(res, req)) return;
    send(res, 200, accounts);
    return;
  }
  if (path === '/transactions') {
    if (!requireAuth(res, req)) return;
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 10) || 10, 100);
    send(res, 200, transactions.slice(0, limit));
    return;
  }
  if (path === '/notifications') {
    if (!requireAuth(res, req)) return;
    send(res, 200, notifications);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`[mocks] API http://localhost:${PORT} (token auth: login -> accessToken/refreshToken, protected: /accounts, /transactions, /notifications)`);
  console.log('[mocks] Access token TTL:', ACCESS_TOKEN_TTL_MS, 'ms (401 after expiry to test refresh)');
});

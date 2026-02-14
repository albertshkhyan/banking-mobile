/**
 * Local mock API for the app when EXPO_PUBLIC_USE_MOCKS is on.
 * Run: npm run mock:server
 * App uses EXPO_PUBLIC_API_URL or http://localhost:3099 (use your machine IP for device).
 */
const http = require('http');

const PORT = 3099;

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

const mockAuthLoggedIn = process.env.EXPO_PUBLIC_MOCK_AUTH === 'logged_in';

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (req.method !== 'GET') {
    res.writeHead(405);
    res.end();
    return;
  }

  if (path === '/auth/me') {
    if (mockAuthLoggedIn) {
      send(res, 200, { user: { id: '1', name: 'Mock User' } });
    } else {
      res.writeHead(401);
      res.end();
    }
    return;
  }
  if (path === '/accounts') {
    send(res, 200, accounts);
    return;
  }
  if (path === '/transactions') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 10) || 10, 100);
    send(res, 200, transactions.slice(0, limit));
    return;
  }
  if (path === '/notifications') {
    send(res, 200, notifications);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`[mocks] API http://localhost:${PORT} (auth: ${mockAuthLoggedIn ? 'logged_in' : '401'})`);
  console.log('[mocks] App in __DEV__ uses this URL automatically. For device, set EXPO_PUBLIC_API_URL=http://<your-ip>:3099');
});

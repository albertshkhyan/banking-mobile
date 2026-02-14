# MSW Setup for Expo

## Install

```bash
npm install msw @tanstack/react-query
```

## Mock-first flow

1. Set `EXPO_PUBLIC_USE_MOCKS=true` in `.env` (or `EXPO_PUBLIC_USE_MOCKS=true` in shell).
2. Set `EXPO_PUBLIC_API_URL` to the base URL your app will call. When using MSW node server, use a base URL that MSW will intercept (e.g. `https://api.example.com`); MSW patches `fetch` so the same path is intercepted.
3. In app entry, call `bootstrap()` before rendering so MSW server starts and patches global `fetch`.

## App entry (Expo Router)

In your root `_layout.tsx` or an async entry wrapper:

- Option A: In `app/_layout.tsx`, use `useEffect` to call `bootstrap()` once (fire-and-forget), or
- Option B: Create a wrapper component that awaits `bootstrap()` then renders children (recommended so UI waits for mocks).

Example wrapper (use in root layout):

```tsx
// app/_layout.tsx
import { bootstrap } from '@/src/app/bootstrap';
import { AppProviders } from '@/src/app';
import { useEffect, useState } from 'react';

function useMocksReady() {
  const [ready, setReady] = useState(!process.env.EXPO_PUBLIC_USE_MOCKS);
  useEffect(() => {
    if (!process.env.EXPO_PUBLIC_USE_MOCKS) {
      setReady(true);
      return;
    }
    bootstrap().then(() => setReady(true));
  }, []);
  return ready;
}

export default function RootLayout() {
  const ready = useMocksReady();
  if (!ready) return null; // or splash
  return (
    <AppProviders>
      {/* ... Stack, etc. */}
    </AppProviders>
  );
}
```

## MSW in React Native / Expo

- **Node server (`msw/node`):** `setupServer` patches global `fetch`. In Expo/Metro, global `fetch` is available, so calling `server.listen()` in the app process will intercept requests. Use this for mock-first development.
- **Browser worker (`msw/browser`):** For web builds only; use `worker.start()` in browser.
- **Jest:** In `jest.setup.js`, import and call `server.listen()` and `server.close()` in afterEach.

## Handlers

Handlers live in `src/mocks/handlers.ts` and define:

- `GET */accounts` → list of accounts
- `GET */transactions?limit=N` → recent transactions
- `GET */notifications` → list of notifications

All API calls in the app go through `createApiClient(env.apiUrl).get(path)`, so MSW intercepts when the request URL matches.

## Turning off mocks

Set `EXPO_PUBLIC_USE_MOCKS=false` and provide a real `EXPO_PUBLIC_API_URL`. No code changes needed; `bootstrap()` no-ops and the same API client hits the real backend.

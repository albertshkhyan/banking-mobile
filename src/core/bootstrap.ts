import { env } from '../shared/config/env';

/**
 * Optional app init. In dev with useMocks, the app uses the local mock server (npm run dev or mock:server).
 * Auth is token-based: login stores access/refresh in SecureStore; protected routes and /auth/me require Bearer.
 * For easier testing: log in once; tokens persist in SecureStore until logout or expiry.
 */
export async function bootstrap(): Promise<void> {
  if (!env.useMocks) return;
  // Mock server runs at env.apiUrl (localhost:3099). No in-app MSW worker (RN has no Service Worker).
}

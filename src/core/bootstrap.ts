import { env } from '../shared/config/env';

/**
 * Optional app init. When useMocks, the app uses the local mock server (npm run mock:server); no in-app MSW.
 */
export async function bootstrap(): Promise<void> {
  if (!env.useMocks) return;
  // Mocks are served by scripts/mock-server.js; app apiUrl is already set to localhost:3099.
}

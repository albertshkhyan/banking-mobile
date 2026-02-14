import { env } from '../shared/config/env';

/**
 * Call before app render when using mocks. MSW server patches global fetch.
 * In Expo entry: await bootstrap(); then render.
 */
export async function bootstrap(): Promise<void> {
  if (!env.useMocks) return;
  const { server } = await import('../mocks/server');
  server.listen({ onUnhandledRequest: 'warn' });
}

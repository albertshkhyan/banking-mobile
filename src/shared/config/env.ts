/**
 * Environment config. Expo inlines EXPO_PUBLIC_* at build time.
 * With mocks (default in __DEV__): app uses http://localhost:3099. Run mock server first: npm run dev (or npm run mock:server in another terminal).
 * For device: EXPO_PUBLIC_API_URL=http://<your-ip>:3099. EXPO_PUBLIC_MOCK_AUTH=logged_in for auth gate.
 */
const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
const useMocks =
  process.env.EXPO_PUBLIC_USE_MOCKS === 'true' ||
  (isDev && process.env.EXPO_PUBLIC_USE_MOCKS !== 'false');
export const env = {
  apiUrl: useMocks
    ? (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3099')
    : (process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com'),
  useMocks,
} as const;

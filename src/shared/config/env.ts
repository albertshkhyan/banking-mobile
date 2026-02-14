/**
 * Environment config. Expo inlines EXPO_PUBLIC_* at build time.
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS === 'true',
} as const;

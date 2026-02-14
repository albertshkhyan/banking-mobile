/**
 * Domain interface for biometric auth. Implemented in data layer.
 * No Expo/React imports.
 */

export type BiometricRepository = {
  isAvailable: () => Promise<boolean>;
  getBiometryLabel: () => Promise<string | null>;
  authenticate: (reason?: string) => Promise<{ ok: boolean; error?: string }>;
};

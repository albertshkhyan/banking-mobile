import type { BiometricRepository } from '../../domain/repositories/biometric-repository';
import * as biometricService from '../auth/biometric-service';

const DEFAULT_REASON = 'Sign in to continue';

export function createBiometricRepository(): BiometricRepository {
  return {
    async isAvailable() {
      return biometricService.isBiometricAvailable();
    },
    async getBiometryLabel() {
      return biometricService.getBiometryType();
    },
    async authenticate(reason: string = DEFAULT_REASON) {
      const result = await biometricService.authenticate(reason);
      return { ok: result.ok, error: result.error };
    },
  };
}

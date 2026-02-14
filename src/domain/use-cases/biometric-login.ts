import type { AuthRepository } from '../repositories/auth-repository';
import type { BiometricRepository } from '../repositories/biometric-repository';
import type { Result } from '../../shared/types/result';

export type BiometricLogin = (deps: {
  authRepo: AuthRepository;
  biometricRepo: BiometricRepository;
}) => Promise<Result<void>>;

const DEFAULT_REASON = 'Sign in with biometrics';

export function createBiometricLogin(): BiometricLogin {
  return async ({ authRepo, biometricRepo }) => {
    const available = await biometricRepo.isAvailable();
    if (!available) {
      return { ok: false, error: { code: 'BIOMETRIC_UNAVAILABLE', message: 'Biometrics not available' } };
    }
    const authResult = await biometricRepo.authenticate(DEFAULT_REASON);
    if (!authResult.ok) {
      return {
        ok: false,
        error: {
          code: 'BIOMETRIC_FAILED',
          message: authResult.error ?? 'Authentication failed',
        },
      };
    }
    const refreshResult = await authRepo.refresh();
    if (!refreshResult.ok) {
      return refreshResult;
    }
    return { ok: true, value: undefined };
  };
}

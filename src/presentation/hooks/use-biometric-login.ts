import { useCallback, useEffect, useState } from 'react';
import { getRepos, getUseCases } from '../../core/di/factory';

export function useBiometricLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometryLabel, setBiometryLabel] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);

  const { authRepo, biometricRepo } = getRepos();
  const biometricLogin = getUseCases().biometricLogin;

  useEffect(() => {
    let cancelled = false;
    biometricRepo.isAvailable().then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    biometricRepo.getBiometryLabel().then((label) => {
      if (!cancelled) setBiometryLabel(label);
    });
    return () => {
      cancelled = true;
    };
  }, [biometricRepo]);

  const loginWithBiometrics = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await biometricLogin({ authRepo, biometricRepo });
      if (result.ok) {
        return true;
      }
      setError(result.error.message ?? 'Biometric sign-in failed');
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authRepo, biometricRepo, biometricLogin]);

  return {
    loginWithBiometrics,
    isLoading,
    error,
    biometryLabel: biometryLabel ?? 'Biometrics',
    available,
  };
}

import { useCallback } from 'react';
import { getRepos } from '../../core/di/factory';

export function useLogout() {
  const { authRepo } = getRepos();
  return useCallback(async () => {
    await authRepo.logout();
  }, [authRepo]);
}

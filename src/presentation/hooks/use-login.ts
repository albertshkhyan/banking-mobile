import { useMutation } from '@tanstack/react-query';
import { getRepos } from '../../core/di/factory';

export function useLogin() {
  const { authRepo } = getRepos();

  return useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const result = await authRepo.login(params);
      if (result.ok) return result.value;
      throw new Error(result.error.message);
    },
  });
}

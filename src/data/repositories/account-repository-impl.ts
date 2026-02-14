import type { AccountRepository } from '../../domain/repositories/account-repository';
import type { ApiClient } from '../api/api-client';
import { isErr } from '../../shared/types/result';
import { mapAccountDtoToEntity } from '../mappers/account-mapper';
import type { AccountDto } from '../dto/account-dto';

export function createAccountRepository(api: ApiClient): AccountRepository {
  return {
    async getAccounts() {
      const res = await api.get<AccountDto[]>('/accounts');
      if (isErr(res)) return res;
      return { ok: true, value: res.value.map(mapAccountDtoToEntity) };
    },
  };
}

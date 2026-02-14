import type { AccountRepository } from '../../domain/repositories/account-repository';
import type { ApiClient } from '../api/api-client';
import { isErr } from '../../shared/types/result';
import { mapAccountDtoToEntity } from '../mappers/account-mapper';
import type { AccountDto } from '../dto/account-dto';
import type { AccountsSummaryDto } from '../dto/accounts-summary-dto';

export function createAccountRepository(api: ApiClient): AccountRepository {
  return {
    async getAccounts() {
      const res = await api.get<AccountDto[]>('/accounts');
      if (isErr(res)) return res;
      return { ok: true, value: res.value.map(mapAccountDtoToEntity) };
    },
    async getSummary() {
      const res = await api.get<AccountsSummaryDto>('/accounts/summary');
      if (!isErr(res)) {
        return { ok: true as const, value: { totalBalance: res.value.totalBalance, availableFunds: res.value.availableFunds, currency: res.value.currency } };
      }
      if (res.error.statusCode === 404) {
        const fallback = await api.get<AccountDto[]>('/accounts');
        if (!isErr(fallback)) {
          const totalBalance = fallback.value.reduce((sum, a) => sum + a.balance, 0);
          const currency = fallback.value[0]?.currency ?? 'USD';
          return { ok: true as const, value: { totalBalance, availableFunds: totalBalance, currency } };
        }
      }
      return res;
    },
  };
}

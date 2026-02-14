import type { TransactionRepository } from '../../domain/repositories/transaction-repository';
import type { ApiClient } from '../api/api-client';
import { isErr } from '../../shared/types/result';
import { mapTransactionDtoToEntity } from '../mappers/transaction-mapper';
import type { TransactionDto } from '../dto/transaction-dto';

export function createTransactionRepository(api: ApiClient): TransactionRepository {
  return {
    async getRecent(limit = 10) {
      const res = await api.get<TransactionDto[]>(`/transactions?limit=${limit}`);
      if (isErr(res)) return res;
      return {
        ok: true,
        value: res.value.map(mapTransactionDtoToEntity),
      };
    },
  };
}

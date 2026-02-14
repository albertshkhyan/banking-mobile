import type { Transaction } from '../../domain/entities/transaction';
import type { TransactionDto } from '../dto/transaction-dto';

export function mapTransactionDtoToEntity(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    accountId: dto.accountId,
    amount: dto.amount,
    currency: dto.currency,
    type: dto.type,
    description: dto.description,
    date: dto.date,
    merchant: dto.merchant,
    status: dto.status,
  };
}

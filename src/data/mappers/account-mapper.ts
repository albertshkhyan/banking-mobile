import type { Account } from '../../domain/entities/account';
import type { AccountDto } from '../dto/account-dto';

export function mapAccountDtoToEntity(dto: AccountDto): Account {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    balance: dto.balance,
    currency: dto.currency,
  };
}

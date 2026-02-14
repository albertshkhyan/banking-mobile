import { http, HttpResponse } from 'msw';
import type { AccountDto } from '../data/dto/account-dto';
import type { TransactionDto } from '../data/dto/transaction-dto';
import type { NotificationDto } from '../data/dto/notification-dto';

const accounts: AccountDto[] = [
  { id: '1', name: 'Main', type: 'checking', balance: 12500.5, currency: 'USD' },
  { id: '2', name: 'Savings', type: 'savings', balance: 50000, currency: 'USD' },
];

const transactions: TransactionDto[] = [
  {
    id: 't1',
    accountId: '1',
    amount: -50,
    currency: 'USD',
    type: 'debit',
    description: 'Coffee shop',
    date: new Date().toISOString(),
  },
  {
    id: 't2',
    accountId: '1',
    amount: 200,
    currency: 'USD',
    type: 'credit',
    description: 'Transfer in',
    date: new Date().toISOString(),
  },
];

const notifications: NotificationDto[] = [
  {
    id: 'n1',
    title: 'Payment received',
    body: 'You received $200.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get('*/accounts', () => HttpResponse.json(accounts)),
  http.get('*/transactions', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    return HttpResponse.json(transactions.slice(0, limit));
  }),
  http.get('*/notifications', () => HttpResponse.json(notifications)),
];

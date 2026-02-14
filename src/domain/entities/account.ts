/**
 * Account entity. Pure domain, no framework imports.
 */

export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
};

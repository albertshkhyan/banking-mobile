/**
 * Accounts summary for dashboard. Pure domain, no framework imports.
 */
export type AccountsSummary = {
  totalBalance: number;
  availableFunds: number;
  currency: string;
};

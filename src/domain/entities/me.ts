/**
 * Current user profile (from GET /me). Pure domain, no framework imports.
 */
export type Me = {
  id: string;
  firstName: string;
  lastName: string;
};

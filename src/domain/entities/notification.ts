/**
 * Notification entity. Pure domain, no framework imports.
 */

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

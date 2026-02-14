/**
 * MSW server for Node (Jest/Vitest). For the app, use scripts/mock-server.js instead (RN has no MessageEvent).
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

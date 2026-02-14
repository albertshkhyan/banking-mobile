/**
 * MSW Node server for tests and for Expo (patch global fetch in entry).
 * In Expo, call server.listen() in app entry when EXPO_PUBLIC_USE_MOCKS=true.
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

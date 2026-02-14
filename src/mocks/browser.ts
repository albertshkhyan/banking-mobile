/**
 * MSW browser worker. For web builds when using mocks.
 */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

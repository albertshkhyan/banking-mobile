/**
 * App logger: env-driven levels, __DEV__-aware, no deps.
 * EXPO_PUBLIC_LOG_LEVEL=debug|info|warn|error (default: info in __DEV__, warn in prod).
 *
 * Usage:
 *   import { logger } from '../shared/lib/logger';
 *   logger.debug('detail', { id });
 *   logger.info('loaded');
 *   logger.warn('fallback used');
 *   logger.error('request failed', err);
 */

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

function parseLevel(value: string | undefined): LogLevel {
  if (value && LOG_LEVELS.includes(value as LogLevel)) return value as LogLevel;
  return isDev ? 'info' : 'warn';
}

let minLevelOrder = LEVEL_ORDER[parseLevel(process.env.EXPO_PUBLIC_LOG_LEVEL)];

/** Call from app entry or tests to set level at runtime (e.g. from env). */
export function setLogLevel(level: LogLevel): void {
  minLevelOrder = LEVEL_ORDER[level];
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= minLevelOrder;
}

type LogPayload = unknown;

function log(level: LogLevel, message: string, payload?: LogPayload): void {
  if (!shouldLog(level)) return;
  const method = level === 'debug' ? 'debug' : level === 'info' ? 'log' : level;
  const consoleMethod = console[method] ?? console.log;
  if (payload !== undefined) {
    consoleMethod(`[${level}]`, message, payload);
  } else {
    consoleMethod(`[${level}]`, message);
  }
}

export const logger = {
  debug: (message: string, payload?: LogPayload) => log('debug', message, payload),
  info: (message: string, payload?: LogPayload) => log('info', message, payload),
  warn: (message: string, payload?: LogPayload) => log('warn', message, payload),
  error: (message: string, payload?: LogPayload) => log('error', message, payload),
} as const;

export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  NONE = 5, // ничего не логировать
}

// Определяем текущий уровень логирования по NODE_ENV
const env = process.env.NODE_ENV;
const DEFAULT_LEVEL = env === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
let currentLevel = DEFAULT_LEVEL;

/** Установить уровень логирования динамически. */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

/** Внутренняя: метка времени. */
function timestamp(): string {
  return new Date().toISOString();
}

/** Лог уровня DEBUG. */
export function debug(message: string, meta?: unknown): void {
  if (currentLevel <= LogLevel.DEBUG) {
    console.debug(`${timestamp()} [DEBUG] ${message}`, meta ?? '');
  }
}

/** Лог уровня INFO. */
export function info(message: string, meta?: unknown): void {
  if (currentLevel <= LogLevel.INFO) {
    console.info(`${timestamp()} [INFO] ${message}`, meta ?? '');
  }
}

/** Лог уровня WARN. */
export function warn(message: string, meta?: unknown): void {
  if (currentLevel <= LogLevel.WARN) {
    console.warn(`${timestamp()} [WARN] ${message}`, meta ?? '');
  }
}

/** Лог уровня ERROR. */
export function error(message: string, meta?: unknown): void {
  if (currentLevel <= LogLevel.ERROR) {
    console.error(`${timestamp()} [ERROR] ${message}`, meta ?? '');
  }
}

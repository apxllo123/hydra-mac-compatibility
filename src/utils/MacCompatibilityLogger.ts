/**
 * Hydra Mac Compatibility
 *
 * Centralized logging for the Mac compatibility system.
 *
 * The logger is intentionally independent from the UI so
 * diagnostics, Wine, repairs, dependency management, and
 * games can all use the same logging system.
 */

import {
  appendFile,
  mkdir,
} from "node:fs/promises";

import * as path from "node:path";

export type MacCompatibilityLogLevel =
  | "debug"
  | "info"
  | "warning"
  | "error";

export interface MacCompatibilityLogEntry {
  timestamp: string;

  level: MacCompatibilityLogLevel;

  message: string;

  gameId?: string;

  gameName?: string;

  component?: string;

  details?: Record<
    string,
    unknown
  >;
}

export class MacCompatibilityLogger {
  private readonly logDirectory: string;

  constructor(
    logDirectory: string,
  ) {
    this.logDirectory =
      logDirectory;
  }

  /**
   * Log a debug message.
   */
  async debug(
    message: string,
    options: LogOptions = {},
  ): Promise<void> {
    await this.write({
      ...options,
      level: "debug",
      message,
    });
  }

  /**
   * Log an informational message.
   */
  async info(
    message: string,
    options: LogOptions = {},
  ): Promise<void> {
    await this.write({
      ...options,
      level: "info",
      message,
    });
  }

  /**
   * Log a warning.
   */
  async warning(
    message: string,
    options: LogOptions = {},
  ): Promise<void> {
    await this.write({
      ...options,
      level: "warning",
      message,
    });
  }

  /**
   * Log an error.
   */
  async error(
    message: string,
    options: LogOptions = {},
  ): Promise<void> {
    await this.write({
      ...options,
      level: "error",
      message,
    });
  }

  /**
   * Write a structured log entry.
   */
  async write(
    entry: LogOptions & {
      level: MacCompatibilityLogLevel;
      message: string;
    },
  ): Promise<void> {
    const logEntry: MacCompatibilityLogEntry =
      {
        timestamp:
          new Date().toISOString(),

        level:
          entry.level,

        message:
          entry.message,

        gameId:
          entry.gameId,

        gameName:
          entry.gameName,

        component:
          entry.component,

        details:
          entry.details,
      };

    await this.ensureDirectory();

    const logFile =
      this.getLogFile(
        entry.gameName,
      );

    const line =
      this.formatEntry(
        logEntry,
      );

    await appendFile(
      logFile,
      `${line}\n`,
      "utf8",
    );
  }

  /**
   * Return the log file path for a game.
   */
  getLogFile(
    gameName?: string,
  ): string {
    if (!gameName) {
      return path.join(
        this.logDirectory,
        "compatibility.log",
      );
    }

    return path.join(
      this.logDirectory,
      `${this.sanitizeFileName(
        gameName,
      )}.log`,
    );
  }

  /**
   * Make sure the log directory exists.
   */
  private async ensureDirectory(): Promise<void> {
    await mkdir(
      this.logDirectory,
      {
        recursive: true,
      },
    );
  }

  /**
   * Convert a structured log entry into a readable line.
   */
  private formatEntry(
    entry: MacCompatibilityLogEntry,
  ): string {
    const timestamp =
      entry.timestamp;

    const level =
      entry.level
        .toUpperCase()
        .padEnd(
          7,
          " ",
        );

    const component =
      entry.component
        ? `[${entry.component}] `
        : "";

    const game =
      entry.gameName
        ? `[${entry.gameName}] `
        : "";

    let line =
      `${timestamp} ${level} ${component}${game}${entry.message}`;

    if (
      entry.details &&
      Object.keys(
        entry.details,
      ).length > 0
    ) {
      line += ` ${JSON.stringify(
        entry.details,
      )}`;
    }

    return line;
  }

  /**
   * Make a game name safe for a log filename.
   */
  private sanitizeFileName(
    name: string,
  ): string {
    const sanitized =
      name
        .trim()
        .replace(
          /[<>:"/\\|?*\u0000-\u001F]/g,
          "_",
        );

    return (
      sanitized ||
      "unknown-game"
    );
  }
}

export interface LogOptions {
  gameId?: string;

  gameName?: string;

  component?: string;

  details?: Record<
    string,
    unknown
  >;
}

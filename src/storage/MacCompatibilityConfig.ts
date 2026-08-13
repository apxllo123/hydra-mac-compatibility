/**
 * Hydra Mac Compatibility
 *
 * Central configuration for the compatibility system.
 *
 * This file defines configuration values and safe defaults.
 * It does not perform filesystem or Wine operations.
 */

export interface MacCompatibilityConfigOptions {
  /**
   * Root directory where compatibility data is stored.
   */
  rootPath: string;

  /**
   * Whether automatic backups are enabled.
   *
   * Defaults to true.
   */
  automaticBackups?: boolean;

  /**
   * Whether failed repair operations should automatically
   * attempt restoration from the most recent backup.
   *
   * Defaults to true.
   */
  automaticRestoreOnFailure?: boolean;

  /**
   * Whether compatibility operations should write logs.
   *
   * Defaults to true.
   */
  loggingEnabled?: boolean;

  /**
   * Maximum number of backups retained for each game.
   *
   * Defaults to 5.
   */
  maxBackupsPerGame?: number;
}

export class MacCompatibilityConfig {
  readonly rootPath: string;
  readonly automaticBackups: boolean;
  readonly automaticRestoreOnFailure: boolean;
  readonly loggingEnabled: boolean;
  readonly maxBackupsPerGame: number;

  constructor(
    options: MacCompatibilityConfigOptions,
  ) {
    if (!options.rootPath.trim()) {
      throw new Error(
        "Compatibility root path cannot be empty.",
      );
    }

    if (
      options.maxBackupsPerGame !==
        undefined &&
      (!Number.isInteger(
        options.maxBackupsPerGame,
      ) ||
        options.maxBackupsPerGame < 1)
    ) {
      throw new Error(
        "maxBackupsPerGame must be a positive integer.",
      );
    }

    this.rootPath =
      options.rootPath;

    this.automaticBackups =
      options.automaticBackups ??
      true;

    this.automaticRestoreOnFailure =
      options.automaticRestoreOnFailure ??
      true;

    this.loggingEnabled =
      options.loggingEnabled ??
      true;

    this.maxBackupsPerGame =
      options.maxBackupsPerGame ??
      5;
  }

  /**
   * Create a configuration using safe defaults.
   */
  static createDefault(
    rootPath: string,
  ): MacCompatibilityConfig {
    return new MacCompatibilityConfig(
      {
        rootPath,
      },
    );
  }

  /**
   * Return a plain object suitable for persistence.
   */
  toJSON(): MacCompatibilityConfigOptions {
    return {
      rootPath: this.rootPath,
      automaticBackups:
        this.automaticBackups,
      automaticRestoreOnFailure:
        this.automaticRestoreOnFailure,
      loggingEnabled:
        this.loggingEnabled,
      maxBackupsPerGame:
        this.maxBackupsPerGame,
    };
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Defines the global configuration for the Windows
 * Compatibility subsystem.
 *
 * This class manages configuration in memory.
 * Filesystem persistence will be connected separately.
 */

export interface MacCompatibilityGlobalConfig {
  /**
   * Root directory where compatibility data is stored.
   */
  rootPath: string;

  /**
   * Whether automatic diagnostics are enabled.
   */
  automaticDiagnostics: boolean;

  /**
   * Whether Hydra should automatically create backups
   * before compatibility changes.
   */
  automaticBackups: boolean;

  /**
   * Whether compatibility operations should be logged.
   */
  loggingEnabled: boolean;

  /**
   * Maximum number of backups retained per game.
   */
  maxBackupsPerGame: number;
}

export const DEFAULT_MAC_COMPATIBILITY_CONFIG: MacCompatibilityGlobalConfig =
  {
    rootPath: "",
    automaticDiagnostics: true,
    automaticBackups: true,
    loggingEnabled: true,
    maxBackupsPerGame: 10,
  };

export class MacCompatibilityConfig {
  private config: MacCompatibilityGlobalConfig;

  constructor(
    initialConfig: Partial<MacCompatibilityGlobalConfig> = {},
  ) {
    this.config = {
      ...DEFAULT_MAC_COMPATIBILITY_CONFIG,
      ...initialConfig,
    };
  }

  /**
   * Return the complete configuration.
   */
  get(): MacCompatibilityGlobalConfig {
    return {
      ...this.config,
    };
  }

  /**
   * Update one or more configuration values.
   */
  update(
    changes: Partial<MacCompatibilityGlobalConfig>,
  ): void {
    this.config = {
      ...this.config,
      ...changes,
    };
  }

  /**
   * Return the configured compatibility root path.
   */
  getRootPath(): string {
    return this.config.rootPath;
  }

  /**
   * Change the compatibility root path.
   */
  setRootPath(
    rootPath: string,
  ): void {
    this.config.rootPath =
      rootPath;
  }

  /**
   * Determine whether automatic diagnostics are enabled.
   */
  isAutomaticDiagnosticsEnabled(): boolean {
    return (
      this.config.automaticDiagnostics
    );
  }

  /**
   * Enable or disable automatic diagnostics.
   */
  setAutomaticDiagnostics(
    enabled: boolean,
  ): void {
    this.config.automaticDiagnostics =
      enabled;
  }

  /**
   * Determine whether automatic backups are enabled.
   */
  isAutomaticBackupsEnabled(): boolean {
    return (
      this.config.automaticBackups
    );
  }

  /**
   * Enable or disable automatic backups.
   */
  setAutomaticBackups(
    enabled: boolean,
  ): void {
    this.config.automaticBackups =
      enabled;
  }

  /**
   * Determine whether logging is enabled.
   */
  isLoggingEnabled(): boolean {
    return (
      this.config.loggingEnabled
    );
  }

  /**
   * Enable or disable logging.
   */
  setLoggingEnabled(
    enabled: boolean,
  ): void {
    this.config.loggingEnabled =
      enabled;
  }

  /**
   * Return the maximum number of backups retained.
   */
  getMaxBackupsPerGame(): number {
    return (
      this.config.maxBackupsPerGame
    );
  }

  /**
   * Set the maximum number of backups retained.
   */
  setMaxBackupsPerGame(
    count: number,
  ): void {
    if (
      !Number.isInteger(count) ||
      count < 1
    ) {
      throw new Error(
        "maxBackupsPerGame must be a positive integer.",
      );
    }

    this.config.maxBackupsPerGame =
      count;
  }

  /**
   * Restore the default configuration.
   */
  reset(): void {
    this.config = {
      ...DEFAULT_MAC_COMPATIBILITY_CONFIG,
    };
  }
}

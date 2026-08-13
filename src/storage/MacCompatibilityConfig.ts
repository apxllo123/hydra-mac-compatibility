/**
 * Hydra Mac Compatibility
 *
 * Global configuration for the Windows Compatibility system.
 *
 * This file defines configuration values for the compatibility
 * environment without containing game-specific compatibility data.
 *
 * Game-specific settings belong in each game's compatibility profile.
 */

export interface MacCompatibilityConfigOptions {
  /**
   * Root directory used by the compatibility system.
   */
  compatibilityRoot: string;

  /**
   * Whether compatibility logging is enabled.
   */
  loggingEnabled?: boolean;

  /**
   * Minimum logging level.
   */
  logLevel?: "debug" | "info" | "warning" | "error";

  /**
   * Whether automatic backups are enabled before changes.
   */
  automaticBackupsEnabled?: boolean;

  /**
   * Whether automatic repair is allowed.
   *
   * This should remain disabled unless explicitly enabled.
   */
  automaticRepairEnabled?: boolean;

  /**
   * Whether compatibility testing should be performed
   * after important configuration changes.
   */
  testAfterChanges?: boolean;
}

export class MacCompatibilityConfig {
  private readonly compatibilityRoot: string;

  private loggingEnabled: boolean;
  private logLevel: "debug" | "info" | "warning" | "error";
  private automaticBackupsEnabled: boolean;
  private automaticRepairEnabled: boolean;
  private testAfterChanges: boolean;

  constructor(options: MacCompatibilityConfigOptions) {
    if (!options.compatibilityRoot.trim()) {
      throw new Error(
        "Compatibility root path cannot be empty.",
      );
    }

    this.compatibilityRoot = options.compatibilityRoot;

    this.loggingEnabled = options.loggingEnabled ?? true;

    this.logLevel = options.logLevel ?? "info";

    this.automaticBackupsEnabled =
      options.automaticBackupsEnabled ?? true;

    this.automaticRepairEnabled =
      options.automaticRepairEnabled ?? false;

    this.testAfterChanges =
      options.testAfterChanges ?? true;
  }

  /**
   * Return the root compatibility directory.
   */
  getCompatibilityRoot(): string {
    return this.compatibilityRoot;
  }

  /**
   * Check whether logging is enabled.
   */
  isLoggingEnabled(): boolean {
    return this.loggingEnabled;
  }

  /**
   * Enable or disable compatibility logging.
   */
  setLoggingEnabled(enabled: boolean): void {
    this.loggingEnabled = enabled;
  }

  /**
   * Return the configured logging level.
   */
  getLogLevel(): "debug" | "info" | "warning" | "error" {
    return this.logLevel;
  }

  /**
   * Change the logging level.
   */
  setLogLevel(
    level: "debug" | "info" | "warning" | "error",
  ): void {
    this.logLevel = level;
  }

  /**
   * Check whether automatic backups are enabled.
   */
  isAutomaticBackupsEnabled(): boolean {
    return this.automaticBackupsEnabled;
  }

  /**
   * Enable or disable automatic backups.
   */
  setAutomaticBackupsEnabled(enabled: boolean): void {
    this.automaticBackupsEnabled = enabled;
  }

  /**
   * Check whether automatic repair is enabled.
   */
  isAutomaticRepairEnabled(): boolean {
    return this.automaticRepairEnabled;
  }

  /**
   * Enable or disable automatic repair.
   */
  setAutomaticRepairEnabled(enabled: boolean): void {
    this.automaticRepairEnabled = enabled;
  }

  /**
   * Check whether compatibility tests should run after
   * important configuration changes.
   */
  shouldTestAfterChanges(): boolean {
    return this.testAfterChanges;
  }

  /**
   * Enable or disable automatic post-change testing.
   */
  setTestAfterChanges(enabled: boolean): void {
    this.testAfterChanges = enabled;
  }

  /**
   * Return a serializable representation of the configuration.
   *
   * This is intentionally limited to global configuration.
   * Game profiles are stored separately.
   */
  toJSON(): Record<string, unknown> {
    return {
      compatibilityRoot: this.compatibilityRoot,
      loggingEnabled: this.loggingEnabled,
      logLevel: this.logLevel,
      automaticBackupsEnabled:
        this.automaticBackupsEnabled,
      automaticRepairEnabled:
        this.automaticRepairEnabled,
      testAfterChanges: this.testAfterChanges,
    };
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Global configuration for the macOS compatibility subsystem.
 *
 * This contains settings that apply to the compatibility system
 * as a whole. Per-game settings belong to MacGameCompatibilityProfile.
 */

export interface MacCompatibilityConfig {
  /**
   * Root directory containing Hydra compatibility data.
   */
  rootPath: string;

  /**
   * Whether automatic compatibility diagnostics are enabled.
   */
  automaticDiagnostics: boolean;

  /**
   * Whether Hydra should automatically check for missing
   * dependencies.
   */
  automaticDependencyDetection: boolean;

  /**
   * Whether Hydra should create a backup before repair operations.
   */
  automaticBackups: boolean;

  /**
   * Whether Hydra should test a configuration after repair.
   */
  testAfterRepair: boolean;

  /**
   * Maximum number of compatibility backups to retain per game.
   */
  maximumBackupsPerGame: number;

  /**
   * Whether diagnostic logs should be retained.
   */
  retainDiagnosticLogs: boolean;
}

export const DEFAULT_MAC_COMPATIBILITY_CONFIG: MacCompatibilityConfig =
  {
    rootPath: "",
    automaticDiagnostics: true,
    automaticDependencyDetection: true,
    automaticBackups: true,
    testAfterRepair: true,
    maximumBackupsPerGame: 10,
    retainDiagnosticLogs: true,
  };

export class MacCompatibilityConfigManager {
  private config: MacCompatibilityConfig;

  constructor(
    config: Partial<MacCompatibilityConfig> = {},
  ) {
    this.config =
      this.mergeWithDefaults(
        config,
      );
  }

  /**
   * Return the complete configuration.
   */
  get(): MacCompatibilityConfig {
    return {
      ...this.config,
    };
  }

  /**
   * Replace the configuration.
   */
  set(
    config: MacCompatibilityConfig,
  ): void {
    this.config =
      this.normalize(config);
  }

  /**
   * Update selected configuration values.
   */
  update(
    updates: Partial<MacCompatibilityConfig>,
  ): void {
    this.config =
      this.mergeWithDefaults({
        ...this.config,
        ...updates,
      });
  }

  /**
   * Return the configured compatibility root.
   */
  getRootPath(): string {
    return this.config.rootPath;
  }

  /**
   * Set the compatibility root.
   */
  setRootPath(
    rootPath: string,
  ): void {
    this.config.rootPath =
      rootPath.trim();
  }

  /**
   * Determine whether automatic diagnostics are enabled.
   */
  areAutomaticDiagnosticsEnabled(): boolean {
    return this.config
      .automaticDiagnostics;
  }

  /**
   * Determine whether automatic dependency detection is enabled.
   */
  isAutomaticDependencyDetectionEnabled(): boolean {
    return this.config
      .automaticDependencyDetection;
  }

  /**
   * Determine whether automatic backups are enabled.
   */
  areAutomaticBackupsEnabled(): boolean {
    return this.config
      .automaticBackups;
  }

  /**
   * Determine whether post-repair testing is enabled.
   */
  shouldTestAfterRepair(): boolean {
    return this.config
      .testAfterRepair;
  }

  /**
   * Return the maximum number of backups per game.
   */
  getMaximumBackupsPerGame(): number {
    return this.config
      .maximumBackupsPerGame;
  }

  /**
   * Determine whether diagnostic logs should be retained.
   */
  shouldRetainDiagnosticLogs(): boolean {
    return this.config
      .retainDiagnosticLogs;
  }

  /**
   * Restore the default configuration.
   */
  reset(): void {
    this.config =
      this.mergeWithDefaults({});
  }

  /**
   * Merge partial configuration with defaults.
   */
  private mergeWithDefaults(
    config: Partial<MacCompatibilityConfig>,
  ): MacCompatibilityConfig {
    return this.normalize({
      ...DEFAULT_MAC_COMPATIBILITY_CONFIG,
      ...config,
    });
  }

  /**
   * Normalize configuration values.
   */
  private normalize(
    config: MacCompatibilityConfig,
  ): MacCompatibilityConfig {
    const maximumBackups =
      Number.isFinite(
        config.maximumBackupsPerGame,
      )
        ? Math.max(
            0,
            Math.floor(
              config.maximumBackupsPerGame,
            ),
          )
        : DEFAULT_MAC_COMPATIBILITY_CONFIG
            .maximumBackupsPerGame;

    return {
      rootPath:
        config.rootPath.trim(),

      automaticDiagnostics:
        Boolean(
          config.automaticDiagnostics,
        ),

      automaticDependencyDetection:
        Boolean(
          config.automaticDependencyDetection,
        ),

      automaticBackups:
        Boolean(
          config.automaticBackups,
        ),

      testAfterRepair:
        Boolean(
          config.testAfterRepair,
        ),

      maximumBackupsPerGame:
        maximumBackups,

      retainDiagnosticLogs:
        Boolean(
          config.retainDiagnosticLogs,
        ),
    };
  }
}

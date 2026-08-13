/**
 * Hydra Mac Compatibility
 *
 * Configuration for the Windows Compatibility system.
 *
 * This file defines system-wide compatibility preferences.
 * Game-specific settings belong in the individual game profile.
 */

import type { GraphicsBackend } from "../manager/MacCompatibilityTypes";

export interface MacCompatibilityConfigOptions {
  /**
   * Root directory used for compatibility data.
   */
  rootPath: string;

  /**
   * Preferred graphics backend.
   */
  defaultGraphicsBackend?: GraphicsBackend;

  /**
   * Whether DXVK should be enabled by default.
   */
  defaultDxvkEnabled?: boolean;

  /**
   * Whether VKD3D should be enabled by default.
   */
  defaultVkd3dEnabled?: boolean;

  /**
   * Whether automatic diagnostics are enabled.
   */
  automaticDiagnostics?: boolean;

  /**
   * Whether Hydra should automatically save known-good
   * configurations after successful tests.
   */
  automaticBackups?: boolean;

  /**
   * Maximum number of game configuration backups
   * retained per game.
   */
  maximumBackupsPerGame?: number;
}

/**
 * System-wide configuration for Hydra Mac Compatibility.
 */
export interface MacCompatibilityConfigData {
  rootPath: string;

  defaultGraphicsBackend: GraphicsBackend;

  defaultDxvkEnabled: boolean;

  defaultVkd3dEnabled: boolean;

  automaticDiagnostics: boolean;

  automaticBackups: boolean;

  maximumBackupsPerGame: number;
}

const DEFAULT_CONFIG: Omit<
  MacCompatibilityConfigData,
  "rootPath"
> = {
  defaultGraphicsBackend: "auto",
  defaultDxvkEnabled: true,
  defaultVkd3dEnabled: true,
  automaticDiagnostics: true,
  automaticBackups: true,
  maximumBackupsPerGame: 5,
};

/**
 * Stores and manages compatibility configuration.
 *
 * This class currently manages configuration in memory.
 * Persistent configuration storage will be added later.
 */
export class MacCompatibilityConfig {
  private config: MacCompatibilityConfigData;

  constructor(options: MacCompatibilityConfigOptions) {
    this.config = {
      rootPath: options.rootPath,

      defaultGraphicsBackend:
        options.defaultGraphicsBackend ??
        DEFAULT_CONFIG.defaultGraphicsBackend,

      defaultDxvkEnabled:
        options.defaultDxvkEnabled ??
        DEFAULT_CONFIG.defaultDxvkEnabled,

      defaultVkd3dEnabled:
        options.defaultVkd3dEnabled ??
        DEFAULT_CONFIG.defaultVkd3dEnabled,

      automaticDiagnostics:
        options.automaticDiagnostics ??
        DEFAULT_CONFIG.automaticDiagnostics,

      automaticBackups:
        options.automaticBackups ??
        DEFAULT_CONFIG.automaticBackups,

      maximumBackupsPerGame:
        options.maximumBackupsPerGame ??
        DEFAULT_CONFIG.maximumBackupsPerGame,
    };
  }

  /**
   * Return the complete configuration.
   */
  get(): MacCompatibilityConfigData {
    return { ...this.config };
  }

  /**
   * Get the compatibility data root path.
   */
  getRootPath(): string {
    return this.config.rootPath;
  }

  /**
   * Get the default graphics backend.
   */
  getDefaultGraphicsBackend(): GraphicsBackend {
    return this.config.defaultGraphicsBackend;
  }

  /**
   * Check whether DXVK is enabled by default.
   */
  isDxvkEnabledByDefault(): boolean {
    return this.config.defaultDxvkEnabled;
  }

  /**
   * Check whether VKD3D is enabled by default.
   */
  isVkd3dEnabledByDefault(): boolean {
    return this.config.defaultVkd3dEnabled;
  }

  /**
   * Check whether automatic diagnostics are enabled.
   */
  areAutomaticDiagnosticsEnabled(): boolean {
    return this.config.automaticDiagnostics;
  }

  /**
   * Check whether automatic backups are enabled.
   */
  areAutomaticBackupsEnabled(): boolean {
    return this.config.automaticBackups;
  }

  /**
   * Get the maximum number of backups retained per game.
   */
  getMaximumBackupsPerGame(): number {
    return this.config.maximumBackupsPerGame;
  }

  /**
   * Update configuration values.
   *
   * Only supplied properties are changed.
   */
  update(
    options: Partial<MacCompatibilityConfigOptions>,
  ): void {
    if (options.rootPath !== undefined) {
      this.config.rootPath = options.rootPath;
    }

    if (options.defaultGraphicsBackend !== undefined) {
      this.config.defaultGraphicsBackend =
        options.defaultGraphicsBackend;
    }

    if (options.defaultDxvkEnabled !== undefined) {
      this.config.defaultDxvkEnabled =
        options.defaultDxvkEnabled;
    }

    if (options.defaultVkd3dEnabled !== undefined) {
      this.config.defaultVkd3dEnabled =
        options.defaultVkd3dEnabled;
    }

    if (options.automaticDiagnostics !== undefined) {
      this.config.automaticDiagnostics =
        options.automaticDiagnostics;
    }

    if (options.automaticBackups !== undefined) {
      this.config.automaticBackups =
        options.automaticBackups;
    }

    if (options.maximumBackupsPerGame !== undefined) {
      this.config.maximumBackupsPerGame =
        options.maximumBackupsPerGame;
    }
  }

  /**
   * Restore all configurable values to their defaults.
   *
   * The root path is intentionally preserved.
   */
  resetToDefaults(): void {
    this.config = {
      rootPath: this.config.rootPath,
      ...DEFAULT_CONFIG,
    };
  }
}

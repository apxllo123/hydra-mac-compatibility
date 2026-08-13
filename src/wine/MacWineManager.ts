/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for Wine-related compatibility operations.
 *
 * This class does not implement low-level Wine detection or
 * version management itself. Those responsibilities belong to:
 *
 * - MacWineDetector
 * - MacWineVersionManager
 *
 * MacWineManager coordinates those systems and provides a
 * clean interface for the rest of the compatibility system.
 */

import {
  MacWineConfiguration,
  MacWineInstallation,
  MacWineVersion,
} from "../manager/MacCompatibilityTypes";

import { MacWineDetector } from "./MacWineDetector";
import { MacWineVersionManager } from "./MacWineVersionManager";

export class MacWineManager {
  private readonly detector: MacWineDetector;
  private readonly versionManager: MacWineVersionManager;

  constructor(
    detector: MacWineDetector = new MacWineDetector(),
    versionManager: MacWineVersionManager = new MacWineVersionManager(),
  ) {
    this.detector = detector;
    this.versionManager = versionManager;
  }

  /**
   * Detect Wine installations available on the Mac.
   */
  detectInstallations(): MacWineInstallation[] {
    return this.detector.detect();
  }

  /**
   * Check whether Wine is available.
   */
  isWineAvailable(): boolean {
    return this.detector.isWineAvailable();
  }

  /**
   * Return all known Wine versions.
   */
  getAvailableVersions(): MacWineVersion[] {
    return this.versionManager.getAvailableVersions();
  }

  /**
   * Return the currently selected Wine version.
   */
  getSelectedVersion(): MacWineVersion | undefined {
    return this.versionManager.getSelectedVersion();
  }

  /**
   * Select a Wine version for compatibility operations.
   */
  selectVersion(versionId: string): MacWineVersion {
    return this.versionManager.selectVersion(versionId);
  }

  /**
   * Clear the currently selected Wine version.
   */
  clearSelectedVersion(): void {
    this.versionManager.clearSelectedVersion();
  }

  /**
   * Validate a Wine configuration.
   */
  validateConfiguration(
    configuration: MacWineConfiguration,
  ): boolean {
    if (!configuration.version) {
      return false;
    }

    if (!configuration.prefixPath) {
      return false;
    }

    return true;
  }

  /**
   * Create a basic Wine configuration for a game.
   *
   * This does not create the prefix on disk.
   * Actual prefix creation belongs to the Wine execution layer.
   */
  createConfiguration(
    version: MacWineVersion,
    prefixPath: string,
  ): MacWineConfiguration {
    return {
      version,
      prefixPath,
    };
  }

  /**
   * Check whether a Wine version can be used.
   */
  canUseVersion(versionId: string): boolean {
    return this.versionManager.hasVersion(versionId);
  }

  /**
   * Refresh detected Wine installations.
   */
  refresh(): MacWineInstallation[] {
    return this.detector.detect();
  }
}

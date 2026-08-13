/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for Wine compatibility on macOS.
 *
 * The manager coordinates Wine detection and version selection.
 * It does not contain platform-specific detection logic itself.
 */

import {
  MacGameCompatibilityProfile,
  MacWineInstallation,
} from "../manager/MacCompatibilityTypes";

import { MacWineDetector } from "./MacWineDetector";
import { MacWineVersionManager } from "./MacWineVersionManager";

export class MacWineManager {
  private readonly detector: MacWineDetector;
  private readonly versionManager: MacWineVersionManager;

  constructor(
    detector = new MacWineDetector(),
    versionManager = new MacWineVersionManager(),
  ) {
    this.detector = detector;
    this.versionManager = versionManager;
  }

  /**
   * Detect Wine installations available to Hydra.
   */
  detectInstallations(): MacWineInstallation[] {
    return this.detector.detect();
  }

  /**
   * Return Wine installations that are currently usable.
   */
  getUsableInstallations(): MacWineInstallation[] {
    return this.detector.getUsable(
      this.detectInstallations(),
    );
  }

  /**
   * Find a Wine installation by ID.
   */
  findById(
    wineId: string,
  ): MacWineInstallation | undefined {
    return this.detector.findById(
      this.detectInstallations(),
      wineId,
    );
  }

  /**
   * Find a Wine installation by version.
   */
  findByVersion(
    version: string,
  ): MacWineInstallation | undefined {
    return this.detector.findByVersion(
      this.detectInstallations(),
      version,
    );
  }

  /**
   * Select a Wine installation for a game.
   *
   * The game's requested Wine version is preferred when it
   * is available and working.
   */
  selectForGame(
    profile: MacGameCompatibilityProfile,
  ): MacWineInstallation | undefined {
    const installations =
      this.detectInstallations();

    return this.versionManager.selectVersion(
      installations,
      profile.wine?.version,
    );
  }

  /**
   * Determine whether the Wine version recorded by a game
   * is currently available.
   */
  isGameWineAvailable(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    const version =
      profile.wine?.version;

    if (!version) {
      return false;
    }

    return this.versionManager.isVersionAvailable(
      this.detectInstallations(),
      version,
    );
  }

  /**
   * Return Wine versions available for selection.
   */
  getAvailableVersions(): MacWineInstallation[] {
    return this.versionManager.getAvailableVersions(
      this.detectInstallations(),
    );
  }
}

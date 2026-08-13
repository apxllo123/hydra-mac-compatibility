/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for Wine operations on macOS.
 *
 * The manager coordinates Wine detection, version selection,
 * and per-game Wine configuration. Low-level process and
 * filesystem operations will be connected later.
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
    this.versionManager =
      versionManager;
  }

  /**
   * Detect available Wine installations and register them.
   */
  detectAndRegister(): MacWineInstallation[] {
    const installations =
      this.detector.detect();

    for (const installation of installations) {
      this.versionManager.register(
        installation,
      );
    }

    return installations;
  }

  /**
   * Return all Wine installations known to Hydra.
   */
  getInstallations(): MacWineInstallation[] {
    return this.versionManager.getAll();
  }

  /**
   * Return Wine installations currently available.
   */
  getAvailableInstallations(): MacWineInstallation[] {
    return this.versionManager.getAvailable();
  }

  /**
   * Select a Wine installation for a game.
   */
  selectWineForGame(
    profile: MacGameCompatibilityProfile,
    wineId: string,
  ): boolean {
    return this.versionManager.selectForGame(
      profile,
      wineId,
    );
  }

  /**
   * Return the Wine installation selected for a game.
   */
  getGameWine(
    profile: MacGameCompatibilityProfile,
  ): MacWineInstallation | undefined {
    return this.versionManager.getSelectedForGame(
      profile,
    );
  }

  /**
   * Determine whether the selected Wine installation
   * is still available.
   */
  isGameWineAvailable(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.versionManager.isGameWineAvailable(
      profile,
    );
  }

  /**
   * Determine whether Wine is available at all.
   */
  hasAvailableWine(): boolean {
    return (
      this.getAvailableInstallations()
        .length > 0
    );
  }

  /**
   * Get the detector used by this manager.
   */
  getDetector(): MacWineDetector {
    return this.detector;
  }

  /**
   * Get the version manager used by this manager.
   */
  getVersionManager(): MacWineVersionManager {
    return this.versionManager;
  }

  /**
   * Clear the in-memory Wine registry.
   *
   * This does not uninstall Wine.
   */
  clear(): void {
    this.versionManager.clear();
  }
}

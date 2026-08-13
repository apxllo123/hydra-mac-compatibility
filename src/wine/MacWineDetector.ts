/**
 * Hydra Mac Compatibility
 *
 * Detects Wine installations available on macOS.
 *
 * Detection is read-only. This class does not install,
 * remove, or modify Wine.
 */

import {
  MacWineInstallation,
} from "../manager/MacCompatibilityTypes";

export class MacWineDetector {
  /**
   * Detect Wine installations available to Hydra.
   *
   * The actual macOS filesystem/process detection will be
   * connected when the Wine runtime layer is implemented.
   */
  detect(): MacWineInstallation[] {
    return [];
  }

  /**
   * Find a Wine installation by its stable identifier.
   */
  findById(
    installations: MacWineInstallation[],
    wineId: string,
  ): MacWineInstallation | undefined {
    return installations.find(
      (installation) =>
        installation.id === wineId,
    );
  }

  /**
   * Find a Wine installation by version.
   */
  findByVersion(
    installations: MacWineInstallation[],
    version: string,
  ): MacWineInstallation | undefined {
    const normalizedVersion =
      version.trim().toLowerCase();

    return installations.find(
      (installation) =>
        installation.version
          .trim()
          .toLowerCase() ===
        normalizedVersion,
    );
  }

  /**
   * Determine whether a Wine installation is usable.
   */
  isUsable(
    installation: MacWineInstallation,
  ): boolean {
    return (
      installation.available &&
      installation.executablePath.trim()
        .length > 0
    );
  }

  /**
   * Return only usable Wine installations.
   */
  getUsable(
    installations: MacWineInstallation[],
  ): MacWineInstallation[] {
    return installations.filter(
      (installation) =>
        this.isUsable(installation),
    );
  }
}

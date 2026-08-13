/**
 * Hydra Mac Compatibility
 *
 * Detects Wine installations available to Hydra on macOS.
 *
 * Detection is read-only.
 * It does not install, remove, or modify Wine.
 */

import {
  MacWineInstallation,
} from "../manager/MacCompatibilityTypes";

export class MacWineDetector {
  /**
   * Detect available Wine installations.
   *
   * Real macOS filesystem/process detection will be connected
   * during Hydra integration.
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
    return installations.find(
      (installation) =>
        installation.version === version,
    );
  }

  /**
   * Determine whether a specific Wine version exists.
   */
  hasVersion(
    installations: MacWineInstallation[],
    version: string,
  ): boolean {
    return installations.some(
      (installation) =>
        installation.version === version,
    );
  }

  /**
   * Return Wine installations that are currently marked
   * as usable.
   */
  getUsable(
    installations: MacWineInstallation[],
  ): MacWineInstallation[] {
    return installations.filter(
      (installation) =>
        installation.available &&
        installation.working,
    );
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Selects and manages Wine versions for individual games.
 *
 * The version manager does not install Wine itself.
 * Installation and discovery belong to the Wine subsystem.
 */

import {
  MacWineInstallation,
} from "../manager/MacCompatibilityTypes";

export class MacWineVersionManager {
  /**
   * Select the best available Wine version for a game.
   *
   * For now, selection is deterministic:
   * 1. Prefer the requested version when available.
   * 2. Otherwise prefer a working/available version.
   * 3. Otherwise return undefined.
   */
  selectVersion(
    installations: MacWineInstallation[],
    requestedVersion?: string,
  ): MacWineInstallation | undefined {
    if (
      requestedVersion
    ) {
      const requested =
        installations.find(
          (installation) =>
            installation.version ===
              requestedVersion &&
            installation.available &&
            installation.working,
        );

      if (requested) {
        return requested;
      }
    }

    return installations.find(
      (installation) =>
        installation.available &&
        installation.working,
    );
  }

  /**
   * Find a specific Wine version.
   */
  findVersion(
    installations: MacWineInstallation[],
    version: string,
  ): MacWineInstallation | undefined {
    return installations.find(
      (installation) =>
        installation.version === version,
    );
  }

  /**
   * Return only Wine versions that can currently be used.
   */
  getAvailableVersions(
    installations: MacWineInstallation[],
  ): MacWineInstallation[] {
    return installations.filter(
      (installation) =>
        installation.available &&
        installation.working,
    );
  }

  /**
   * Determine whether a requested Wine version can be used.
   */
  isVersionAvailable(
    installations: MacWineInstallation[],
    version: string,
  ): boolean {
    return installations.some(
      (installation) =>
        installation.version === version &&
        installation.available &&
        installation.working,
    );
  }
}

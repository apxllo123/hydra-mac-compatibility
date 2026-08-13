/**
 * Hydra Mac Compatibility
 *
 * Manages available Wine versions and per-game Wine selection.
 *
 * This class manages configuration only. It does not install
 * or remove Wine versions.
 */

import {
  MacGameCompatibilityProfile,
  MacWineInstallation,
} from "../manager/MacCompatibilityTypes";

export class MacWineVersionManager {
  private readonly installations = new Map<
    string,
    MacWineInstallation
  >();

  /**
   * Register a detected Wine installation.
   */
  register(
    installation: MacWineInstallation,
  ): void {
    this.installations.set(
      installation.id,
      {
        ...installation,
      },
    );
  }

  /**
   * Remove a Wine installation from the registry.
   *
   * This does not uninstall Wine from the Mac.
   */
  unregister(
    wineId: string,
  ): boolean {
    return this.installations.delete(
      wineId,
    );
  }

  /**
   * Return every known Wine installation.
   */
  getAll(): MacWineInstallation[] {
    return Array.from(
      this.installations.values(),
    ).map(
      (installation) => ({
        ...installation,
      }),
    );
  }

  /**
   * Return only currently available Wine versions.
   */
  getAvailable(): MacWineInstallation[] {
    return this.getAll().filter(
      (installation) =>
        installation.available,
    );
  }

  /**
   * Retrieve a Wine installation by ID.
   */
  get(
    wineId: string,
  ): MacWineInstallation | undefined {
    const installation =
      this.installations.get(
        wineId,
      );

    return installation
      ? {
          ...installation,
        }
      : undefined;
  }

  /**
   * Select a Wine version for a specific game.
   *
   * This updates the game's in-memory profile.
   * Persistence is handled by storage.
   */
  selectForGame(
    profile: MacGameCompatibilityProfile,
    wineId: string,
  ): boolean {
    const installation =
      this.installations.get(
        wineId,
      );

    if (
      !installation ||
      !installation.available
    ) {
      return false;
    }

    profile.wine = {
      ...profile.wine,
      id: installation.id,
      version:
        installation.version,
      executablePath:
        installation.executablePath,
    };

    return true;
  }

  /**
   * Find the Wine installation currently assigned
   * to a game.
   */
  getSelectedForGame(
    profile: MacGameCompatibilityProfile,
  ): MacWineInstallation | undefined {
    if (!profile.wine?.id) {
      return undefined;
    }

    return this.get(
      profile.wine.id,
    );
  }

  /**
   * Determine whether a game's selected Wine version
   * is still available.
   */
  isGameWineAvailable(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    const selected =
      this.getSelectedForGame(
        profile,
      );

    return Boolean(
      selected?.available,
    );
  }

  /**
   * Clear the in-memory Wine registry.
   *
   * This does not uninstall anything.
   */
  clear(): void {
    this.installations.clear();
  }
}

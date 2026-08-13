/**
 * Hydra Mac Compatibility
 *
 * Manages available and preferred Wine versions.
 *
 * This class intentionally does not install or remove Wine yet.
 * Installation belongs to a future Wine installation layer.
 */

import {
  MacWineManager,
} from "./MacWineManager";

import {
  WineInstallation,
} from "./MacWineDetector";

export interface WineVersionInfo {
  version: string;
  executablePath: string;
  source: WineInstallation["source"];
}

export interface WineVersionSelection {
  /**
   * Game-specific Wine version preference.
   */
  preferredVersion?: string;

  /**
   * Whether to allow falling back to another installed version.
   */
  allowFallback?: boolean;
}

export class MacWineVersionManager {
  private readonly wineManager: MacWineManager;

  private preferredVersion?: string;

  constructor(
    wineManager: MacWineManager,
  ) {
    this.wineManager =
      wineManager;
  }

  /**
   * Return all detected Wine versions.
   */
  getAvailableVersions(): WineVersionInfo[] {
    return this.wineManager
      .getInstallations()
      .filter(
        (
          installation,
        ): installation is WineInstallation & {
          version: string;
        } =>
          typeof installation.version ===
            "string" &&
          installation.version.length > 0,
      )
      .map(
        (installation) => ({
          version:
            installation.version,
          executablePath:
            installation.executablePath,
          source:
            installation.source,
        }),
      );
  }

  /**
   * Set the preferred Wine version.
   */
  setPreferredVersion(
    version: string,
  ): void {
    const available =
      this.getAvailableVersions();

    const matchingVersion =
      available.find(
        (wine) =>
          wine.version ===
          version,
      );

    if (!matchingVersion) {
      throw new Error(
        `Wine version "${version}" is not currently available.`,
      );
    }

    this.preferredVersion =
      version;
  }

  /**
   * Clear the preferred Wine version.
   */
  clearPreferredVersion(): void {
    this.preferredVersion =
      undefined;
  }

  /**
   * Return the preferred Wine version.
   */
  getPreferredVersion():
    | string
    | undefined {
    return this.preferredVersion;
  }

  /**
   * Select the best available Wine version
   * according to the supplied preferences.
   */
  selectVersion(
    options: WineVersionSelection = {},
  ): WineVersionInfo {
    const available =
      this.getAvailableVersions();

    if (available.length === 0) {
      throw new Error(
        "No Wine versions are currently available.",
      );
    }

    /*
     * 1. Explicit game-specific preference.
     */
    if (options.preferredVersion) {
      const requested =
        available.find(
          (wine) =>
            wine.version ===
            options.preferredVersion,
        );

      if (requested) {
        return requested;
      }

      if (
        options.allowFallback ===
        false
      ) {
        throw new Error(
          `Requested Wine version "${options.preferredVersion}" is not available.`,
        );
      }
    }

    /*
     * 2. Global preferred version.
     */
    if (this.preferredVersion) {
      const preferred =
        available.find(
          (wine) =>
            wine.version ===
            this.preferredVersion,
        );

      if (preferred) {
        return preferred;
      }
    }

    /*
     * 3. Fall back to the Wine manager's
     * currently selected installation.
     */
    const selected =
      this.wineManager.getSelectedWine();

    if (selected?.version) {
      const matching =
        available.find(
          (wine) =>
            wine.executablePath ===
            selected.executablePath,
        );

      if (matching) {
        return matching;
      }
    }

    /*
     * 4. Final fallback:
     * first detected version.
     */
    return available[0];
  }

  /**
   * Determine whether a specific Wine version
   * is available.
   */
  isVersionAvailable(
    version: string,
  ): boolean {
    return this.getAvailableVersions().some(
      (wine) =>
        wine.version ===
        version,
    );
  }

  /**
   * Refresh Wine detection before working with versions.
   */
  async refresh(): Promise<WineVersionInfo[]> {
    await this.wineManager.refresh();

    return this.getAvailableVersions();
  }
}

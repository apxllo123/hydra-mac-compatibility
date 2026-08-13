/**
 * Hydra Mac Compatibility
 *
 * Manages Wine versions available to the compatibility system.
 *
 * This class is responsible for:
 * - Tracking discovered Wine versions
 * - Selecting a Wine version
 * - Looking up versions
 * - Removing versions from the in-memory catalog
 *
 * It does NOT install or uninstall Wine.
 * Actual installation will be handled separately.
 */

import {
  MacWineVersion,
} from "../manager/MacCompatibilityTypes";

export class MacWineVersionManager {
  private readonly versions = new Map<
    string,
    MacWineVersion
  >();

  private selectedVersionId?: string;

  /**
   * Register a discovered Wine version.
   *
   * Existing versions with the same ID are replaced.
   */
  registerVersion(
    version: MacWineVersion,
  ): void {
    this.versions.set(
      version.id,
      version,
    );
  }

  /**
   * Register multiple Wine versions.
   */
  registerVersions(
    versions: MacWineVersion[],
  ): void {
    for (const version of versions) {
      this.registerVersion(version);
    }
  }

  /**
   * Get a Wine version by its stable ID.
   */
  getVersion(
    versionId: string,
  ): MacWineVersion | undefined {
    return this.versions.get(versionId);
  }

  /**
   * Check whether a Wine version exists.
   */
  hasVersion(
    versionId: string,
  ): boolean {
    return this.versions.has(versionId);
  }

  /**
   * Return every known Wine version.
   */
  getAvailableVersions(): MacWineVersion[] {
    return Array.from(
      this.versions.values(),
    );
  }

  /**
   * Select a Wine version.
   */
  selectVersion(
    versionId: string,
  ): MacWineVersion {
    const version =
      this.versions.get(versionId);

    if (!version) {
      throw new Error(
        `Wine version "${versionId}" is not available.`,
      );
    }

    this.selectedVersionId =
      versionId;

    return version;
  }

  /**
   * Return the currently selected Wine version.
   */
  getSelectedVersion():
    | MacWineVersion
    | undefined {
    if (!this.selectedVersionId) {
      return undefined;
    }

    return this.versions.get(
      this.selectedVersionId,
    );
  }

  /**
   * Return the ID of the selected Wine version.
   */
  getSelectedVersionId():
    | string
    | undefined {
    return this.selectedVersionId;
  }

  /**
   * Clear the selected Wine version.
   */
  clearSelectedVersion(): void {
    this.selectedVersionId =
      undefined;
  }

  /**
   * Remove a Wine version from the catalog.
   *
   * This does NOT uninstall Wine from the Mac.
   */
  removeVersion(
    versionId: string,
  ): boolean {
    const removed =
      this.versions.delete(
        versionId,
      );

    if (
      this.selectedVersionId ===
      versionId
    ) {
      this.clearSelectedVersion();
    }

    return removed;
  }

  /**
   * Remove every known Wine version.
   *
   * This only clears the in-memory catalog.
   * It does NOT uninstall anything.
   */
  clear(): void {
    this.versions.clear();
    this.clearSelectedVersion();
  }

  /**
   * Return the number of known Wine versions.
   */
  count(): number {
    return this.versions.size;
  }
}

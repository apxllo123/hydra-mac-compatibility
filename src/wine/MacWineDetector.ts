/**
 * Hydra Mac Compatibility
 *
 * Detects Wine installations available on macOS.
 *
 * IMPORTANT:
 * This class is intentionally conservative.
 *
 * Detection identifies Wine installations that already exist.
 * It does not install Wine, modify Wine installations,
 * or create game prefixes.
 *
 * Installation and environment setup will be handled by
 * separate systems later.
 */

import {
  MacWineInstallation,
} from "../manager/MacCompatibilityTypes";

export class MacWineDetector {
  /**
   * Detect Wine installations available on the system.
   *
   * The actual macOS filesystem/process detection will be
   * connected during Hydra integration.
   *
   * Returning an empty array is intentional for now rather
   * than pretending that Wine exists.
   */
  detect(): MacWineInstallation[] {
    return [];
  }

  /**
   * Check whether at least one Wine installation is available.
   */
  isWineAvailable(): boolean {
    return this.detect().length > 0;
  }

  /**
   * Find a Wine installation by its stable identifier.
   */
  findById(
    installationId: string,
  ): MacWineInstallation | undefined {
    return this.detect().find(
      (installation) =>
        installation.id === installationId,
    );
  }

  /**
   * Find Wine installations matching a version.
   */
  findByVersion(
    version: string,
  ): MacWineInstallation[] {
    return this.detect().filter(
      (installation) =>
        installation.version === version,
    );
  }

  /**
   * Return the first available Wine installation.
   */
  getDefaultInstallation():
    | MacWineInstallation
    | undefined {
    return this.detect()[0];
  }
}

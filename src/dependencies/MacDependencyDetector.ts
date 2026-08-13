/**
 * Hydra Mac Compatibility
 *
 * Detects Windows dependencies required by a game and
 * determines which dependencies are already available.
 *
 * Detection is read-only.
 * Installation is handled separately by
 * MacDependencyInstaller.
 */

import {
  MacDependency,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacDependencyDetector {
  /**
   * Detect dependencies currently recorded for a game.
   *
   * Real system-level dependency detection will be connected
   * during macOS/Wine integration.
   */
  detect(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    if (!profile.dependencies) {
      return [];
    }

    return profile.dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
  }

  /**
   * Determine whether a specific dependency is recorded
   * as installed.
   */
  isInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    return this.detect(profile).some(
      (dependency) =>
        dependency.name
          .trim()
          .toLowerCase() ===
        dependencyName
          .trim()
          .toLowerCase() &&
        dependency.installed === true,
    );
  }

  /**
   * Return dependencies that are currently missing.
   */
  getMissing(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detect(profile).filter(
      (dependency) =>
        !dependency.installed,
    );
  }

  /**
   * Return dependencies that are installed.
   */
  getInstalled(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detect(profile).filter(
      (dependency) =>
        dependency.installed,
    );
  }

  /**
   * Determine whether all recorded dependencies
   * are currently available.
   */
  areAllInstalled(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.getMissing(
      profile,
    ).length === 0;
  }
}

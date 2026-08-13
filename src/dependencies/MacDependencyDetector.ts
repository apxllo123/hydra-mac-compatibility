/**
 * Hydra Mac Compatibility
 *
 * Detects the dependency state for Windows games.
 *
 * Detection is read-only. It does not install, remove,
 * or modify dependencies.
 */

import {
  MacDependency,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacDependencyDetector {
  /**
   * Return all dependencies recorded for a game.
   */
  detect(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return (profile.dependencies ?? []).map(
      (dependency) => ({
        ...dependency,
      }),
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
        dependency.required &&
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
   * Determine whether every required dependency is installed.
   */
  areAllInstalled(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.getMissing(
      profile,
    ).length === 0;
  }

  /**
   * Find a dependency by name.
   */
  findByName(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): MacDependency | undefined {
    const normalizedName =
      dependencyName
        .trim()
        .toLowerCase();

    return this.detect(profile).find(
      (dependency) =>
        dependency.name
          .trim()
          .toLowerCase() ===
        normalizedName,
    );
  }

  /**
   * Determine whether a dependency is installed.
   */
  isInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    const dependency =
      this.findByName(
        profile,
        dependencyName,
      );

    return (
      dependency?.installed ??
      false
    );
  }
}

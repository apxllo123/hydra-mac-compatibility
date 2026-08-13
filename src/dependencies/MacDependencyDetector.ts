/**
 * Hydra Mac Compatibility
 *
 * Detects Windows compatibility dependencies required by games.
 *
 * This class is responsible for detection only.
 * It does not install, remove, or modify dependencies.
 */

import {
  MacGameCompatibilityProfile,
  MacDependency,
} from "../manager/MacCompatibilityTypes";

export interface MacDependencyDetectionResult {
  dependency: MacDependency;
  installed: boolean;
  supported: boolean;
  details?: string;
}

export class MacDependencyDetector {
  /**
   * Detect the dependencies currently associated with a game.
   *
   * Actual runtime detection will be connected to Wine/prefix
   * inspection later.
   */
  async detect(
    profile: MacGameCompatibilityProfile,
  ): Promise<MacDependencyDetectionResult[]> {
    const dependencies =
      profile.dependencies ?? [];

    return dependencies.map(
      (dependency) => ({
        dependency,
        installed:
          dependency.installed,
        supported: true,
        details:
          dependency.installed
            ? "Dependency is recorded as installed."
            : "Dependency is recorded as missing.",
      }),
    );
  }

  /**
   * Determine whether a specific dependency is installed
   * according to the compatibility profile.
   */
  isInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    const dependency =
      (
        profile.dependencies ?? []
      ).find(
        (item) =>
          item.id ===
          dependencyId,
      );

    return (
      dependency?.installed ===
      true
    );
  }

  /**
   * Find dependencies that are currently missing.
   */
  findMissing(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return (
      profile.dependencies ?? []
    ).filter(
      (dependency) =>
        !dependency.installed,
    );
  }

  /**
   * Find dependencies that are installed.
   */
  findInstalled(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return (
      profile.dependencies ?? []
    ).filter(
      (dependency) =>
        dependency.installed,
    );
  }

  /**
   * Determine whether every recorded dependency
   * is currently installed.
   */
  allInstalled(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.findMissing(
      profile,
    ).length === 0;
  }
}

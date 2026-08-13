/**
 * Hydra Mac Compatibility
 *
 * Handles installation of Windows compatibility dependencies.
 *
 * This class intentionally does not blindly install components.
 * Installation requests must identify the dependency being
 * installed, and the actual Wine/runtime installation layer
 * can be connected later.
 */

import {
  MacGameCompatibilityProfile,
  MacDependency,
} from "../manager/MacCompatibilityTypes";

export interface MacDependencyInstallResult {
  dependencyId: string;
  success: boolean;
  installedAt?: string;
  message: string;
}

export class MacDependencyInstaller {
  /**
   * Install a dependency for a game.
   *
   * The actual Wine dependency installation mechanism will be
   * connected later. For now this method validates the request
   * and updates the in-memory compatibility profile.
   */
  async install(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): Promise<MacDependencyInstallResult> {
    const dependency =
      (
        profile.dependencies ?? []
      ).find(
        (item) =>
          item.id ===
          dependencyId,
      );

    if (!dependency) {
      return {
        dependencyId,
        success: false,
        message:
          `Dependency "${dependencyId}" was not found in the game's compatibility profile.`,
      };
    }

    if (dependency.installed) {
      return {
        dependencyId,
        success: true,
        installedAt:
          dependency.installedAt,
        message:
          "Dependency is already installed.",
      };
    }

    /*
     * Runtime installation will be connected here.
     *
     * We deliberately do not claim that a dependency was
     * actually installed until the real Wine/runtime layer
     * confirms the operation.
     */
    return {
      dependencyId,
      success: false,
      message:
        "Dependency installation runtime is not connected yet.",
    };
  }

  /**
   * Mark a dependency as installed after the real runtime
   * confirms a successful installation.
   */
  markInstalled(
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

    if (!dependency) {
      return false;
    }

    dependency.installed =
      true;

    dependency.installedAt =
      new Date().toISOString();

    return true;
  }

  /**
   * Mark a dependency as unavailable or not installed.
   */
  markNotInstalled(
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

    if (!dependency) {
      return false;
    }

    dependency.installed =
      false;

    dependency.installedAt =
      undefined;

    return true;
  }

  /**
   * Determine whether a dependency can be requested.
   */
  canInstall(
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

    if (!dependency) {
      return false;
    }

    return !dependency.installed;
  }

  /**
   * Return all dependencies that still need installation.
   */
  getMissingDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return (
      profile.dependencies ?? []
    ).filter(
      (dependency) =>
        !dependency.installed,
    );
  }
}

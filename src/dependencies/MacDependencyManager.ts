/**
 * Hydra Mac Compatibility
 *
 * Coordinates Windows game dependencies used by Wine.
 *
 * The manager tracks what a game needs and what has been
 * installed. Actual detection and installation are handled
 * by separate dependency components.
 */

import type {
  MacDependency,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export interface DependencyRequirement {
  /**
   * Stable dependency identifier.
   */
  id: string;

  /**
   * Human-readable dependency name.
   */
  name: string;

  /**
   * Optional version requirement.
   */
  version?: string;

  /**
   * Whether this dependency is required for the game.
   */
  required: boolean;
}

export interface DependencyStatus {
  dependency: DependencyRequirement;

  installed: boolean;

  installedVersion?: string;
}

export class MacDependencyManager {
  /**
   * Return all dependencies currently recorded
   * in a game's compatibility profile.
   */
  getInstalledDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return [
      ...profile.installedDependencies,
    ];
  }

  /**
   * Determine whether a dependency is already recorded
   * as installed.
   */
  isDependencyInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    return profile.installedDependencies.some(
      (dependency) =>
        dependency.id ===
          dependencyId &&
        dependency.installed,
    );
  }

  /**
   * Add a dependency to the game's compatibility profile.
   *
   * This does not install anything.
   */
  addDependency(
    profile: MacGameCompatibilityProfile,
    dependency: MacDependency,
  ): void {
    const existingIndex =
      profile.installedDependencies.findIndex(
        (existing) =>
          existing.id ===
          dependency.id,
      );

    if (
      existingIndex >= 0
    ) {
      profile.installedDependencies[
        existingIndex
      ] = dependency;

      return;
    }

    profile.installedDependencies.push(
      dependency,
    );
  }

  /**
   * Remove a dependency from the compatibility profile.
   *
   * This does not uninstall anything from Wine.
   */
  removeDependency(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    const originalLength =
      profile.installedDependencies.length;

    profile.installedDependencies =
      profile.installedDependencies.filter(
        (dependency) =>
          dependency.id !==
          dependencyId,
      );

    return (
      profile.installedDependencies.length !==
      originalLength
    );
  }

  /**
   * Mark an existing dependency as installed.
   */
  markInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
    version?: string,
  ): boolean {
    const dependency =
      profile.installedDependencies.find(
        (item) =>
          item.id ===
          dependencyId,
      );

    if (!dependency) {
      return false;
    }

    dependency.installed =
      true;

    if (version !== undefined) {
      dependency.version =
        version;
    }

    return true;
  }

  /**
   * Mark an existing dependency as not installed.
   */
  markNotInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    const dependency =
      profile.installedDependencies.find(
        (item) =>
          item.id ===
          dependencyId,
      );

    if (!dependency) {
      return false;
    }

    dependency.installed =
      false;

    return true;
  }

  /**
   * Compare the game's required dependencies against
   * the dependencies currently recorded in its profile.
   */
  getDependencyStatus(
    profile: MacGameCompatibilityProfile,
    requirements: DependencyRequirement[],
  ): DependencyStatus[] {
    return requirements.map(
      (requirement) => {
        const installed =
          profile.installedDependencies.find(
            (dependency) =>
              dependency.id ===
              requirement.id,
          );

        return {
          dependency:
            requirement,

          installed:
            installed?.installed ??
            false,

          installedVersion:
            installed?.version,
        };
      },
    );
  }

  /**
   * Return dependencies that are required but not installed.
   */
  getMissingRequiredDependencies(
    profile: MacGameCompatibilityProfile,
    requirements: DependencyRequirement[],
  ): DependencyRequirement[] {
    return requirements.filter(
      (requirement) =>
        requirement.required &&
        !this.isDependencyInstalled(
          profile,
          requirement.id,
        ),
    );
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Installs Windows dependencies required by a game.
 *
 * IMPORTANT:
 * Installation is intentionally isolated from detection.
 * The installer must never blindly install every available
 * dependency.
 *
 * Actual Wine/winetricks installation will be connected
 * during macOS integration.
 */

import {
  MacDependency,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacDependencyInstaller {
  /**
   * Install a dependency for a game.
   *
   * The current implementation performs a safe profile-level
   * operation only. Real dependency installation will be
   * connected once the Wine environment is available.
   */
  install(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    const dependency =
      this.findDependency(
        profile,
        dependencyName,
      );

    if (!dependency) {
      return false;
    }

    /*
     * Do not claim that a dependency was installed until
     * the real Wine dependency installer is connected.
     */
    return dependency.installed === true;
  }

  /**
   * Mark a dependency as installed after a real installation
   * has successfully completed.
   *
   * This method is intentionally separate from install()
   * so the profile cannot falsely report a successful
   * installation.
   */
  recordInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    const dependency =
      this.findDependency(
        profile,
        dependencyName,
      );

    if (!dependency) {
      return false;
    }

    dependency.installed = true;

    return true;
  }

  /**
   * Find a dependency by name.
   */
  findDependency(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): MacDependency | undefined {
    return profile.dependencies?.find(
      (dependency) =>
        dependency.name
          .trim()
          .toLowerCase() ===
        dependencyName
          .trim()
          .toLowerCase(),
    );
  }

  /**
   * Determine whether a dependency can be installed
   * according to the current profile information.
   *
   * This is intentionally conservative.
   */
  canInstall(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    const dependency =
      this.findDependency(
        profile,
        dependencyName,
      );

    if (!dependency) {
      return false;
    }

    if (dependency.installed) {
      return false;
    }

    /*
     * Actual compatibility checks will be expanded when
     * the Wine/dependency subsystem is integrated.
     */
    return true;
  }

  /**
   * Return all dependencies that still need installation.
   */
  getInstallableDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return (profile.dependencies ?? []).filter(
      (dependency) =>
        !dependency.installed,
    );
  }
}

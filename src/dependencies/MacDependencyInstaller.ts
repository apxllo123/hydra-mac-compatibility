/**
 * Hydra Mac Compatibility
 *
 * Controls dependency installation for Windows games.
 *
 * The installer is intentionally conservative.
 * It will never blindly install every available dependency.
 */

import {
  MacDependency,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacDependencyInstaller {
  /**
   * Determine whether a dependency can be installed.
   *
   * Actual compatibility checks will be connected to the
   * Wine/dependency implementation later.
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

    return (
      dependency.supported &&
      !dependency.installed
    );
  }

  /**
   * Attempt to install a dependency.
   *
   * This currently performs no system-level installation.
   * The actual installer will be connected later.
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

    if (
      !dependency.supported
    ) {
      return false;
    }

    if (
      dependency.installed
    ) {
      return true;
    }

    return false;
  }

  /**
   * Mark a dependency as installed after the real
   * installation process has confirmed success.
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

    if (
      !dependency.supported
    ) {
      return false;
    }

    dependency.installed =
      true;

    return true;
  }

  /**
   * Return dependencies that are supported and missing.
   */
  getInstallableDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return (
      profile.dependencies ?? []
    )
      .filter(
        (dependency) =>
          dependency.supported &&
          !dependency.installed,
      )
      .map(
        (dependency) => ({
          ...dependency,
        }),
      );
  }

  /**
   * Find a dependency by name.
   */
  private findDependency(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): MacDependency | undefined {
    const normalizedName =
      dependencyName
        .trim()
        .toLowerCase();

    return (
      profile.dependencies ??
      []
    ).find(
      (dependency) =>
        dependency.name
          .trim()
          .toLowerCase() ===
        normalizedName,
    );
  }
}

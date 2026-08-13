/**
 * Hydra Mac Compatibility
 *
 * Installs Windows dependencies required by a game's
 * compatibility environment.
 *
 * IMPORTANT:
 * This class is intentionally conservative.
 *
 * It does not blindly install dependencies.
 * The dependency manager and detector decide what is
 * appropriate before installation is requested.
 */

import {
  MacDependency,
} from "../manager/MacCompatibilityTypes";

export class MacDependencyInstaller {
  /**
   * Install a dependency into a game's Wine prefix.
   *
   * Actual installation commands will be connected during
   * Hydra integration.
   *
   * Returning false for now is intentional. We should never
   * pretend an installation succeeded when no real installer
   * has been connected.
   */
  install(
    _gameId: string,
    _prefixPath: string,
    _dependency: MacDependency,
  ): boolean {
    return false;
  }

  /**
   * Install multiple dependencies.
   *
   * Each dependency is processed independently.
   */
  installAll(
    gameId: string,
    prefixPath: string,
    dependencies: MacDependency[],
  ): MacDependency[] {
    const installed: MacDependency[] = [];

    for (const dependency of dependencies) {
      const success = this.install(
        gameId,
        prefixPath,
        dependency,
      );

      if (success) {
        installed.push({
          ...dependency,
          installed: true,
        });
      }
    }

    return installed;
  }

  /**
   * Determine whether a dependency is eligible for
   * installation.
   *
   * Unsupported dependencies should never be passed
   * to the actual installation layer.
   */
  canInstall(
    dependency: MacDependency,
  ): boolean {
    return dependency.supported === true;
  }
}

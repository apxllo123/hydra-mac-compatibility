/**
 * Hydra Mac Compatibility
 *
 * Detects Windows dependencies used by a game's compatibility
 * environment.
 *
 * This class only detects and reports dependencies.
 * It does not install, remove, or modify anything.
 */

import {
  MacDependency,
} from "../manager/MacCompatibilityTypes";

export class MacDependencyDetector {
  /**
   * Detect dependencies currently associated with a game.
   *
   * Actual prefix inspection will be connected during
   * Hydra integration.
   */
  detect(
    _gameId: string,
    _prefixPath: string,
  ): MacDependency[] {
    return [];
  }

  /**
   * Check whether a specific dependency is installed.
   */
  isInstalled(
    gameId: string,
    prefixPath: string,
    dependencyId: string,
  ): boolean {
    return this.detect(
      gameId,
      prefixPath,
    ).some(
      (dependency) =>
        dependency.id === dependencyId &&
        dependency.installed,
    );
  }

  /**
   * Find a dependency by its ID.
   */
  findById(
    gameId: string,
    prefixPath: string,
    dependencyId: string,
  ): MacDependency | undefined {
    return this.detect(
      gameId,
      prefixPath,
    ).find(
      (dependency) =>
        dependency.id === dependencyId,
    );
  }
}

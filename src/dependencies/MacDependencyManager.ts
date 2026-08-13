/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for Windows dependency management.
 *
 * The manager connects dependency detection and installation
 * without putting low-level dependency logic into one giant class.
 */

import {
  MacDependency,
} from "../manager/MacCompatibilityTypes";

import { MacDependencyDetector } from "./MacDependencyDetector";
import { MacDependencyInstaller } from "./MacDependencyInstaller";

export class MacDependencyManager {
  private readonly detector: MacDependencyDetector;
  private readonly installer: MacDependencyInstaller;

  constructor(
    detector: MacDependencyDetector =
      new MacDependencyDetector(),
    installer: MacDependencyInstaller =
      new MacDependencyInstaller(),
  ) {
    this.detector = detector;
    this.installer = installer;
  }

  /**
   * Detect dependencies currently associated with a game.
   */
  detect(
    gameId: string,
    prefixPath: string,
  ): MacDependency[] {
    return this.detector.detect(
      gameId,
      prefixPath,
    );
  }

  /**
   * Check whether a dependency is installed.
   */
  isInstalled(
    gameId: string,
    prefixPath: string,
    dependencyId: string,
  ): boolean {
    return this.detector.isInstalled(
      gameId,
      prefixPath,
      dependencyId,
    );
  }

  /**
   * Determine which dependencies are supported
   * by the installation layer.
   */
  getInstallableDependencies(
    dependencies: MacDependency[],
  ): MacDependency[] {
    return dependencies.filter(
      (dependency) =>
        this.installer.canInstall(
          dependency,
        ),
    );
  }

  /**
   * Request installation of one dependency.
   *
   * The installer performs the actual operation.
   */
  install(
    gameId: string,
    prefixPath: string,
    dependency: MacDependency,
  ): boolean {
    if (
      !this.installer.canInstall(
        dependency,
      )
    ) {
      return false;
    }

    return this.installer.install(
      gameId,
      prefixPath,
      dependency,
    );
  }

  /**
   * Request installation of multiple dependencies.
   */
  installAll(
    gameId: string,
    prefixPath: string,
    dependencies: MacDependency[],
  ): MacDependency[] {
    const installable =
      this.getInstallableDependencies(
        dependencies,
      );

    return this.installer.installAll(
      gameId,
      prefixPath,
      installable,
    );
  }

  /**
   * Find a dependency by ID.
   */
  find(
    gameId: string,
    prefixPath: string,
    dependencyId: string,
  ): MacDependency | undefined {
    return this.detector.findById(
      gameId,
      prefixPath,
      dependencyId,
    );
  }
}

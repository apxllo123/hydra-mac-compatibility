/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for game dependencies.
 *
 * The manager coordinates detection and installation but does
 * not contain the low-level dependency logic itself.
 */

import {
  MacDependency,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacDependencyDetector } from "./MacDependencyDetector";
import { MacDependencyInstaller } from "./MacDependencyInstaller";

export class MacDependencyManager {
  private readonly detector: MacDependencyDetector;
  private readonly installer: MacDependencyInstaller;

  constructor(
    detector = new MacDependencyDetector(),
    installer = new MacDependencyInstaller(),
  ) {
    this.detector = detector;
    this.installer = installer;
  }

  /**
   * Return all dependencies recorded for a game.
   */
  getDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detector.detect(profile);
  }

  /**
   * Return dependencies that are missing.
   */
  getMissingDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detector.getMissing(profile);
  }

  /**
   * Return dependencies that are installed.
   */
  getInstalledDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detector.getInstalled(profile);
  }

  /**
   * Check whether all recorded dependencies are installed.
   */
  areAllDependenciesInstalled(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.detector.areAllInstalled(
      profile,
    );
  }

  /**
   * Determine whether a dependency can currently be installed.
   */
  canInstall(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    return this.installer.canInstall(
      profile,
      dependencyName,
    );
  }

  /**
   * Attempt to install a dependency.
   *
   * The actual system-level installation will be connected
   * during Wine integration.
   */
  install(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    return this.installer.install(
      profile,
      dependencyName,
    );
  }

  /**
   * Record a dependency as installed after the real installer
   * has confirmed success.
   */
  recordInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyName: string,
  ): boolean {
    return this.installer.recordInstalled(
      profile,
      dependencyName,
    );
  }

  /**
   * Return dependencies that are candidates for installation.
   */
  getInstallableDependencies(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.installer.getInstallableDependencies(
      profile,
    );
  }
}

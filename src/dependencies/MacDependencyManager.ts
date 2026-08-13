/**
 * Hydra Mac Compatibility
 *
 * Coordinates dependency detection and installation for
 * Windows games running through the macOS compatibility layer.
 *
 * The manager coordinates the dependency subsystem.
 * Detection and installation remain separate responsibilities.
 */

import {
  MacGameCompatibilityProfile,
  MacDependency,
} from "../manager/MacCompatibilityTypes";

import {
  MacDependencyDetector,
  MacDependencyDetectionResult,
} from "./MacDependencyDetector";

import {
  MacDependencyInstaller,
  MacDependencyInstallResult,
} from "./MacDependencyInstaller";

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
   * Inspect all dependencies associated with a game.
   */
  async detect(
    profile: MacGameCompatibilityProfile,
  ): Promise<MacDependencyDetectionResult[]> {
    return this.detector.detect(
      profile,
    );
  }

  /**
   * Return dependencies that are currently missing.
   */
  getMissing(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detector.findMissing(
      profile,
    );
  }

  /**
   * Return dependencies that are currently installed.
   */
  getInstalled(
    profile: MacGameCompatibilityProfile,
  ): MacDependency[] {
    return this.detector.findInstalled(
      profile,
    );
  }

  /**
   * Determine whether all recorded dependencies
   * are installed.
   */
  allInstalled(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.detector.allInstalled(
      profile,
    );
  }

  /**
   * Request installation of a dependency.
   */
  async install(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): Promise<MacDependencyInstallResult> {
    return this.installer.install(
      profile,
      dependencyId,
    );
  }

  /**
   * Mark a dependency as installed after the runtime
   * confirms successful installation.
   */
  markInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    return this.installer.markInstalled(
      profile,
      dependencyId,
    );
  }

  /**
   * Mark a dependency as not installed.
   */
  markNotInstalled(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    return this.installer.markNotInstalled(
      profile,
      dependencyId,
    );
  }

  /**
   * Determine whether a dependency can be installed.
   */
  canInstall(
    profile: MacGameCompatibilityProfile,
    dependencyId: string,
  ): boolean {
    return this.installer.canInstall(
      profile,
      dependencyId,
    );
  }

  /**
   * Return the dependency detector.
   */
  getDetector(): MacDependencyDetector {
    return this.detector;
  }

  /**
   * Return the dependency installer.
   */
  getInstaller(): MacDependencyInstaller {
    return this.installer;
  }
}

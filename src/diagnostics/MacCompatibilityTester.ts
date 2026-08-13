/**
 * Hydra Mac Compatibility
 *
 * Tests whether a Windows game compatibility configuration
 * is internally ready to be used.
 *
 * The tester reports results only. It does not repair,
 * install, or modify compatibility data.
 */

import {
  MacGameCompatibilityProfile,
  CompatibilityTestResult,
} from "../manager/MacCompatibilityTypes";

export class MacCompatibilityTester {
  /**
   * Test a game's compatibility configuration.
   *
   * Runtime launch testing will be connected later.
   * For now, this performs safe configuration checks.
   */
  async test(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityTestResult> {
    const checks: string[] = [];
    const failures: string[] = [];

    this.checkGame(
      profile,
      checks,
      failures,
    );

    this.checkWine(
      profile,
      checks,
      failures,
    );

    this.checkDependencies(
      profile,
      checks,
      failures,
    );

    this.checkGraphics(
      profile,
      checks,
      failures,
    );

    const passed =
      failures.length === 0;

    return {
      gameId: profile.gameId,
      passed,
      testedAt:
        new Date().toISOString(),
      checks,
      failures,
    };
  }

  /**
   * Check the game configuration.
   */
  private checkGame(
    profile: MacGameCompatibilityProfile,
    checks: string[],
    failures: string[],
  ): void {
    if (
      profile.gamePath &&
      profile.gamePath.trim()
    ) {
      checks.push(
        "Game path is configured.",
      );
    } else {
      failures.push(
        "Game path is not configured.",
      );
    }

    if (
      profile.executable &&
      profile.executable.trim()
    ) {
      checks.push(
        "Game executable is configured.",
      );
    } else {
      failures.push(
        "Game executable is not configured.",
      );
    }
  }

  /**
   * Check the Wine configuration.
   */
  private checkWine(
    profile: MacGameCompatibilityProfile,
    checks: string[],
    failures: string[],
  ): void {
    if (!profile.wine) {
      failures.push(
        "Wine is not configured.",
      );

      return;
    }

    if (
      profile.wine.version &&
      profile.wine.version.trim()
    ) {
      checks.push(
        `Wine version configured: ${profile.wine.version}.`,
      );
    } else {
      failures.push(
        "Wine version is not configured.",
      );
    }

    if (
      profile.wine.prefixPath &&
      profile.wine.prefixPath.trim()
    ) {
      checks.push(
        "Wine prefix is configured.",
      );
    } else {
      failures.push(
        "Wine prefix is not configured.",
      );
    }
  }

  /**
   * Check dependency configuration.
   */
  private checkDependencies(
    profile: MacGameCompatibilityProfile,
    checks: string[],
    failures: string[],
  ): void {
    const dependencies =
      profile.dependencies ?? [];

    if (
      dependencies.length === 0
    ) {
      checks.push(
        "No additional dependencies are recorded.",
      );

      return;
    }

    for (const dependency of dependencies) {
      if (dependency.installed) {
        checks.push(
          `Dependency installed: ${dependency.id}.`,
        );
      } else {
        failures.push(
          `Dependency missing: ${dependency.id}.`,
        );
      }
    }
  }

  /**
   * Check graphics configuration.
   */
  private checkGraphics(
    profile: MacGameCompatibilityProfile,
    checks: string[],
    failures: string[],
  ): void {
    const graphics =
      profile.graphics;

    if (
      graphics.backend &&
      graphics.backend.trim()
    ) {
      checks.push(
        `Graphics backend configured: ${graphics.backend}.`,
      );
    } else {
      failures.push(
        "Graphics backend is not configured.",
      );
    }

    if (graphics.dxvk.enabled) {
      if (graphics.dxvk.version) {
        checks.push(
          `DXVK configured: ${graphics.dxvk.version}.`,
        );
      } else {
        failures.push(
          "DXVK is enabled but no version is configured.",
        );
      }
    } else {
      checks.push(
        "DXVK is disabled.",
      );
    }

    if (graphics.vkd3d.enabled) {
      if (graphics.vkd3d.version) {
        checks.push(
          `VKD3D configured: ${graphics.vkd3d.version}.`,
        );
      } else {
        failures.push(
          "VKD3D is enabled but no version is configured.",
        );
      }
    } else {
      checks.push(
        "VKD3D is disabled.",
      );
    }
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Compatibility test coordinator for Windows games on macOS.
 *
 * The tester determines whether a compatibility configuration
 * appears to work. It does not perform repairs or change the
 * configuration automatically.
 */

import {
  CompatibilityTestResult,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacCompatibilityTester {
  /**
   * Run a safe profile-level compatibility test.
   *
   * Real Wine/game launching will be connected during
   * macOS integration.
   */
  test(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityTestResult {
    const failures: string[] = [];

    if (!profile.gameId) {
      failures.push(
        "Game ID is missing.",
      );
    }

    if (!profile.gameName) {
      failures.push(
        "Game name is missing.",
      );
    }

    if (!profile.gamePath) {
      failures.push(
        "Game installation path is not configured.",
      );
    }

    if (!profile.wine) {
      failures.push(
        "Wine configuration is missing.",
      );
    } else {
      if (!profile.wine.version) {
        failures.push(
          "Wine version is not configured.",
        );
      }

      if (!profile.wine.prefixPath) {
        failures.push(
          "Wine prefix is not configured.",
        );
      }
    }

    if (!profile.graphics) {
      failures.push(
        "Graphics configuration is missing.",
      );
    }

    const passed =
      failures.length === 0;

    return {
      gameId: profile.gameId,
      passed,
      testedAt: new Date().toISOString(),
      durationMs: 0,
      message: passed
        ? "Compatibility configuration passed the profile-level test."
        : "Compatibility configuration failed the profile-level test.",
      failures,
    };
  }

  /**
   * Determine whether a game passes the compatibility test.
   */
  isPassing(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.test(
      profile,
    ).passed;
  }

  /**
   * Return a human-readable test summary.
   */
  getSummary(
    profile: MacGameCompatibilityProfile,
  ): string {
    const result =
      this.test(profile);

    if (result.passed) {
      return (
        "Compatibility configuration is ready for testing."
      );
    }

    return [
      "Compatibility configuration needs attention:",
      ...result.failures.map(
        (failure) =>
          `- ${failure}`,
      ),
    ].join("\n");
  }
}

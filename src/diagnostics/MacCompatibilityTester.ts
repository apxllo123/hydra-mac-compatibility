/**
 * Hydra Mac Compatibility
 *
 * Compatibility test coordinator for Windows games on macOS.
 *
 * The tester determines whether a compatibility configuration
 * appears usable. It does not permanently modify configuration.
 */

import {
  CompatibilityTestResult,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacCompatibilityDiagnostics } from "./MacCompatibilityDiagnostics";

export class MacCompatibilityTester {
  private readonly diagnostics: MacCompatibilityDiagnostics;

  constructor(
    diagnostics = new MacCompatibilityDiagnostics(),
  ) {
    this.diagnostics = diagnostics;
  }

  /**
   * Run a compatibility test for a game.
   *
   * The current implementation performs a configuration
   * and diagnostic validation. Actual Wine/game launching
   * will be connected during Hydra integration.
   */
  test(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityTestResult {
    const diagnosticResult =
      this.diagnostics.diagnose(
        profile,
      );

    const passed =
      diagnosticResult.healthy;

    return {
      gameId: profile.gameId,
      passed,
      testedAt:
        new Date().toISOString(),
      diagnostics:
        diagnosticResult.diagnostics,
    };
  }

  /**
   * Run a lightweight configuration test.
   */
  testConfiguration(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityTestResult {
    return this.test(profile);
  }

  /**
   * Determine whether a previous test result indicates
   * that the game passed.
   */
  didPass(
    result: CompatibilityTestResult,
  ): boolean {
    return result.passed;
  }
}

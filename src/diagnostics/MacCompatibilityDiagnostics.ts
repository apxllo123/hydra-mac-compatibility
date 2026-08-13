/**
 * Hydra Mac Compatibility
 *
 * Diagnostic coordinator for Windows game compatibility.
 *
 * Diagnostics identify problems.
 * They do not modify the game environment.
 *
 * Repair is handled separately by MacCompatibilityRepair.
 */

import {
  CompatibilityDiagnostic,
  CompatibilityDiagnosticResult,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacCompatibilityDiagnostics {
  /**
   * Inspect a game's compatibility profile.
   *
   * This performs safe, profile-level checks only.
   * Actual Wine/prefix/filesystem inspection will be connected
   * during Hydra integration.
   */
  diagnose(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnosticResult {
    const diagnostics: CompatibilityDiagnostic[] = [];

    if (!profile.gameId) {
      diagnostics.push({
        code: "INVALID_GAME_ID",
        severity: "error",
        message:
          "The game does not have a valid game ID.",
      });
    }

    if (!profile.gameName) {
      diagnostics.push({
        code: "INVALID_GAME_NAME",
        severity: "error",
        message:
          "The game does not have a valid game name.",
      });
    }

    if (!profile.gamePath) {
      diagnostics.push({
        code: "GAME_PATH_NOT_CONFIGURED",
        severity: "warning",
        message:
          "The game's installation path has not been configured.",
      });
    }

    if (!profile.wine) {
      diagnostics.push({
        code: "WINE_CONFIGURATION_MISSING",
        severity: "error",
        message:
          "The game does not have a Wine configuration.",
      });
    } else {
      if (!profile.wine.version) {
        diagnostics.push({
          code: "WINE_VERSION_MISSING",
          severity: "error",
          message:
            "No Wine version has been selected.",
        });
      }

      if (!profile.wine.prefixPath) {
        diagnostics.push({
          code: "WINE_PREFIX_MISSING",
          severity: "error",
          message:
            "The game's Wine prefix has not been configured.",
        });
      }
    }

    if (!profile.graphics) {
      diagnostics.push({
        code: "GRAPHICS_CONFIGURATION_MISSING",
        severity: "error",
        message:
          "The game does not have a graphics configuration.",
      });
    }

    const hasErrors = diagnostics.some(
      (diagnostic) =>
        diagnostic.severity === "error" ||
        diagnostic.severity === "critical",
    );

    const healthy =
      diagnostics.length === 0;

    return {
      gameId: profile.gameId,
      healthy,
      diagnostics,
      checkedAt: new Date().toISOString(),
      hasErrors,
    };
  }

  /**
   * Determine whether a profile is healthy.
   */
  isHealthy(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return this.diagnose(
      profile,
    ).healthy;
  }

  /**
   * Return only errors and critical problems.
   */
  getErrors(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    return this.diagnose(
      profile,
    ).diagnostics.filter(
      (diagnostic) =>
        diagnostic.severity === "error" ||
        diagnostic.severity === "critical",
    );
  }

  /**
   * Return only warnings.
   */
  getWarnings(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    return this.diagnose(
      profile,
    ).diagnostics.filter(
      (diagnostic) =>
        diagnostic.severity === "warning",
    );
  }
}

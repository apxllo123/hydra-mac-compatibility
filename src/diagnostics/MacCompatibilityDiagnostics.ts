/**
 * Hydra Mac Compatibility
 *
 * Diagnostic coordinator for Windows game compatibility.
 *
 * Diagnostics identify problems but do not modify the game,
 * Wine environment, dependencies, or graphics configuration.
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
   * This is intentionally conservative. Real Wine,
   * filesystem, dependency, and graphics checks will be
   * connected as those subsystems become operational.
   */
  diagnose(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnosticResult {
    const diagnostics: CompatibilityDiagnostic[] =
      [];

    this.checkGamePath(
      profile,
      diagnostics,
    );

    this.checkWine(
      profile,
      diagnostics,
    );

    this.checkDependencies(
      profile,
      diagnostics,
    );

    this.checkGraphics(
      profile,
      diagnostics,
    );

    const healthy =
      diagnostics.every(
        (diagnostic) =>
          diagnostic.severity !==
            "critical" &&
          diagnostic.severity !==
            "error",
      );

    return {
      gameId: profile.gameId,
      healthy,
      diagnostics,
      diagnosedAt:
        new Date().toISOString(),
    };
  }

  /**
   * Check whether the game path is configured.
   */
  private checkGamePath(
    profile: MacGameCompatibilityProfile,
    diagnostics: CompatibilityDiagnostic[],
  ): void {
    if (
      !profile.gamePath ||
      !profile.gamePath.trim()
    ) {
      diagnostics.push({
        code: "GAME_PATH_NOT_CONFIGURED",
        severity: "error",
        message:
          "The game installation path is not configured.",
      });
    }
  }

  /**
   * Check Wine configuration.
   */
  private checkWine(
    profile: MacGameCompatibilityProfile,
    diagnostics: CompatibilityDiagnostic[],
  ): void {
    if (!profile.wine) {
      diagnostics.push({
        code: "WINE_NOT_CONFIGURED",
        severity: "error",
        message:
          "No Wine configuration is assigned to this game.",
      });

      return;
    }

    if (
      !profile.wine.version ||
      !profile.wine.version.trim()
    ) {
      diagnostics.push({
        code: "WINE_VERSION_NOT_CONFIGURED",
        severity: "error",
        message:
          "The game does not have a Wine version configured.",
      });
    }

    if (
      !profile.wine.prefixPath ||
      !profile.wine.prefixPath.trim()
    ) {
      diagnostics.push({
        code: "WINE_PREFIX_NOT_CONFIGURED",
        severity: "error",
        message:
          "The game does not have a Wine prefix configured.",
      });
    }
  }

  /**
   * Check dependency configuration.
   */
  private checkDependencies(
    profile: MacGameCompatibilityProfile,
    diagnostics: CompatibilityDiagnostic[],
  ): void {
    const dependencies =
      profile.dependencies ?? [];

    for (const dependency of dependencies) {
      if (
        !dependency.name ||
        !dependency.name.trim()
      ) {
        diagnostics.push({
          code:
            "DEPENDENCY_CONFIGURATION_INVALID",
          severity: "error",
          message:
            "A dependency entry is missing its name.",
        });

        continue;
      }

      if (
        dependency.required &&
        !dependency.installed
      ) {
        diagnostics.push({
          code:
            "REQUIRED_DEPENDENCY_MISSING",
          severity: "error",
          message:
            `Required dependency "${dependency.name}" is not installed.`,
        });
      }
    }
  }

  /**
   * Check graphics configuration.
   */
  private checkGraphics(
    profile: MacGameCompatibilityProfile,
    diagnostics: CompatibilityDiagnostic[],
  ): void {
    if (!profile.graphics) {
      diagnostics.push({
        code:
          "GRAPHICS_CONFIGURATION_MISSING",
        severity: "warning",
        message:
          "No graphics configuration has been recorded.",
      });

      return;
    }

    if (
      profile.graphics.backend ===
      "unknown"
    ) {
      diagnostics.push({
        code:
          "GRAPHICS_BACKEND_UNKNOWN",
        severity: "warning",
        message:
          "The graphics backend has not been determined.",
      });
    }
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Diagnoses Windows game compatibility problems on macOS.
 *
 * Diagnostics inspect the current configuration and report
 * problems. They do not modify the game, Wine prefix,
 * dependencies, or graphics configuration.
 */

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export type CompatibilityDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export interface MacCompatibilityDiagnostic {
  code: string;
  severity: CompatibilityDiagnosticSeverity;
  component:
    | "wine"
    | "prefix"
    | "dependencies"
    | "graphics"
    | "configuration"
    | "game"
    | "profile";
  message: string;
  details?: string;
  repairable?: boolean;
}

export interface MacCompatibilityDiagnosticReport {
  gameId: string;
  healthy: boolean;
  diagnostics: MacCompatibilityDiagnostic[];
  generatedAt: string;
}

export class MacCompatibilityDiagnostics {
  /**
   * Run diagnostics against a game compatibility profile.
   *
   * This performs configuration-level checks.
   * Runtime checks will be connected when the Wine and
   * filesystem layers are fully integrated.
   */
  async diagnose(
    profile: MacGameCompatibilityProfile,
  ): Promise<MacCompatibilityDiagnosticReport> {
    const diagnostics: MacCompatibilityDiagnostic[] =
      [];

    this.checkProfile(
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

    this.checkGame(
      profile,
      diagnostics,
    );

    const hasErrors =
      diagnostics.some(
        (diagnostic) =>
          diagnostic.severity ===
            "error" ||
          diagnostic.severity ===
            "critical",
      );

    return {
      gameId: profile.gameId,
      healthy: !hasErrors,
      diagnostics,
      generatedAt:
        new Date().toISOString(),
    };
  }

  /**
   * Validate the basic compatibility profile.
   */
  private checkProfile(
    profile: MacGameCompatibilityProfile,
    diagnostics: MacCompatibilityDiagnostic[],
  ): void {
    if (!profile.gameId.trim()) {
      diagnostics.push({
        code:
          "PROFILE_GAME_ID_MISSING",
        severity: "critical",
        component: "profile",
        message:
          "The game compatibility profile does not contain a game ID.",
        repairable: false,
      });
    }

    if (!profile.gameName.trim()) {
      diagnostics.push({
        code:
          "PROFILE_GAME_NAME_MISSING",
        severity: "error",
        component: "profile",
        message:
          "The game compatibility profile does not contain a game name.",
        repairable: true,
      });
    }

    if (!profile.gamePath.trim()) {
      diagnostics.push({
        code:
          "GAME_PATH_MISSING",
        severity: "error",
        component: "game",
        message:
          "The installed game path is not configured.",
        repairable: true,
      });
    }
  }

  /**
   * Validate Wine configuration.
   */
  private checkWine(
    profile: MacGameCompatibilityProfile,
    diagnostics: MacCompatibilityDiagnostic[],
  ): void {
    if (!profile.wine) {
      diagnostics.push({
        code:
          "WINE_NOT_CONFIGURED",
        severity: "error",
        component: "wine",
        message:
          "No Wine configuration has been selected for this game.",
        repairable: true,
      });

      return;
    }

    if (
      !profile.wine.version ||
      !profile.wine.version.trim()
    ) {
      diagnostics.push({
        code:
          "WINE_VERSION_MISSING",
        severity: "error",
        component: "wine",
        message:
          "The game has a Wine configuration but no Wine version is selected.",
        repairable: true,
      });
    }

    if (
      !profile.wine.prefixPath ||
      !profile.wine.prefixPath.trim()
    ) {
      diagnostics.push({
        code:
          "WINE_PREFIX_MISSING",
        severity: "error",
        component: "prefix",
        message:
          "The game's Wine prefix path is not configured.",
        repairable: true,
      });
    }
  }

  /**
   * Check dependency configuration.
   */
  private checkDependencies(
    profile: MacGameCompatibilityProfile,
    diagnostics: MacCompatibilityDiagnostic[],
  ): void {
    const dependencies =
      profile.dependencies ?? [];

    for (const dependency of dependencies) {
      if (dependency.installed) {
        continue;
      }

      diagnostics.push({
        code:
          "DEPENDENCY_MISSING",
        severity: "warning",
        component: "dependencies",
        message:
          `Dependency "${dependency.id}" is recorded as missing.`,
        details:
          dependency.name,
        repairable: true,
      });
    }
  }

  /**
   * Check graphics configuration.
   */
  private checkGraphics(
    profile: MacGameCompatibilityProfile,
    diagnostics: MacCompatibilityDiagnostic[],
  ): void {
    const graphics =
      profile.graphics;

    if (
      !graphics.backend ||
      !graphics.backend.trim()
    ) {
      diagnostics.push({
        code:
          "GRAPHICS_BACKEND_MISSING",
        severity: "error",
        component: "graphics",
        message:
          "No graphics backend is configured.",
        repairable: true,
      });
    }

    if (
      graphics.dxvk.enabled &&
      !graphics.dxvk.version
    ) {
      diagnostics.push({
        code:
          "DXVK_VERSION_MISSING",
        severity: "warning",
        component: "graphics",
        message:
          "DXVK is enabled but no DXVK version is configured.",
        repairable: true,
      });
    }

    if (
      graphics.vkd3d.enabled &&
      !graphics.vkd3d.version
    ) {
      diagnostics.push({
        code:
          "VKD3D_VERSION_MISSING",
        severity: "warning",
        component: "graphics",
        message:
          "VKD3D is enabled but no VKD3D version is configured.",
        repairable: true,
      });
    }
  }

  /**
   * Check basic game configuration.
   */
  private checkGame(
    profile: MacGameCompatibilityProfile,
    diagnostics: MacCompatibilityDiagnostic[],
  ): void {
    if (
      !profile.executable ||
      !profile.executable.trim()
    ) {
      diagnostics.push({
        code:
          "GAME_EXECUTABLE_MISSING",
        severity: "warning",
        component: "game",
        message:
          "No Windows game executable is configured.",
        repairable: true,
      });
    }
  }
}

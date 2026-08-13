/**
 * Hydra Mac Compatibility
 *
 * Compatibility diagnostics for Windows games running through
 * Wine on macOS.
 *
 * This class diagnoses problems only.
 * It does not modify the game environment.
 */

import {
  CompatibilityDiagnostic,
  CompatibilityDiagnosticResult,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import {
  MacWineManager,
} from "../wine/MacWineManager";

export class MacCompatibilityDiagnostics {
  private readonly wineManager: MacWineManager;

  constructor(
    wineManager: MacWineManager,
  ) {
    this.wineManager =
      wineManager;
  }

  /**
   * Run all currently available diagnostics for a game.
   */
  async diagnose(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityDiagnosticResult> {
    const diagnostics: CompatibilityDiagnostic[] = [];

    diagnostics.push(
      ...this.checkGameIdentity(
        profile,
      ),
    );

    diagnostics.push(
      ...this.checkWine(
        profile,
      ),
    );

    diagnostics.push(
      ...this.checkGraphics(
        profile,
      ),
    );

    diagnostics.push(
      ...this.checkDependencies(
        profile,
      ),
    );

    diagnostics.push(
      ...this.checkProfile(
        profile,
      ),
    );

    return {
      gameId: profile.gameId,
      checkedAt:
        new Date().toISOString(),
      healthy:
        !diagnostics.some(
          (diagnostic) =>
            diagnostic.severity ===
              "error" ||
            diagnostic.severity ===
              "critical",
        ),
      diagnostics,
    };
  }

  /**
   * Verify the game has valid identity information.
   */
  private checkGameIdentity(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    const diagnostics: CompatibilityDiagnostic[] = [];

    if (!profile.gameId.trim()) {
      diagnostics.push({
        id: "game.missing-id",
        severity: "critical",
        title: "Game ID is missing",
        message:
          "The game does not have a valid stable identifier.",
        repairable: false,
      });
    }

    if (!profile.gameName.trim()) {
      diagnostics.push({
        id: "game.missing-name",
        severity: "critical",
        title: "Game name is missing",
        message:
          "The game does not have a valid display name.",
        repairable: false,
      });
    }

    if (!profile.gamePath.trim()) {
      diagnostics.push({
        id: "game.missing-path",
        severity: "error",
        title: "Game compatibility path is missing",
        message:
          "Hydra does not know where this game's compatibility environment belongs.",
        repairable: true,
      });
    }

    return diagnostics;
  }

  /**
   * Verify the game's Wine configuration.
   */
  private checkWine(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    const diagnostics: CompatibilityDiagnostic[] = [];

    if (!profile.wine.version.trim()) {
      diagnostics.push({
        id: "wine.missing-version",
        severity: "error",
        title: "Wine version is missing",
        message:
          "No Wine version has been assigned to this game.",
        repairable: true,
      });
    }

    if (!profile.wine.path.trim()) {
      diagnostics.push({
        id: "wine.missing-path",
        severity: "error",
        title: "Wine executable is missing",
        message:
          "The game does not have a Wine executable assigned.",
        repairable: true,
      });
    }

    if (!profile.wine.prefixPath.trim()) {
      diagnostics.push({
        id: "wine.missing-prefix",
        severity: "error",
        title: "Wine prefix is missing",
        message:
          "The game does not have a Wine prefix assigned.",
        repairable: true,
      });
    }

    /*
     * If Wine has been detected, verify that the configured
     * executable is one of the detected installations.
     */
    if (
      profile.wine.path &&
      this.wineManager.isWineAvailable() &&
      !this.wineManager.hasExecutable(
        profile.wine.path,
      )
    ) {
      diagnostics.push({
        id: "wine.executable-not-detected",
        severity: "warning",
        title: "Configured Wine executable was not detected",
        message:
          "The game's configured Wine executable is not among the Wine installations currently detected on this Mac.",
        repairable: true,
      });
    }

    return diagnostics;
  }

  /**
   * Verify the game's graphics configuration.
   */
  private checkGraphics(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    const diagnostics: CompatibilityDiagnostic[] = [];

    if (
      profile.graphics.backend ===
      undefined
    ) {
      diagnostics.push({
        id: "graphics.missing-backend",
        severity: "error",
        title: "Graphics backend is missing",
        message:
          "The game does not have a graphics backend configured.",
        repairable: true,
      });
    }

    if (
      profile.graphics.dxvkEnabled &&
      profile.graphics.vkd3dEnabled
    ) {
      diagnostics.push({
        id: "graphics.multiple-translation-layers",
        severity: "info",
        title:
          "Multiple DirectX translation layers are enabled",
        message:
          "DXVK and VKD3D are both enabled. This can be valid because they target different DirectX versions, but the game should be tested with this configuration.",
        repairable: false,
      });
    }

    return diagnostics;
  }

  /**
   * Verify dependency information.
   */
  private checkDependencies(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    const diagnostics: CompatibilityDiagnostic[] = [];

    for (
      const dependency of
        profile.installedDependencies
    ) {
      if (!dependency.id.trim()) {
        diagnostics.push({
          id: "dependency.missing-id",
          severity: "warning",
          title:
            "Dependency has no identifier",
          message:
            "An installed dependency is missing its stable identifier.",
          repairable: true,
        });
      }

      if (!dependency.name.trim()) {
        diagnostics.push({
          id: "dependency.missing-name",
          severity: "warning",
          title:
            "Dependency has no name",
          message:
            "An installed dependency is missing its display name.",
          repairable: true,
        });
      }

      if (!dependency.installed) {
        diagnostics.push({
          id: `dependency.not-installed.${dependency.id}`,
          severity: "warning",
          title:
            `Dependency "${dependency.name}" is not installed`,
          message:
            "The profile lists this dependency, but it is not currently marked as installed.",
          repairable: true,
        });
      }
    }

    return diagnostics;
  }

  /**
   * Verify the compatibility profile itself.
   */
  private checkProfile(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityDiagnostic[] {
    const diagnostics: CompatibilityDiagnostic[] = [];

    if (
      !Number.isInteger(
        profile.schemaVersion,
      ) ||
      profile.schemaVersion < 1
    ) {
      diagnostics.push({
        id: "profile.invalid-schema",
        severity: "error",
        title:
          "Invalid compatibility profile version",
        message:
          "The compatibility profile has an invalid schema version.",
        repairable: true,
      });
    }

    if (
      profile.status ===
      "unknown"
    ) {
      diagnostics.push({
        id: "profile.not-tested",
        severity: "info",
        title:
          "Game has not been verified",
        message:
          "This game's compatibility environment has not yet been verified by Hydra.",
        repairable: false,
      });
    }

    return diagnostics;
  }
}

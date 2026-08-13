/**
 * Hydra Mac Compatibility
 *
 * Manages per-game graphics compatibility settings.
 *
 * IMPORTANT:
 * This class manages configuration only.
 * It does not directly modify Wine prefixes or install
 * graphics components.
 */

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import type {
  MacGraphicsProfile,
} from "./MacGraphicsProfile";

export class MacGraphicsManager {
  /**
   * Return the current graphics profile for a game.
   */
  getProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGraphicsProfile {
    return {
      ...profile.graphics,
    };
  }

  /**
   * Replace the game's graphics profile.
   */
  setProfile(
    profile: MacGameCompatibilityProfile,
    graphics: MacGraphicsProfile,
  ): void {
    profile.graphics = {
      ...graphics,
    };
  }

  /**
   * Enable or disable DXVK for a game.
   */
  setDXVKEnabled(
    profile: MacGameCompatibilityProfile,
    enabled: boolean,
  ): void {
    profile.graphics.dxvkEnabled =
      enabled;
  }

  /**
   * Enable or disable VKD3D for a game.
   */
  setVKD3DEnabled(
    profile: MacGameCompatibilityProfile,
    enabled: boolean,
  ): void {
    profile.graphics.vkd3dEnabled =
      enabled;
  }

  /**
   * Change the graphics backend.
   */
  setBackend(
    profile: MacGameCompatibilityProfile,
    backend: MacGraphicsProfile["backend"],
  ): void {
    profile.graphics.backend =
      backend;
  }

  /**
   * Reset graphics configuration to a safe baseline.
   *
   * This only changes the stored profile.
   * It does not delete or modify anything inside Wine.
   */
  reset(
    profile: MacGameCompatibilityProfile,
  ): void {
    profile.graphics = {
      backend:
        "auto",

      dxvkEnabled:
        false,

      vkd3dEnabled:
        false,
    };
  }

  /**
   * Determine whether the current configuration is
   * internally consistent.
   */
  validate(
    profile: MacGameCompatibilityProfile,
  ): string[] {
    const problems: string[] = [];

    if (
      !profile.graphics
    ) {
      problems.push(
        "No graphics profile is configured.",
      );

      return problems;
    }

    if (
      profile.graphics.backend ===
      undefined
    ) {
      problems.push(
        "No graphics backend is configured.",
      );
    }

    /*
     * DXVK targets DirectX 9/10/11.
     * VKD3D targets DirectX 12.
     *
     * Both can legitimately be installed for different
     * games, so enabling both is not automatically an error.
     */
    if (
      profile.graphics.dxvkEnabled &&
      profile.graphics.vkd3dEnabled
    ) {
      problems.push(
        "DXVK and VKD3D are both enabled. This can be valid, but the configuration should be tested with the game.",
      );
    }

    return problems;
  }

  /**
   * Create a simple description of the current
   * graphics configuration for logging/UI.
   */
  describe(
    profile: MacGameCompatibilityProfile,
  ): string {
    const graphics =
      profile.graphics;

    const backend =
      graphics.backend ??
      "unknown";

    const dxvk =
      graphics.dxvkEnabled
        ? "enabled"
        : "disabled";

    const vkd3d =
      graphics.vkd3dEnabled
        ? "enabled"
        : "disabled";

    return [
      `Backend: ${backend}`,
      `DXVK: ${dxvk}`,
      `VKD3D: ${vkd3d}`,
    ].join("\n");
  }
}

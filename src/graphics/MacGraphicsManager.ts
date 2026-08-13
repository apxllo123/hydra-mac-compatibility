/**
 * Hydra Mac Compatibility
 *
 * Coordinates per-game graphics configuration.
 *
 * The manager handles configuration, validation, and profile
 * access. It does not directly modify the Wine runtime yet.
 */

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacGraphicsProfile } from "./MacGraphicsProfile";

export interface MacGraphicsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class MacGraphicsManager {
  private readonly profiles = new Map<
    string,
    MacGraphicsProfile
  >();

  /**
   * Register the graphics configuration for a game.
   */
  register(
    profile: MacGameCompatibilityProfile,
  ): MacGraphicsProfile {
    const graphicsProfile =
      new MacGraphicsProfile(
        profile.graphics,
      );

    this.profiles.set(
      profile.gameId,
      graphicsProfile,
    );

    return graphicsProfile;
  }

  /**
   * Retrieve a game's graphics configuration.
   */
  get(
    gameId: string,
  ): MacGraphicsProfile | undefined {
    return this.profiles.get(
      gameId,
    );
  }

  /**
   * Check whether a game has a graphics configuration.
   */
  has(
    gameId: string,
  ): boolean {
    return this.profiles.has(
      gameId,
    );
  }

  /**
   * Remove a game's graphics configuration.
   *
   * This only removes the in-memory graphics profile.
   */
  remove(
    gameId: string,
  ): boolean {
    return this.profiles.delete(
      gameId,
    );
  }

  /**
   * Validate a game's graphics configuration.
   */
  validate(
    gameId: string,
  ): MacGraphicsValidationResult {
    const profile =
      this.profiles.get(
        gameId,
      );

    if (!profile) {
      return {
        valid: false,
        errors: [
          "Graphics profile was not found.",
        ],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    const backend =
      profile
        .getBackend()
        .trim();

    if (!backend) {
      errors.push(
        "Graphics backend is not configured.",
      );
    }

    if (
      profile.isDxvkEnabled() &&
      !profile.getDxvkVersion()
    ) {
      warnings.push(
        "DXVK is enabled but no DXVK version is selected.",
      );
    }

    if (
      profile.isVkd3dEnabled() &&
      !profile.getVkd3dVersion()
    ) {
      warnings.push(
        "VKD3D is enabled but no VKD3D version is selected.",
      );
    }

    return {
      valid:
        errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Export a game's graphics configuration.
   */
  export(
    gameId: string,
  ):
    | MacGameCompatibilityProfile["graphics"]
    | undefined {
    return this.profiles
      .get(gameId)
      ?.get();
  }

  /**
   * Replace a game's graphics configuration.
   */
  replace(
    gameId: string,
    graphics:
      MacGameCompatibilityProfile["graphics"],
  ): boolean {
    const profile =
      this.profiles.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.replace(
      graphics,
    );

    return true;
  }

  /**
   * Return every registered graphics profile.
   */
  getAll(): MacGraphicsProfile[] {
    return Array.from(
      this.profiles.values(),
    );
  }

  /**
   * Clear all in-memory graphics profiles.
   *
   * This does not change files or runtime settings.
   */
  clear(): void {
    this.profiles.clear();
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for per-game graphics compatibility.
 *
 * The manager keeps graphics configuration isolated to the
 * individual game and delegates configuration behavior to
 * MacGraphicsProfile.
 */

import {
  MacGameCompatibilityProfile,
  MacGraphicsConfiguration,
} from "../manager/MacCompatibilityTypes";

import { MacGraphicsProfile } from "./MacGraphicsProfile";

export class MacGraphicsManager {
  private readonly profiles = new Map<
    string,
    MacGraphicsProfile
  >();

  /**
   * Create or replace the graphics profile for a game.
   */
  register(
    gameId: string,
    configuration: MacGraphicsConfiguration,
  ): MacGraphicsProfile {
    const profile =
      new MacGraphicsProfile(
        configuration,
      );

    this.profiles.set(
      gameId,
      profile,
    );

    return profile;
  }

  /**
   * Create a graphics profile from an existing game
   * compatibility profile.
   */
  registerFromGameProfile(
    gameProfile: MacGameCompatibilityProfile,
  ): MacGraphicsProfile {
    return this.register(
      gameProfile.gameId,
      gameProfile.graphics,
    );
  }

  /**
   * Get a game's graphics profile.
   */
  get(
    gameId: string,
  ): MacGraphicsProfile | undefined {
    return this.profiles.get(gameId);
  }

  /**
   * Check whether graphics configuration exists.
   */
  has(
    gameId: string,
  ): boolean {
    return this.profiles.has(
      gameId,
    );
  }

  /**
   * Remove a game's graphics profile.
   *
   * This only removes the in-memory graphics configuration.
   * It does not delete files from disk.
   */
  remove(
    gameId: string,
  ): boolean {
    return this.profiles.delete(
      gameId,
    );
  }

  /**
   * Return all registered graphics profiles.
   */
  getAll(): Map<
    string,
    MacGraphicsProfile
  > {
    return new Map(
      this.profiles,
    );
  }

  /**
   * Update a game's complete graphics configuration.
   */
  update(
    gameId: string,
    configuration: MacGraphicsConfiguration,
  ): boolean {
    const profile =
      this.profiles.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setConfiguration(
      configuration,
    );

    return true;
  }

  /**
   * Validate a game's graphics configuration.
   */
  isValid(
    gameId: string,
  ): boolean {
    const profile =
      this.profiles.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    return profile.isValid();
  }

  /**
   * Clear every registered graphics profile.
   *
   * This does not delete any configuration files.
   */
  clear(): void {
    this.profiles.clear();
  }

  /**
   * Return the number of registered graphics profiles.
   */
  count(): number {
    return this.profiles.size;
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Coordinates per-game graphics configurations.
 *
 * The manager owns the collection of graphics profiles,
 * while MacGraphicsProfile handles individual configuration.
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
   * Create and register a graphics profile for a game.
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
   * Register graphics settings directly from a game profile.
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
   * Retrieve a game's graphics profile.
   */
  get(
    gameId: string,
  ): MacGraphicsProfile | undefined {
    return this.profiles.get(
      gameId,
    );
  }

  /**
   * Check whether graphics settings exist for a game.
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
   * This does not modify files on disk.
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
   * Return the number of graphics profiles.
   */
  count(): number {
    return this.profiles.size;
  }

  /**
   * Apply a graphics configuration to a game profile.
   *
   * This updates the in-memory compatibility profile.
   * Persistence will be handled by the storage subsystem.
   */
  applyToGameProfile(
    gameProfile: MacGameCompatibilityProfile,
  ): boolean {
    const graphicsProfile =
      this.get(
        gameProfile.gameId,
      );

    if (!graphicsProfile) {
      return false;
    }

    gameProfile.graphics =
      graphicsProfile.getConfiguration();

    return true;
  }

  /**
   * Remove every registered graphics profile.
   *
   * This only clears the manager's in-memory state.
   */
  clear(): void {
    this.profiles.clear();
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Persistent registry for Windows game compatibility profiles.
 *
 * The registry is responsible for organizing profiles.
 * File-system persistence will be connected later through
 * the storage subsystem.
 */

import {
  CompatibilityStatus,
  MacGameCompatibilityProfile,
} from "./MacCompatibilityTypes";

export class MacCompatibilityRegistry {
  private readonly profiles = new Map<
    string,
    MacGameCompatibilityProfile
  >();

  /**
   * Add a new game profile to the registry.
   */
  add(profile: MacGameCompatibilityProfile): void {
    if (this.profiles.has(profile.gameId)) {
      throw new Error(
        `A compatibility profile already exists for game "${profile.gameId}".`,
      );
    }

    this.profiles.set(profile.gameId, profile);
  }

  /**
   * Add or replace an existing game profile.
   */
  upsert(profile: MacGameCompatibilityProfile): void {
    this.profiles.set(profile.gameId, profile);
  }

  /**
   * Retrieve a game profile by its stable ID.
   */
  get(gameId: string): MacGameCompatibilityProfile | undefined {
    return this.profiles.get(gameId);
  }

  /**
   * Check whether a game exists in the registry.
   */
  has(gameId: string): boolean {
    return this.profiles.has(gameId);
  }

  /**
   * Remove a game profile from the registry.
   *
   * This does NOT delete the game's files.
   */
  remove(gameId: string): boolean {
    return this.profiles.delete(gameId);
  }

  /**
   * Return every registered game profile.
   */
  getAll(): MacGameCompatibilityProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Return the number of registered games.
   */
  count(): number {
    return this.profiles.size;
  }

  /**
   * Find games matching a compatibility status.
   */
  findByStatus(
    status: CompatibilityStatus,
  ): MacGameCompatibilityProfile[] {
    return this.getAll().filter(
      (profile) => profile.status === status,
    );
  }

  /**
   * Find a game by its human-readable name.
   */
  findByGameName(
    gameName: string,
  ): MacGameCompatibilityProfile | undefined {
    const normalizedName = gameName.trim().toLowerCase();

    return this.getAll().find(
      (profile) =>
        profile.gameName.trim().toLowerCase() === normalizedName,
    );
  }

  /**
   * Remove all profiles from the in-memory registry.
   *
   * This does NOT delete any game data from disk.
   */
  clear(): void {
    this.profiles.clear();
  }
}

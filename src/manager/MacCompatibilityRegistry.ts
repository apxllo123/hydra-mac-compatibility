/**
 * Hydra Mac Compatibility
 *
 * In-memory registry for Windows game compatibility profiles.
 *
 * The registry provides organized access to profiles.
 * Persistent file-system storage will be handled by the
 * storage subsystem.
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
   * Add a new game profile.
   *
   * Throws if a profile with the same game ID already exists.
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
   * Retrieve a profile by its stable game ID.
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
   * Remove a profile from the registry.
   *
   * This does NOT delete any files or game data.
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
   * Return the number of registered profiles.
   */
  count(): number {
    return this.profiles.size;
  }

  /**
   * Find all games with a particular compatibility status.
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
   *
   * Matching is case-insensitive and ignores leading/trailing
   * whitespace.
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
   * Remove every profile from the in-memory registry.
   *
   * This does NOT delete any game data from disk.
   */
  clear(): void {
    this.profiles.clear();
  }
}

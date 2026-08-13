/**
 * Hydra Mac Compatibility
 *
 * Stores and retrieves Windows game compatibility profiles.
 *
 * The store is intentionally separated from the game profile
 * itself so persistence can later be connected to the storage
 * subsystem without changing the rest of the compatibility code.
 */

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacGameProfile } from "./MacGameProfile";

export class MacGameProfileStore {
  private readonly profiles = new Map<
    string,
    MacGameProfile
  >();

  /**
   * Create and store a new game profile.
   */
  create(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    if (
      this.profiles.has(
        profile.gameId,
      )
    ) {
      throw new Error(
        `A game profile already exists for "${profile.gameId}".`,
      );
    }

    const gameProfile =
      new MacGameProfile(
        profile,
      );

    this.profiles.set(
      profile.gameId,
      gameProfile,
    );

    return gameProfile;
  }

  /**
   * Add or replace an existing profile.
   */
  upsert(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    const gameProfile =
      new MacGameProfile(
        profile,
      );

    this.profiles.set(
      profile.gameId,
      gameProfile,
    );

    return gameProfile;
  }

  /**
   * Retrieve a profile by game ID.
   */
  get(
    gameId: string,
  ): MacGameProfile | undefined {
    return this.profiles.get(
      gameId,
    );
  }

  /**
   * Check whether a profile exists.
   */
  has(
    gameId: string,
  ): boolean {
    return this.profiles.has(
      gameId,
    );
  }

  /**
   * Remove a profile from the store.
   *
   * This only removes the in-memory profile.
   * It does not delete game files.
   */
  remove(
    gameId: string,
  ): boolean {
    return this.profiles.delete(
      gameId,
    );
  }

  /**
   * Return every stored game profile.
   */
  getAll(): MacGameProfile[] {
    return Array.from(
      this.profiles.values(),
    );
  }

  /**
   * Return the number of stored profiles.
   */
  count(): number {
    return this.profiles.size;
  }

  /**
   * Find a profile by human-readable game name.
   */
  findByGameName(
    gameName: string,
  ): MacGameProfile | undefined {
    const normalizedName =
      gameName
        .trim()
        .toLowerCase();

    return this.getAll().find(
      (profile) =>
        profile
          .getGameName()
          .trim()
          .toLowerCase() ===
        normalizedName,
    );
  }

  /**
   * Export all profiles as plain compatibility objects.
   *
   * This is useful for the storage subsystem.
   */
  exportAll(): MacGameCompatibilityProfile[] {
    return this.getAll().map(
      (profile) =>
        profile.getProfile(),
    );
  }

  /**
   * Clear every stored profile.
   *
   * This does not delete files from disk.
   */
  clear(): void {
    this.profiles.clear();
  }
}

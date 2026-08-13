/**
 * Hydra Mac Compatibility
 *
 * In-memory store for game compatibility profiles.
 *
 * This class manages profile storage independently from the
 * filesystem. Persistent storage will be connected through
 * the storage subsystem later.
 */

import {
  CompatibilityStatus,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacGameProfile } from "./MacGameProfile";

export class MacGameProfileStore {
  private readonly profiles = new Map<
    string,
    MacGameProfile
  >();

  /**
   * Add a new game profile.
   */
  add(
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
   * Retrieve a game profile.
   */
  get(
    gameId: string,
  ): MacGameProfile | undefined {
    return this.profiles.get(
      gameId,
    );
  }

  /**
   * Check whether a game exists.
   */
  has(
    gameId: string,
  ): boolean {
    return this.profiles.has(
      gameId,
    );
  }

  /**
   * Remove a game profile.
   *
   * This does NOT delete files from disk.
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
   * Find profiles by compatibility status.
   */
  findByStatus(
    status: CompatibilityStatus,
  ): MacGameProfile[] {
    return this.getAll().filter(
      (profile) =>
        profile.getStatus() ===
        status,
    );
  }

  /**
   * Find a profile by its human-readable game name.
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
   * Return the number of stored profiles.
   */
  count(): number {
    return this.profiles.size;
  }

  /**
   * Remove every in-memory profile.
   *
   * This does NOT delete game data from disk.
   */
  clear(): void {
    this.profiles.clear();
  }
}

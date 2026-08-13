/**
 * Hydra Mac Compatibility
 *
 * Persistent storage coordinator for game compatibility profiles.
 *
 * The store owns profile persistence.
 * It does not perform Wine, dependency, graphics, diagnostic,
 * or repair operations.
 */

import type {
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
   *
   * Throws when a profile with the same game ID already exists.
   */
  add(
    profile: MacGameProfile,
  ): void {
    const gameId =
      profile.getGameId();

    if (this.profiles.has(gameId)) {
      throw new Error(
        `A game profile already exists for "${gameId}".`,
      );
    }

    this.profiles.set(
      gameId,
      profile,
    );
  }

  /**
   * Add or replace a game profile.
   */
  upsert(
    profile: MacGameProfile,
  ): void {
    this.profiles.set(
      profile.getGameId(),
      profile,
    );
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
   * Check whether a game profile exists.
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
   * It does NOT delete files from disk.
   */
  remove(
    gameId: string,
  ): boolean {
    return this.profiles.delete(
      gameId,
    );
  }

  /**
   * Return every stored profile.
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
   * Find profiles by compatibility status.
   */
  findByStatus(
    status: MacGameCompatibilityProfile["status"],
  ): MacGameProfile[] {
    return this.getAll().filter(
      (profile) =>
        profile.getStatus() ===
        status,
    );
  }

  /**
   * Export one profile as a plain object.
   *
   * This is the format the storage subsystem can serialize
   * to compatibility.json.
   */
  export(
    gameId: string,
  ):
    | MacGameCompatibilityProfile
    | undefined {
    return this.profiles
      .get(gameId)
      ?.getProfile();
  }

  /**
   * Export every stored profile.
   */
  exportAll(): MacGameCompatibilityProfile[] {
    return this.getAll().map(
      (profile) =>
        profile.getProfile(),
    );
  }

  /**
   * Import a plain compatibility profile.
   *
   * This is intended for loading compatibility.json data.
   */
  import(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    const gameProfile =
      new MacGameProfile({
        gameId:
          profile.gameId,

        gameName:
          profile.gameName,

        gamePath:
          profile.gamePath,

        compatibilityPath:
          profile.compatibilityPath,

        wine:
          profile.wine,

        graphics:
          profile.graphics,

        dependencies:
          profile.dependencies,

        status:
          profile.status,

        backups:
          profile.backups,

        lastKnownGoodConfiguration:
          profile.lastKnownGoodConfiguration,

        notes:
          profile.notes,
      });

    gameProfile.setLastTested(
      profile.lastTested ??
        "",
    );

    if (
      profile.lastDiagnosed
    ) {
      gameProfile.setLastDiagnosed(
        profile.lastDiagnosed,
      );
    }

    if (
      profile.lastRepaired
    ) {
      gameProfile.setLastRepaired(
        profile.lastRepaired,
      );
    }

    this.upsert(
      gameProfile,
    );

    return gameProfile;
  }

  /**
   * Remove every in-memory profile.
   *
   * This does NOT delete persisted files.
   */
  clear(): void {
    this.profiles.clear();
  }
}

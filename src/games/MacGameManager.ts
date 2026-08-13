/**
 * Hydra Mac Compatibility
 *
 * Coordinates Windows game compatibility profiles.
 *
 * The game manager is responsible for game-level operations.
 * It does not directly manage Wine, dependencies, graphics,
 * diagnostics, or filesystem persistence.
 */

import {
  CompatibilityStatus,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacGameProfile } from "./MacGameProfile";
import { MacGameProfileStore } from "./MacGameProfileStore";

export class MacGameManager {
  private readonly store: MacGameProfileStore;

  constructor(
    store = new MacGameProfileStore(),
  ) {
    this.store = store;
  }

  /**
   * Create a new game compatibility profile.
   */
  createProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    return this.store.create(
      profile,
    );
  }

  /**
   * Add or replace a game compatibility profile.
   */
  upsertProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    return this.store.upsert(
      profile,
    );
  }

  /**
   * Retrieve a game's compatibility profile.
   */
  getProfile(
    gameId: string,
  ): MacGameProfile | undefined {
    return this.store.get(
      gameId,
    );
  }

  /**
   * Check whether a game has a compatibility profile.
   */
  hasProfile(
    gameId: string,
  ): boolean {
    return this.store.has(
      gameId,
    );
  }

  /**
   * Remove a game's compatibility profile.
   *
   * This does not delete the game's files.
   */
  removeProfile(
    gameId: string,
  ): boolean {
    return this.store.remove(
      gameId,
    );
  }

  /**
   * Return all registered game profiles.
   */
  getProfiles(): MacGameProfile[] {
    return this.store.getAll();
  }

  /**
   * Return the number of registered games.
   */
  getProfileCount(): number {
    return this.store.count();
  }

  /**
   * Find a game by its human-readable name.
   */
  findByGameName(
    gameName: string,
  ): MacGameProfile | undefined {
    return this.store.findByGameName(
      gameName,
    );
  }

  /**
   * Find games by compatibility status.
   */
  findByStatus(
    status: CompatibilityStatus,
  ): MacGameProfile[] {
    return this.getProfiles().filter(
      (profile) =>
        profile.getStatus() === status,
    );
  }

  /**
   * Update a game's compatibility status.
   */
  setStatus(
    gameId: string,
    status: CompatibilityStatus,
  ): boolean {
    const profile =
      this.getProfile(gameId);

    if (!profile) {
      return false;
    }

    profile.setStatus(
      status,
    );

    return true;
  }

  /**
   * Export all profiles for persistence.
   */
  exportProfiles(): MacGameCompatibilityProfile[] {
    return this.store.exportAll();
  }

  /**
   * Get the underlying profile store.
   *
   * Exposed so the storage layer can be connected later
   * without putting filesystem logic inside this manager.
   */
  getStore(): MacGameProfileStore {
    return this.store;
  }

  /**
   * Clear all in-memory profiles.
   *
   * This does not delete game files.
   */
  clear(): void {
    this.store.clear();
  }
}

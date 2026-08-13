/**
 * Hydra Mac Compatibility
 *
 * Game-level coordinator for Windows games running through
 * the Hydra Mac Compatibility system.
 *
 * MacGameManager is responsible for creating, registering,
 * retrieving, updating, and removing game compatibility profiles.
 *
 * It does NOT directly manage Wine, dependencies, graphics,
 * diagnostics, or repair logic.
 *
 * Those responsibilities belong to their respective systems.
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
    store: MacGameProfileStore = new MacGameProfileStore(),
  ) {
    this.store = store;
  }

  /**
   * Create a new compatibility profile for a Windows game.
   *
   * The profile starts in an unconfigured state and can
   * be configured by the compatibility subsystems later.
   */
  createProfile(
    gameId: string,
    gameName: string,
    gamePath: string,
  ): MacGameCompatibilityProfile {
    if (this.store.exists(gameId)) {
      throw new Error(
        `A compatibility profile already exists for game "${gameId}".`,
      );
    }

    const profile = new MacGameProfile({
      gameId,
      gameName,
      gamePath,
    });

    const compatibilityProfile = profile.toProfile();

    this.store.save(compatibilityProfile);

    return compatibilityProfile;
  }

  /**
   * Retrieve a game's compatibility profile.
   */
  getProfile(
    gameId: string,
  ): MacGameCompatibilityProfile | undefined {
    return this.store.load(gameId);
  }

  /**
   * Retrieve a game profile as a MacGameProfile model.
   */
  getProfileModel(
    gameId: string,
  ): MacGameProfile | undefined {
    return this.store.loadModel(gameId);
  }

  /**
   * Check whether a game has a compatibility profile.
   */
  hasProfile(gameId: string): boolean {
    return this.store.exists(gameId);
  }

  /**
   * Return every registered game profile.
   */
  getAllProfiles(): MacGameCompatibilityProfile[] {
    return this.store.getAll();
  }

  /**
   * Return all profiles matching a compatibility status.
   */
  getProfilesByStatus(
    status: CompatibilityStatus,
  ): MacGameCompatibilityProfile[] {
    return this.store
      .getAll()
      .filter((profile) => profile.status === status);
  }

  /**
   * Update and save an existing profile.
   */
  updateProfile(
    profile: MacGameCompatibilityProfile,
  ): void {
    if (!this.store.exists(profile.gameId)) {
      throw new Error(
        `Cannot update missing compatibility profile for game "${profile.gameId}".`,
      );
    }

    this.store.save(profile);
  }

  /**
   * Remove a game's compatibility profile.
   *
   * IMPORTANT:
   * This only removes the profile from the profile store.
   * It does NOT delete the game's files, Wine prefix,
   * backups, logs, or compatibility directory.
   */
  removeProfile(gameId: string): boolean {
    return this.store.delete(gameId);
  }

  /**
   * Return the number of managed games.
   */
  getGameCount(): number {
    return this.store.count();
  }

  /**
   * Clear all profiles from the store.
   *
   * This is intentionally limited to profile data.
   * It does NOT delete files from disk.
   */
  clearProfiles(): void {
    this.store.clear();
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Persistent storage coordination for game compatibility profiles.
 *
 * This class sits between the game profile model and the filesystem.
 * The actual filesystem implementation will be connected as the
 * project is integrated into Hydra.
 */

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacGameProfile } from "./MacGameProfile";

export class MacGameProfileStore {
  private readonly profiles = new Map<
    string,
    MacGameCompatibilityProfile
  >();

  /**
   * Save a game profile to the in-memory store.
   *
   * Persistent JSON storage will be connected later.
   */
  save(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profiles.set(
      profile.gameId,
      this.cloneProfile(profile),
    );
  }

  /**
   * Save a MacGameProfile model.
   */
  saveModel(
    profile: MacGameProfile,
  ): void {
    this.save(profile.toProfile());
  }

  /**
   * Load a game profile by its stable game ID.
   */
  load(
    gameId: string,
  ): MacGameCompatibilityProfile | undefined {
    const profile = this.profiles.get(gameId);

    if (!profile) {
      return undefined;
    }

    return this.cloneProfile(profile);
  }

  /**
   * Load a game profile as a MacGameProfile model.
   */
  loadModel(
    gameId: string,
  ): MacGameProfile | undefined {
    const profile = this.load(gameId);

    if (!profile) {
      return undefined;
    }

    return new MacGameProfile(profile);
  }

  /**
   * Check whether a stored profile exists.
   */
  exists(gameId: string): boolean {
    return this.profiles.has(gameId);
  }

  /**
   * Delete a stored profile.
   *
   * This only removes the profile from the store.
   * It does NOT delete the game's compatibility directory.
   */
  delete(gameId: string): boolean {
    return this.profiles.delete(gameId);
  }

  /**
   * Return all stored profiles.
   */
  getAll(): MacGameCompatibilityProfile[] {
    return Array.from(this.profiles.values()).map(
      (profile) => this.cloneProfile(profile),
    );
  }

  /**
   * Return the number of stored profiles.
   */
  count(): number {
    return this.profiles.size;
  }

  /**
   * Remove every stored profile.
   */
  clear(): void {
    this.profiles.clear();
  }

  /**
   * Create a safe copy of a profile.
   *
   * This prevents callers from accidentally modifying the
   * stored profile without explicitly saving the changes.
   */
  private cloneProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,

      wine: {
        ...profile.wine,
      },

      graphics: {
        ...profile.graphics,

        environmentVariables: {
          ...profile.graphics.environmentVariables,
        },

        compatibilityFlags: [
          ...profile.graphics.compatibilityFlags,
        ],
      },

      dependencies: profile.dependencies.map(
        (dependency) => ({
          ...dependency,
        }),
      ),

      backups: profile.backups.map(
        (backup) => ({
          ...backup,
        }),
      ),

      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration
          ? {
              ...profile.lastKnownGoodConfiguration,

              wine:
                profile
                  .lastKnownGoodConfiguration
                  .wine
                  ? {
                      ...profile
                        .lastKnownGoodConfiguration
                        .wine,
                    }
                  : undefined,

              graphics:
                profile
                  .lastKnownGoodConfiguration
                  .graphics
                  ? {
                      ...profile
                        .lastKnownGoodConfiguration
                        .graphics,

                      environmentVariables: {
                        ...profile
                          .lastKnownGoodConfiguration
                          .graphics
                          .environmentVariables,
                      },

                      compatibilityFlags: [
                        ...profile
                          .lastKnownGoodConfiguration
                          .graphics
                          .compatibilityFlags,
                      ],
                    }
                  : undefined,

              dependencies:
                profile
                  .lastKnownGoodConfiguration
                  .dependencies
                  .map(
                    (dependency) => ({
                      ...dependency,
                    }),
                  ),
            }
          : undefined,
    };
  }
}

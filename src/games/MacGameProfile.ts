/**
 * Hydra Mac Compatibility
 *
 * Runtime representation of a single Windows game's
 * compatibility profile.
 *
 * One instance represents one game.
 * Game-specific configuration must remain isolated.
 */

import {
  MacGameCompatibilityProfile,
  CompatibilityStatus,
} from "../manager/MacCompatibilityTypes";

export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;

  constructor(
    profile: MacGameCompatibilityProfile,
  ) {
    this.profile = this.cloneProfile(
      profile,
    );
  }

  /**
   * Return the complete compatibility profile.
   */
  getProfile(): MacGameCompatibilityProfile {
    return this.cloneProfile(
      this.profile,
    );
  }

  /**
   * Return the game's stable ID.
   */
  getGameId(): string {
    return this.profile.gameId;
  }

  /**
   * Return the human-readable game name.
   */
  getGameName(): string {
    return this.profile.gameName;
  }

  /**
   * Return the current compatibility status.
   */
  getStatus(): CompatibilityStatus {
    return this.profile.status;
  }

  /**
   * Update the compatibility status.
   */
  setStatus(
    status: CompatibilityStatus,
  ): void {
    this.profile.status =
      status;
  }

  /**
   * Update the game installation path.
   */
  setGamePath(
    gamePath: string,
  ): void {
    this.profile.gamePath =
      gamePath;
  }

  /**
   * Update the game's Wine configuration.
   */
  setWineConfiguration(
    wine: MacGameCompatibilityProfile["wine"],
  ): void {
    this.profile.wine = {
      ...wine,
    };
  }

  /**
   * Update the game's graphics configuration.
   */
  setGraphicsConfiguration(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): void {
    this.profile.graphics = {
      ...graphics,

      environmentVariables: {
        ...graphics.environmentVariables,
      },

      compatibilityFlags: [
        ...graphics.compatibilityFlags,
      ],
    };
  }

  /**
   * Update the dependency list.
   */
  setDependencies(
    dependencies: MacGameCompatibilityProfile["dependencies"],
  ): void {
    this.profile.dependencies =
      dependencies.map(
        (dependency) => ({
          ...dependency,
        }),
      );
  }

  /**
   * Record the time a compatibility test was run.
   */
  setLastTested(
    timestamp: string,
  ): void {
    this.profile.lastTested =
      timestamp;
  }

  /**
   * Store the current configuration as the
   * last known good configuration.
   */
  saveKnownGoodConfiguration(): void {
    this.profile.lastKnownGoodConfiguration =
      this.cloneProfile(
        this.profile,
      );
  }

  /**
   * Return the last known good configuration.
   */
  getKnownGoodConfiguration():
    | MacGameCompatibilityProfile
    | undefined {
    if (
      !this.profile.lastKnownGoodConfiguration
    ) {
      return undefined;
    }

    return this.cloneProfile(
      this.profile.lastKnownGoodConfiguration,
    );
  }

  /**
   * Replace the current profile.
   */
  updateProfile(
    profile: MacGameCompatibilityProfile,
  ): void {
    if (
      profile.gameId !==
      this.profile.gameId
    ) {
      throw new Error(
        "A game profile cannot be replaced with a different game.",
      );
    }

    this.profile =
      this.cloneProfile(
        profile,
      );
  }

  /**
   * Create a safe copy of a profile.
   */
  private cloneProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,

      wine: profile.wine
        ? {
            ...profile.wine,
          }
        : profile.wine,

      graphics: profile.graphics
        ? {
            ...profile.graphics,

            environmentVariables: {
              ...profile.graphics
                .environmentVariables,
            },

            compatibilityFlags: [
              ...profile.graphics
                .compatibilityFlags,
            ],
          }
        : profile.graphics,

      dependencies:
        profile.dependencies?.map(
          (dependency) => ({
            ...dependency,
          }),
        ),

      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration
          ? this.cloneProfile(
              profile.lastKnownGoodConfiguration,
            )
          : undefined,
    };
  }
}

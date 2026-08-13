/**
 * Hydra Mac Compatibility
 *
 * Represents one Windows game's compatibility profile.
 *
 * A profile is the central per-game record containing the
 * configuration Hydra needs to remember what worked.
 */

import {
  CompatibilityStatus,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;

  constructor(
    profile: MacGameCompatibilityProfile,
  ) {
    this.profile = this.clone(profile);
  }

  /**
   * Return the complete game compatibility profile.
   */
  getProfile(): MacGameCompatibilityProfile {
    return this.clone(this.profile);
  }

  /**
   * Return the game's stable ID.
   */
  getGameId(): string {
    return this.profile.gameId;
  }

  /**
   * Return the game's human-readable name.
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
    this.profile.status = status;
  }

  /**
   * Return the installed game path.
   */
  getGamePath(): string {
    return this.profile.gamePath;
  }

  /**
   * Update the installed game path.
   */
  setGamePath(
    gamePath: string,
  ): void {
    this.profile.gamePath =
      gamePath;
  }

  /**
   * Return the configured Wine information.
   */
  getWine() {
    return this.profile.wine;
  }

  /**
   * Update the Wine configuration.
   */
  setWine(
    wine: MacGameCompatibilityProfile["wine"],
  ): void {
    this.profile.wine = wine
      ? { ...wine }
      : undefined;
  }

  /**
   * Return the graphics configuration.
   */
  getGraphics() {
    return this.profile.graphics;
  }

  /**
   * Update the graphics configuration.
   */
  setGraphics(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): void {
    this.profile.graphics = {
      ...graphics,
      dxvk: {
        ...graphics.dxvk,
      },
      vkd3d: {
        ...graphics.vkd3d,
      },
      environmentVariables: {
        ...graphics.environmentVariables,
      },
      compatibilityFlags: [
        ...graphics.compatibilityFlags,
      ],
    };
  }

  /**
   * Return a copy of the dependency list.
   */
  getDependencies() {
    return (this.profile.dependencies ?? [])
      .map((dependency) => ({
        ...dependency,
      }));
  }

  /**
   * Return the timestamp of the last compatibility test.
   */
  getLastTested(): string | undefined {
    return this.profile.lastTested;
  }

  /**
   * Update the last-tested timestamp.
   */
  setLastTested(
    timestamp: string,
  ): void {
    this.profile.lastTested =
      timestamp;
  }

  /**
   * Replace the entire profile.
   */
  replace(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profile =
      this.clone(profile);
  }

  /**
   * Create a safe copy of the profile.
   */
  private clone(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,

      wine: profile.wine
        ? {
            ...profile.wine,
          }
        : undefined,

      graphics: {
        ...profile.graphics,

        dxvk: {
          ...profile.graphics.dxvk,
        },

        vkd3d: {
          ...profile.graphics.vkd3d,
        },

        environmentVariables: {
          ...profile.graphics
            .environmentVariables,
        },

        compatibilityFlags: [
          ...profile.graphics
            .compatibilityFlags,
        ],
      },

      dependencies: (
        profile.dependencies ?? []
      ).map((dependency) => ({
        ...dependency,
      })),

      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration
          ? {
              ...profile.lastKnownGoodConfiguration,
            }
          : undefined,
    };
  }
}

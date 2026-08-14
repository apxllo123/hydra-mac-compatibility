/**
 * Hydra Mac Compatibility
 *
 * Represents one Windows game's compatibility profile.
 *
 * A profile is the central per-game record containing the
 * configuration Hydra needs to remember what worked.
 */

import type {
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
    this.profile.gamePath = gamePath;
  }

  /**
   * Return the configured Wine information.
   */
  getWine(): MacGameCompatibilityProfile["wine"] {
    return this.profile.wine;
  }

  /**
   * Update the Wine configuration.
   */
  setWine(
    wine: MacGameCompatibilityProfile["wine"],
  ): void {
    this.profile.wine = {
      ...wine,
      environmentVariables: wine.environmentVariables
        ? { ...wine.environmentVariables }
        : undefined,
    };
  }

  /**
   * Return the graphics configuration.
   */
  getGraphics(): MacGameCompatibilityProfile["graphics"] {
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
    return this.profile.dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
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
    this.profile.lastTested = timestamp;
  }

  /**
   * Replace the entire profile.
   */
  replace(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profile = this.clone(profile);
  }

  /**
   * Create a safe copy of the profile.
   */
  private clone(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,

      wine: {
        ...profile.wine,
        environmentVariables:
          profile.wine.environmentVariables
            ? {
                ...profile.wine.environmentVariables,
              }
            : undefined,
      },

      graphics: {
        ...profile.graphics,

        dxvk: {
          ...profile.graphics.dxvk,
        },

        vkd3d: {
          ...profile.graphics.vkd3d,
        },

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
              dependencies:
                profile.lastKnownGoodConfiguration
                  .dependencies.map(
                    (dependency) => ({
                      ...dependency,
                    }),
                  ),
              wine:
                profile.lastKnownGoodConfiguration.wine
                  ? {
                      ...profile.lastKnownGoodConfiguration
                        .wine,
                    }
                  : undefined,
              graphics:
                profile.lastKnownGoodConfiguration.graphics
                  ? {
                      ...profile.lastKnownGoodConfiguration
                        .graphics,
                      dxvk: {
                        ...profile.lastKnownGoodConfiguration
                          .graphics.dxvk,
                      },
                      vkd3d: {
                        ...profile.lastKnownGoodConfiguration
                          .graphics.vkd3d,
                      },
                      environmentVariables: {
                        ...profile.lastKnownGoodConfiguration
                          .graphics.environmentVariables,
                      },
                      compatibilityFlags: [
                        ...profile.lastKnownGoodConfiguration
                          .graphics.compatibilityFlags,
                      ],
                    }
                  : undefined,
            }
          : undefined,
    };
  }
}

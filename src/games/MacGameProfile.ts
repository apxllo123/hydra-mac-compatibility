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
} from "../manager/MacCompatibilityTypes.js";

export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;

  constructor(profile: MacGameCompatibilityProfile) {
    this.profile = this.clone(profile);
  }

  getProfile(): MacGameCompatibilityProfile {
    return this.clone(this.profile);
  }

  getGameId(): string {
    return this.profile.gameId;
  }

  getGameName(): string {
    return this.profile.gameName;
  }

  getStatus(): CompatibilityStatus {
    return this.profile.status;
  }

  setStatus(status: CompatibilityStatus): void {
    this.profile.status = status;
  }

  getGamePath(): string {
    return this.profile.gamePath;
  }

  setGamePath(gamePath: string): void {
    this.profile.gamePath = gamePath;
  }

  getExecutable(): string {
    return this.profile.executable;
  }

  setExecutable(executable: string): void {
    this.profile.executable = executable;
  }

  getWine(): MacGameCompatibilityProfile["wine"] {
    return {
      ...this.profile.wine,
      environmentVariables: this.profile.wine.environmentVariables
        ? { ...this.profile.wine.environmentVariables }
        : undefined,
    };
  }

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

  getGraphics(): MacGameCompatibilityProfile["graphics"] {
    return {
      ...this.profile.graphics,
      dxvk: {
        ...this.profile.graphics.dxvk,
      },
      vkd3d: {
        ...this.profile.graphics.vkd3d,
      },
      environmentVariables: {
        ...this.profile.graphics.environmentVariables,
      },
      compatibilityFlags: [
        ...this.profile.graphics.compatibilityFlags,
      ],
    };
  }

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

  getDependencies(): MacGameCompatibilityProfile["dependencies"] {
    return this.profile.dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
  }

  setDependencies(
    dependencies: MacGameCompatibilityProfile["dependencies"],
  ): void {
    this.profile.dependencies = dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
  }

  getBackups(): MacGameCompatibilityProfile["backups"] {
    return this.profile.backups.map(
      (backup) => ({
        ...backup,
      }),
    );
  }

  getLastTested(): string | undefined {
    return this.profile.lastTested;
  }

  setLastTested(timestamp: string): void {
    this.profile.lastTested = timestamp;
  }

  getLastDiagnosed(): string | undefined {
    return this.profile.lastDiagnosed;
  }

  setLastDiagnosed(timestamp: string): void {
    this.profile.lastDiagnosed = timestamp;
  }

  getLastRepaired(): string | undefined {
    return this.profile.lastRepaired;
  }

  setLastRepaired(timestamp: string): void {
    this.profile.lastRepaired = timestamp;
  }

  getLastUpdated(): string | undefined {
    return this.profile.lastUpdated;
  }

  setLastUpdated(timestamp: string): void {
    this.profile.lastUpdated = timestamp;
  }

  getNotes(): string | undefined {
    return this.profile.notes;
  }

  setNotes(notes: string | undefined): void {
    this.profile.notes = notes;
  }

  replace(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profile = this.clone(profile);
  }

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
                      ...profile.lastKnownGoodConfiguration.wine,
                      environmentVariables:
                        profile.lastKnownGoodConfiguration
                          .wine.environmentVariables
                          ? {
                              ...profile.lastKnownGoodConfiguration
                                .wine
                                .environmentVariables,
                            }
                          : undefined,
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

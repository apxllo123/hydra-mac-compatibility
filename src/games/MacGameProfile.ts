/**
 * Hydra Mac Compatibility
 *
 * Represents one Windows game's compatibility profile.
 */

import type {
  CompatibilityStatus,
  GameDependency,
  GraphicsConfiguration,
  MacGameCompatibilityProfile,
  WineConfiguration,
} from "../manager/MacCompatibilityTypes.js";

export interface MacGameProfileOptions {
  gameId: string;
  gameName: string;
  gamePath: string;
  executable: string;
  compatibilityPath: string;
  status?: CompatibilityStatus;
  wine: WineConfiguration;
  graphics: GraphicsConfiguration;
  dependencies?: GameDependency[];
  backups?: MacGameCompatibilityProfile["backups"];
  lastTested?: string;
  lastDiagnosed?: string;
  lastRepaired?: string;
  lastUpdated?: string;
  lastKnownGoodConfiguration?: MacGameCompatibilityProfile["lastKnownGoodConfiguration"];
  notes?: string;
}

export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;

  constructor(
    profile: MacGameCompatibilityProfile | MacGameProfileOptions,
  ) {
    this.profile = this.clone({
      gameId: profile.gameId,
      gameName: profile.gameName,
      gamePath: profile.gamePath,
      executable: profile.executable,
      compatibilityPath: profile.compatibilityPath,
      status: profile.status ?? "unknown",
      wine: profile.wine,
      graphics: profile.graphics,
      dependencies: profile.dependencies ?? [],
      backups: profile.backups ?? [],
      lastTested: profile.lastTested,
      lastDiagnosed: profile.lastDiagnosed,
      lastRepaired: profile.lastRepaired,
      lastUpdated: profile.lastUpdated,
      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration,
      notes: profile.notes,
    });
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

  getWine(): WineConfiguration {
    return {
      ...this.profile.wine,
      environmentVariables:
        this.profile.wine.environmentVariables
          ? {
              ...this.profile.wine.environmentVariables,
            }
          : undefined,
    };
  }

  setWine(wine: WineConfiguration): void {
    this.profile.wine = {
      ...wine,
      environmentVariables:
        wine.environmentVariables
          ? {
              ...wine.environmentVariables,
            }
          : undefined,
    };
  }

  setWineConfiguration(
    wine: WineConfiguration,
  ): void {
    this.setWine(wine);
  }

  getGraphics(): GraphicsConfiguration {
    return this.cloneGraphics(this.profile.graphics);
  }

  setGraphics(
    graphics: GraphicsConfiguration,
  ): void {
    this.profile.graphics =
      this.cloneGraphics(graphics);
  }

  setGraphicsConfiguration(
    graphics: GraphicsConfiguration,
  ): void {
    this.setGraphics(graphics);
  }

  getDependencies(): GameDependency[] {
    return this.profile.dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
  }

  setDependencies(
    dependencies: GameDependency[],
  ): void {
    this.profile.dependencies =
      dependencies.map(
        (dependency) => ({
          ...dependency,
        }),
      );
  }

  setDependency(
    dependency: GameDependency,
  ): void {
    const index =
      this.profile.dependencies.findIndex(
        (item) => item.id === dependency.id,
      );

    if (index === -1) {
      this.profile.dependencies.push({
        ...dependency,
      });
    } else {
      this.profile.dependencies[index] = {
        ...dependency,
      };
    }
  }

  removeDependency(
    dependencyId: string,
  ): boolean {
    const index =
      this.profile.dependencies.findIndex(
        (dependency) =>
          dependency.id === dependencyId,
      );

    if (index === -1) {
      return false;
    }

    this.profile.dependencies.splice(index, 1);
    return true;
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

  private cloneGraphics(
    graphics: GraphicsConfiguration,
  ): GraphicsConfiguration {
    return {
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

      graphics: this.cloneGraphics(
        profile.graphics,
      ),

      dependencies:
        profile.dependencies.map(
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
                  ? this.cloneGraphics(
                      profile.lastKnownGoodConfiguration
                        .graphics,
                    )
                  : undefined,
            }
          : undefined,
    };
  }
}

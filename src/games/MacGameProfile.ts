/**
 * Hydra Mac Compatibility
 *
 * Represents a single Windows game and its complete
 * macOS compatibility environment.
 *
 * This class is a profile model.
 * It does not perform filesystem, Wine, dependency,
 * graphics, or runtime operations.
 */

import type {
  CompatibilityBackup,
  CompatibilityStatus,
  GameDependency,
  GraphicsConfiguration,
  KnownGoodConfiguration,
  MacGameCompatibilityProfile,
  WineConfiguration,
} from "../manager/MacCompatibilityTypes";

export interface MacGameProfileOptions {
  gameId: string;
  gameName: string;
  gamePath: string;
  compatibilityPath: string;
  wine: WineConfiguration;
  graphics: GraphicsConfiguration;
  dependencies?: GameDependency[];
  status?: CompatibilityStatus;
  backups?: CompatibilityBackup[];
  lastKnownGoodConfiguration?: KnownGoodConfiguration;
  notes?: string;
}

export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;

  constructor(
    options: MacGameProfileOptions,
  ) {
    this.profile = {
      gameId: options.gameId,
      gameName: options.gameName,
      gamePath: options.gamePath,
      compatibilityPath:
        options.compatibilityPath,

      status:
        options.status ?? "unknown",

      wine: this.cloneWine(
        options.wine,
      ),

      graphics:
        this.cloneGraphics(
          options.graphics,
        ),

      dependencies:
        this.cloneDependencies(
          options.dependencies ?? [],
        ),

      backups:
        this.cloneBackups(
          options.backups ?? [],
        ),

      lastKnownGoodConfiguration:
        options.lastKnownGoodConfiguration
          ? this.cloneKnownGoodConfiguration(
              options.lastKnownGoodConfiguration,
            )
          : undefined,

      notes: options.notes,
    };
  }

  /**
   * Return a safe copy of the complete
   * compatibility profile.
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
   * Return the game's human-readable name.
   */
  getGameName(): string {
    return this.profile.gameName;
  }

  /**
   * Return the original Windows game path.
   */
  getGamePath(): string {
    return this.profile.gamePath;
  }

  /**
   * Return the compatibility data directory.
   */
  getCompatibilityPath(): string {
    return this.profile.compatibilityPath;
  }

  /**
   * Return the current Wine configuration.
   */
  getWineConfiguration(): WineConfiguration {
    return this.cloneWine(
      this.profile.wine,
    );
  }

  /**
   * Replace the Wine configuration.
   */
  setWineConfiguration(
    wine: WineConfiguration,
  ): void {
    this.profile.wine =
      this.cloneWine(wine);

    this.touch();
  }

  /**
   * Return the current graphics configuration.
   */
  getGraphicsConfiguration(): GraphicsConfiguration {
    return this.cloneGraphics(
      this.profile.graphics,
    );
  }

  /**
   * Replace the graphics configuration.
   */
  setGraphicsConfiguration(
    graphics: GraphicsConfiguration,
  ): void {
    this.profile.graphics =
      this.cloneGraphics(graphics);

    this.touch();
  }

  /**
   * Return all configured dependencies.
   */
  getDependencies(): GameDependency[] {
    return this.cloneDependencies(
      this.profile.dependencies,
    );
  }

  /**
   * Replace the dependency list.
   */
  setDependencies(
    dependencies: GameDependency[],
  ): void {
    this.profile.dependencies =
      this.cloneDependencies(
        dependencies,
      );

    this.touch();
  }

  /**
   * Add or replace a dependency.
   */
  setDependency(
    dependency: GameDependency,
  ): void {
    const index =
      this.profile.dependencies.findIndex(
        (item) =>
          item.id === dependency.id,
      );

    if (index === -1) {
      this.profile.dependencies.push(
        this.cloneDependency(
          dependency,
        ),
      );
    } else {
      this.profile.dependencies[
        index
      ] = this.cloneDependency(
        dependency,
      );
    }

    this.touch();
  }

  /**
   * Remove a dependency.
   */
  removeDependency(
    dependencyId: string,
  ): boolean {
    const index =
      this.profile.dependencies.findIndex(
        (dependency) =>
          dependency.id ===
          dependencyId,
      );

    if (index === -1) {
      return false;
    }

    this.profile.dependencies.splice(
      index,
      1,
    );

    this.touch();

    return true;
  }

  /**
   * Return the current compatibility status.
   */
  getStatus(): CompatibilityStatus {
    return this.profile.status;
  }

  /**
   * Update compatibility status.
   */
  setStatus(
    status: CompatibilityStatus,
  ): void {
    this.profile.status =
      status;

    this.touch();
  }

  /**
   * Record the latest compatibility test.
   */
  setLastTested(
    timestamp: string,
  ): void {
    this.profile.lastTested =
      timestamp;

    this.touch();
  }

  /**
   * Return the latest compatibility test timestamp.
   */
  getLastTested(): string | undefined {
    return this.profile.lastTested;
  }

  /**
   * Record the latest diagnostic run.
   */
  setLastDiagnosed(
    timestamp: string,
  ): void {
    this.profile.lastDiagnosed =
      timestamp;

    this.touch();
  }

  /**
   * Record the latest repair operation.
   */
  setLastRepaired(
    timestamp: string,
  ): void {
    this.profile.lastRepaired =
      timestamp;

    this.touch();
  }

  /**
   * Return known-good configuration.
   */
  getLastKnownGoodConfiguration():
    | KnownGoodConfiguration
    | undefined {
    return this.profile
      .lastKnownGoodConfiguration
      ? this.cloneKnownGoodConfiguration(
          this.profile
            .lastKnownGoodConfiguration,
        )
      : undefined;
  }

  /**
   * Save a known-good configuration.
   */
  setLastKnownGoodConfiguration(
    configuration:
      KnownGoodConfiguration,
  ): void {
    this.profile
      .lastKnownGoodConfiguration =
      this.cloneKnownGoodConfiguration(
        configuration,
      );

    this.touch();
  }

  /**
   * Return all backups recorded in the profile.
   */
  getBackups(): CompatibilityBackup[] {
    return this.cloneBackups(
      this.profile.backups,
    );
  }

  /**
   * Replace the backup metadata.
   */
  setBackups(
    backups: CompatibilityBackup[],
  ): void {
    this.profile.backups =
      this.cloneBackups(
        backups,
      );

    this.touch();
  }

  /**
   * Update user/developer notes.
   */
  setNotes(
    notes: string | undefined,
  ): void {
    this.profile.notes =
      notes;

    this.touch();
  }

  /**
   * Return user/developer notes.
   */
  getNotes(): string | undefined {
    return this.profile.notes;
  }

  /**
   * Replace the complete profile.
   *
   * Used when loading persisted compatibility data.
   */
  loadProfile(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profile =
      this.cloneProfile(profile);
  }

  /**
   * Update the modification timestamp.
   */
  private touch(): void {
    this.profile.lastUpdated =
      new Date().toISOString();
  }

  /**
   * Clone the complete profile.
   */
  private cloneProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,

      wine: this.cloneWine(
        profile.wine,
      ),

      graphics:
        this.cloneGraphics(
          profile.graphics,
        ),

      dependencies:
        this.cloneDependencies(
          profile.dependencies,
        ),

      backups:
        this.cloneBackups(
          profile.backups,
        ),

      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration
          ? this.cloneKnownGoodConfiguration(
              profile.lastKnownGoodConfiguration,
            )
          : undefined,
    };
  }

  /**
   * Clone Wine configuration.
   */
  private cloneWine(
    wine: WineConfiguration,
  ): WineConfiguration {
    return {
      ...wine,
    };
  }

  /**
   * Clone graphics configuration.
   */
  private cloneGraphics(
    graphics: GraphicsConfiguration,
  ): GraphicsConfiguration {
    return {
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
   * Clone dependencies.
   */
  private cloneDependencies(
    dependencies: GameDependency[],
  ): GameDependency[] {
    return dependencies.map(
      (dependency) =>
        this.cloneDependency(
          dependency,
        ),
    );
  }

  /**
   * Clone one dependency.
   */
  private cloneDependency(
    dependency: GameDependency,
  ): GameDependency {
    return {
      ...dependency,
    };
  }

  /**
   * Clone backup metadata.
   */
  private cloneBackups(
    backups: CompatibilityBackup[],
  ): CompatibilityBackup[] {
    return backups.map(
      (backup) => ({
        ...backup,
      }),
    );
  }

  /**
   * Clone known-good configuration.
   */
  private cloneKnownGoodConfiguration(
    configuration:
      KnownGoodConfiguration,
  ): KnownGoodConfiguration {
    return {
      ...configuration,

      wine: configuration.wine
        ? this.cloneWine(
            configuration.wine,
          )
        : undefined,

      graphics:
        configuration.graphics
          ? this.cloneGraphics(
              configuration.graphics,
            )
          : undefined,

      dependencies:
        this.cloneDependencies(
          configuration.dependencies,
        ),
    };
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Game compatibility profile model.
 *
 * A profile represents everything Hydra needs to remember about
 * one Windows game running through the macOS compatibility system.
 */

import {
  CompatibilityBackup,
  CompatibilityStatus,
  GameDependency,
  GraphicsConfiguration,
  KnownGoodConfiguration,
  WineConfiguration,
} from "../manager/MacCompatibilityTypes";

export class MacGameProfile {
  private profile: {
    gameId: string;
    gameName: string;
    gamePath: string;
    compatibilityPath: string;
    status: CompatibilityStatus;
    wine: WineConfiguration;
    graphics: GraphicsConfiguration;
    dependencies: GameDependency[];
    lastTested?: string;
    lastDiagnosed?: string;
    lastRepaired?: string;
    lastUpdated?: string;
    lastKnownGoodConfiguration?: KnownGoodConfiguration;
    backups: CompatibilityBackup[];
    notes?: string;
  };

  constructor(
    initialProfile: {
      gameId: string;
      gameName: string;
      gamePath: string;
      compatibilityPath: string;
      status?: CompatibilityStatus;
      wine: WineConfiguration;
      graphics: GraphicsConfiguration;
      dependencies?: GameDependency[];
      lastTested?: string;
      lastDiagnosed?: string;
      lastRepaired?: string;
      lastUpdated?: string;
      lastKnownGoodConfiguration?: KnownGoodConfiguration;
      backups?: CompatibilityBackup[];
      notes?: string;
    },
  ) {
    if (!initialProfile.gameId.trim()) {
      throw new Error("Game ID cannot be empty.");
    }

    if (!initialProfile.gameName.trim()) {
      throw new Error("Game name cannot be empty.");
    }

    if (!initialProfile.gamePath.trim()) {
      throw new Error("Game path cannot be empty.");
    }

    if (!initialProfile.compatibilityPath.trim()) {
      throw new Error(
        "Compatibility path cannot be empty.",
      );
    }

    this.profile = {
      gameId: initialProfile.gameId,
      gameName: initialProfile.gameName,
      gamePath: initialProfile.gamePath,
      compatibilityPath:
        initialProfile.compatibilityPath,
      status: initialProfile.status ?? "unknown",
      wine: initialProfile.wine,
      graphics: initialProfile.graphics,
      dependencies:
        initialProfile.dependencies ?? [],
      lastTested: initialProfile.lastTested,
      lastDiagnosed:
        initialProfile.lastDiagnosed,
      lastRepaired:
        initialProfile.lastRepaired,
      lastUpdated:
        initialProfile.lastUpdated,
      lastKnownGoodConfiguration:
        initialProfile.lastKnownGoodConfiguration,
      backups:
        initialProfile.backups ?? [],
      notes: initialProfile.notes,
    };
  }

  /**
   * Return the complete compatibility profile.
   */
  toProfile(): {
    gameId: string;
    gameName: string;
    gamePath: string;
    compatibilityPath: string;
    status: CompatibilityStatus;
    wine: WineConfiguration;
    graphics: GraphicsConfiguration;
    dependencies: GameDependency[];
    lastTested?: string;
    lastDiagnosed?: string;
    lastRepaired?: string;
    lastUpdated?: string;
    lastKnownGoodConfiguration?: KnownGoodConfiguration;
    backups: CompatibilityBackup[];
    notes?: string;
  } {
    return {
      ...this.profile,
      dependencies: [
        ...this.profile.dependencies,
      ],
      backups: [
        ...this.profile.backups,
      ],
    };
  }

  /**
   * Return the stable game ID.
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
   * Return the installed game path.
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
   * Return the current compatibility status.
   */
  getStatus(): CompatibilityStatus {
    return this.profile.status;
  }

  /**
   * Update the compatibility status.
   */
  setStatus(status: CompatibilityStatus): void {
    this.profile.status = status;
    this.touch();
  }

  /**
   * Return the Wine configuration.
   */
  getWineConfiguration(): WineConfiguration {
    return {
      ...this.profile.wine,
    };
  }

  /**
   * Replace the Wine configuration.
   */
  setWineConfiguration(
    wine: WineConfiguration,
  ): void {
    this.profile.wine = {
      ...wine,
    };

    this.touch();
  }

  /**
   * Return the graphics configuration.
   */
  getGraphicsConfiguration(): GraphicsConfiguration {
    return {
      ...this.profile.graphics,
      environmentVariables: {
        ...this.profile.graphics
          .environmentVariables,
      },
      compatibilityFlags: [
        ...this.profile.graphics
          .compatibilityFlags,
      ],
    };
  }

  /**
   * Replace the graphics configuration.
   */
  setGraphicsConfiguration(
    graphics: GraphicsConfiguration,
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

    this.touch();
  }

  /**
   * Return all dependencies.
   */
  getDependencies(): GameDependency[] {
    return this.profile.dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
  }

  /**
   * Add a dependency.
   *
   * Existing dependencies with the same ID are replaced.
   */
  setDependency(
    dependency: GameDependency,
  ): void {
    const existingIndex =
      this.profile.dependencies.findIndex(
        (item) => item.id === dependency.id,
      );

    if (existingIndex === -1) {
      this.profile.dependencies.push({
        ...dependency,
      });
    } else {
      this.profile.dependencies[
        existingIndex
      ] = {
        ...dependency,
      };
    }

    this.touch();
  }

  /**
   * Remove a dependency.
   */
  removeDependency(
    dependencyId: string,
  ): boolean {
    const originalLength =
      this.profile.dependencies.length;

    this.profile.dependencies =
      this.profile.dependencies.filter(
        (dependency) =>
          dependency.id !== dependencyId,
      );

    const removed =
      this.profile.dependencies.length !==
      originalLength;

    if (removed) {
      this.touch();
    }

    return removed;
  }

  /**
   * Record a successful compatibility configuration.
   */
  setKnownGoodConfiguration(
    configuration: KnownGoodConfiguration,
  ): void {
    this.profile.lastKnownGoodConfiguration = {
      ...configuration,
      dependencies:
        configuration.dependencies.map(
          (dependency) => ({
            ...dependency,
          }),
        ),
    };

    this.touch();
  }

  /**
   * Return the last known-good configuration.
   */
  getKnownGoodConfiguration():
    | KnownGoodConfiguration
    | undefined {
    if (
      !this.profile
        .lastKnownGoodConfiguration
    ) {
      return undefined;
    }

    return {
      ...this.profile
        .lastKnownGoodConfiguration,
      dependencies:
        this.profile
          .lastKnownGoodConfiguration
          .dependencies.map(
            (dependency) => ({
              ...dependency,
            }),
          ),
    };
  }

  /**
   * Add a backup to the profile.
   */
  addBackup(
    backup: CompatibilityBackup,
  ): void {
    this.profile.backups.push({
      ...backup,
    });

    this.touch();
  }

  /**
   * Return all backups.
   */
  getBackups(): CompatibilityBackup[] {
    return this.profile.backups.map(
      (backup) => ({
        ...backup,
      }),
    );
  }

  /**
   * Record the time of the latest compatibility test.
   */
  recordTestedAt(timestamp: string): void {
    this.profile.lastTested = timestamp;
    this.touch(timestamp);
  }

  /**
   * Record the time of the latest diagnostic.
   */
  recordDiagnosedAt(timestamp: string): void {
    this.profile.lastDiagnosed = timestamp;
    this.touch(timestamp);
  }

  /**
   * Record the time of the latest repair.
   */
  recordRepairedAt(timestamp: string): void {
    this.profile.lastRepaired = timestamp;
    this.touch(timestamp);
  }

  /**
   * Update profile notes.
   */
  setNotes(notes?: string): void {
    this.profile.notes = notes;
    this.touch();
  }

  /**
   * Return the current profile notes.
   */
  getNotes(): string | undefined {
    return this.profile.notes;
  }

  /**
   * Update the modification timestamp.
   */
  private touch(
    timestamp: string = new Date().toISOString(),
  ): void {
    this.profile.lastUpdated = timestamp;
  }
}

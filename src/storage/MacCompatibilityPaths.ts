/**
 * Hydra Mac Compatibility
 *
 * Centralized path definitions for the Windows Compatibility system.
 *
 * This module does not create or delete files.
 * It only defines where compatibility data should live.
 */

import path from "node:path";

export interface MacCompatibilityPathOptions {
  /**
   * Root directory used by Hydra for compatibility data.
   *
   * Example:
   * ~/Library/Application Support/Hydra/mac-compat
   */
  rootPath: string;
}

export class MacCompatibilityPaths {
  private readonly rootPath: string;

  constructor(options: MacCompatibilityPathOptions) {
    this.rootPath = path.resolve(options.rootPath);
  }

  /**
   * Root compatibility directory.
   */
  getRootPath(): string {
    return this.rootPath;
  }

  /**
   * Wine installations and metadata.
   */
  getWinePath(): string {
    return path.join(this.rootPath, "wine");
  }

  /**
   * Temporary/downloaded compatibility components.
   */
  getDownloadsPath(): string {
    return path.join(this.rootPath, "downloads");
  }

  /**
   * Root directory containing all game environments.
   */
  getGamesPath(): string {
    return path.join(this.rootPath, "games");
  }

  /**
   * Directory containing a specific game's compatibility environment.
   */
  getGamePath(gameName: string): string {
    return path.join(this.getGamesPath(), gameName);
  }

  /**
   * Wine prefix for a specific game.
   */
  getGamePrefixPath(gameName: string): string {
    return path.join(this.getGamePath(gameName), "prefix");
  }

  /**
   * Game-specific configuration directory.
   */
  getGameConfigPath(gameName: string): string {
    return path.join(this.getGamePath(gameName), "config");
  }

  /**
   * Game dependency directory.
   */
  getGameDependenciesPath(gameName: string): string {
    return path.join(
      this.getGamePath(gameName),
      "dependencies",
    );
  }

  /**
   * Game graphics configuration directory.
   */
  getGameGraphicsPath(gameName: string): string {
    return path.join(
      this.getGamePath(gameName),
      "graphics",
    );
  }

  /**
   * Game logs directory.
   */
  getGameLogsPath(gameName: string): string {
    return path.join(this.getGamePath(gameName), "logs");
  }

  /**
   * Game backups directory.
   */
  getGameBackupsPath(gameName: string): string {
    return path.join(
      this.getGamePath(gameName),
      "backups",
    );
  }

  /**
   * Main compatibility profile for a game.
   */
  getGameCompatibilityProfilePath(gameName: string): string {
    return path.join(
      this.getGamePath(gameName),
      "compatibility.json",
    );
  }

  /**
   * Maintenance root.
   */
  getMaintenancePath(): string {
    return path.join(this.rootPath, "maintenance");
  }

  /**
   * Maintenance backups.
   */
  getMaintenanceBackupsPath(): string {
    return path.join(
      this.getMaintenancePath(),
      "backups",
    );
  }

  /**
   * Maintenance migrations.
   */
  getMaintenanceMigrationsPath(): string {
    return path.join(
      this.getMaintenancePath(),
      "migrations",
    );
  }

  /**
   * Maintenance cleanup.
   */
  getMaintenanceCleanupPath(): string {
    return path.join(
      this.getMaintenancePath(),
      "cleanup",
    );
  }

  /**
   * Maintenance repair.
   */
  getMaintenanceRepairPath(): string {
    return path.join(
      this.getMaintenancePath(),
      "repair",
    );
  }
}

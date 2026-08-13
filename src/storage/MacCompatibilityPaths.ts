/**
 * Hydra Mac Compatibility
 *
 * Centralized path management for Windows game compatibility data.
 *
 * This file defines the directory structure used by the compatibility
 * system so every subsystem agrees on where data belongs.
 */

import path from "node:path";

export interface MacCompatibilityPathOptions {
  /**
   * Root directory where Hydra compatibility data is stored.
   */
  compatibilityRoot: string;
}

export class MacCompatibilityPaths {
  private readonly root: string;

  constructor(options: MacCompatibilityPathOptions) {
    this.root = path.resolve(options.compatibilityRoot);
  }

  /**
   * Root compatibility directory.
   */
  getRootPath(): string {
    return this.root;
  }

  /**
   * Directory containing all per-game compatibility environments.
   */
  getGamesPath(): string {
    return path.join(this.root, "games");
  }

  /**
   * Directory containing Wine installations/configuration.
   */
  getWinePath(): string {
    return path.join(this.root, "wine");
  }

  /**
   * Directory containing compatibility downloads.
   */
  getDownloadsPath(): string {
    return path.join(this.root, "downloads");
  }

  /**
   * Directory containing global configuration.
   */
  getConfigPath(): string {
    return path.join(this.root, "config");
  }

  /**
   * Directory containing compatibility logs.
   */
  getLogsPath(): string {
    return path.join(this.root, "logs");
  }

  /**
   * Directory containing global backups.
   */
  getBackupsPath(): string {
    return path.join(this.root, "backups");
  }

  /**
   * Directory containing maintenance data.
   */
  getMaintenancePath(): string {
    return path.join(this.root, "maintenance");
  }

  /**
   * Directory containing maintenance migrations.
   */
  getMigrationsPath(): string {
    return path.join(this.getMaintenancePath(), "migrations");
  }

  /**
   * Directory containing maintenance cleanup data.
   */
  getCleanupPath(): string {
    return path.join(this.getMaintenancePath(), "cleanup");
  }

  /**
   * Directory containing maintenance repair data.
   */
  getRepairPath(): string {
    return path.join(this.getMaintenancePath(), "repair");
  }

  /**
   * Return the root directory for an individual game.
   *
   * Game names are not used directly as filesystem paths without
   * sanitization.
   */
  getGamePath(gameId: string): string {
    return path.join(this.getGamesPath(), this.sanitizeGameId(gameId));
  }

  /**
   * Per-game Wine prefix.
   */
  getGamePrefixPath(gameId: string): string {
    return path.join(this.getGamePath(gameId), "prefix");
  }

  /**
   * Per-game configuration.
   */
  getGameConfigPath(gameId: string): string {
    return path.join(this.getGamePath(gameId), "config");
  }

  /**
   * Per-game dependency data.
   */
  getGameDependenciesPath(gameId: string): string {
    return path.join(this.getGamePath(gameId), "dependencies");
  }

  /**
   * Per-game graphics configuration.
   */
  getGameGraphicsPath(gameId: string): string {
    return path.join(this.getGamePath(gameId), "graphics");
  }

  /**
   * Per-game logs.
   */
  getGameLogsPath(gameId: string): string {
    return path.join(this.getGamePath(gameId), "logs");
  }

  /**
   * Per-game backups.
   */
  getGameBackupsPath(gameId: string): string {
    return path.join(this.getGamePath(gameId), "backups");
  }

  /**
   * Per-game compatibility profile.
   */
  getGameProfilePath(gameId: string): string {
    return path.join(
      this.getGamePath(gameId),
      "compatibility.json",
    );
  }

  /**
   * Convert a game ID into a safe directory name.
   *
   * IDs are intentionally normalized instead of using arbitrary
   * user-provided strings as filesystem paths.
   */
  private sanitizeGameId(gameId: string): string {
    const normalized = gameId.trim();

    if (!normalized) {
      throw new Error("Game ID cannot be empty.");
    }

    return normalized
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
      .replace(/\s+/g, " ")
      .replace(/[. ]+$/g, "");
  }
}

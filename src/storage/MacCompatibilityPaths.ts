/**
 * Hydra Mac Compatibility
 *
 * Centralized path definitions for Windows game compatibility data.
 *
 * This file only defines and builds paths.
 * It does not create, delete, or modify files.
 */

import path from "node:path";

export class MacCompatibilityPaths {
  private readonly rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = path.resolve(
      rootPath,
    );
  }

  /**
   * Root directory for the compatibility system.
   */
  getRootPath(): string {
    return this.rootPath;
  }

  /**
   * Directory containing all game compatibility data.
   */
  getGamesPath(): string {
    return path.join(
      this.rootPath,
      "games",
    );
  }

  /**
   * Directory for one game's compatibility data.
   */
  getGamePath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamesPath(),
      this.sanitizeGameName(
        gameName,
      ),
    );
  }

  /**
   * Wine prefix for a game.
   */
  getPrefixPath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "prefix",
    );
  }

  /**
   * Configuration directory for a game.
   */
  getConfigPath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "config",
    );
  }

  /**
   * Dependency data directory for a game.
   */
  getDependenciesPath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "dependencies",
    );
  }

  /**
   * Graphics configuration directory for a game.
   */
  getGraphicsPath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "graphics",
    );
  }

  /**
   * Log directory for a game.
   */
  getLogsPath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "logs",
    );
  }

  /**
   * Backup directory for a game.
   */
  getBackupsPath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "backups",
    );
  }

  /**
   * Main compatibility profile file.
   */
  getProfilePath(
    gameName: string,
  ): string {
    return path.join(
      this.getGamePath(
        gameName,
      ),
      "compatibility.json",
    );
  }

  /**
   * Sanitize a human-readable game name so it can safely
   * become a directory name.
   *
   * This intentionally keeps the name recognizable.
   */
  private sanitizeGameName(
    gameName: string,
  ): string {
    const sanitized =
      gameName
        .trim()
        .replace(
          /[<>:"/\\|?*\u0000-\u001F]/g,
          "_",
        )
        .replace(
          /\s+/g,
          " ",
        );

    return sanitized || "Unknown Game";
  }
}

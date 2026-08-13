/**
 * Hydra Mac Compatibility
 *
 * Defines the filesystem layout used by Windows Compatibility.
 *
 * This class only calculates paths.
 * It does not create, delete, or modify files.
 */

import * as path from "node:path";

export class MacCompatibilityPaths {
  /**
   * Root directory for Hydra Mac Compatibility data.
   */
  private readonly rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = path.resolve(
      rootPath,
    );
  }

  /**
   * Return the compatibility root directory.
   */
  getRootPath(): string {
    return this.rootPath;
  }

  /**
   * Return the directory containing all game profiles.
   */
  getGamesPath(): string {
    return path.join(
      this.rootPath,
      "games",
    );
  }

  /**
   * Return a game's compatibility directory.
   */
  getGamePath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamesPath(),
      this.sanitizeGameId(gameId),
    );
  }

  /**
   * Return a game's Wine prefix directory.
   */
  getPrefixPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "prefix",
    );
  }

  /**
   * Return a game's configuration directory.
   */
  getConfigPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "config",
    );
  }

  /**
   * Return a game's dependency directory.
   */
  getDependenciesPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "dependencies",
    );
  }

  /**
   * Return a game's graphics directory.
   */
  getGraphicsPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "graphics",
    );
  }

  /**
   * Return a game's log directory.
   */
  getLogsPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "logs",
    );
  }

  /**
   * Return a game's backup directory.
   */
  getBackupsPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "backups",
    );
  }

  /**
   * Return the compatibility profile JSON path.
   */
  getCompatibilityProfilePath(
    gameId: string,
  ): string {
    return path.join(
      this.getConfigPath(gameId),
      "compatibility.json",
    );
  }

  /**
   * Return the global configuration path.
   */
  getGlobalConfigPath(): string {
    return path.join(
      this.rootPath,
      "configuration.json",
    );
  }

  /**
   * Prevent IDs from escaping the compatibility directory.
   */
  private sanitizeGameId(
    gameId: string,
  ): string {
    const sanitized =
      gameId
        .trim()
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    if (!sanitized) {
      throw new Error(
        "Game ID cannot be empty.",
      );
    }

    return sanitized;
  }
}

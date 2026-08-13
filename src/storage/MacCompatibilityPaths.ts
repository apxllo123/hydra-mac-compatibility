/**
 * Hydra Mac Compatibility
 *
 * Centralized filesystem paths for the macOS compatibility system.
 *
 * This class only calculates paths.
 * It does not create, delete, or modify files.
 */

import * as path from "node:path";

export interface MacCompatibilityPathOptions {
  rootPath: string;
}

export class MacCompatibilityPaths {
  private readonly rootPath: string;

  constructor(
    options: MacCompatibilityPathOptions,
  ) {
    this.rootPath =
      path.resolve(
        options.rootPath,
      );
  }

  /**
   * Return the root compatibility directory.
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
   * Return one game's compatibility directory.
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
   * Return the compatibility profile JSON path.
   */
  getProfilePath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "compatibility.json",
    );
  }

  /**
   * Return the Wine prefix directory.
   */
  getWinePrefixPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "wine-prefix",
    );
  }

  /**
   * Return the graphics configuration directory.
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
   * Return the dependency directory.
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
   * Return the logs directory.
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
   * Return the backups directory.
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
   * Return the diagnostics directory.
   */
  getDiagnosticsPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "diagnostics",
    );
  }

  /**
   * Return the game metadata path.
   */
  getMetadataPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "metadata.json",
    );
  }

  /**
   * Return the compatibility history path.
   */
  getHistoryPath(
    gameId: string,
  ): string {
    return path.join(
      this.getGamePath(gameId),
      "history.json",
    );
  }

  /**
   * Sanitize a game ID before using it as a directory name.
   *
   * This prevents accidental path traversal and keeps the
   * compatibility directory structure predictable.
   */
  private sanitizeGameId(
    gameId: string,
  ): string {
    const normalized =
      gameId
        .trim()
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    if (!normalized) {
      throw new Error(
        "Game ID cannot be empty.",
      );
    }

    if (
      normalized === "." ||
      normalized === ".."
    ) {
      throw new Error(
        "Invalid game ID.",
      );
    }

    return normalized;
  }
}

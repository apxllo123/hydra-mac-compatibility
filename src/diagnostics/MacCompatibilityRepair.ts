/**
 * Hydra Mac Compatibility
 *
 * Controlled repair operations for Windows game compatibility
 * environments on macOS.
 *
 * IMPORTANT:
 * Repairs are intentionally conservative.
 * This class does not delete game data, reinstall Wine,
 * or make destructive changes automatically.
 */

import { promises as fs } from "node:fs";

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import {
  MacCompatibilityPaths,
} from "../storage/MacCompatibilityPaths";

export type CompatibilityRepairAction =
  | "create-game-directory"
  | "create-prefix-directory"
  | "create-config-directory"
  | "create-dependencies-directory"
  | "create-graphics-directory"
  | "create-logs-directory"
  | "create-backups-directory"
  | "reset-status";

export interface CompatibilityRepairRequest {
  action: CompatibilityRepairAction;
}

export interface CompatibilityRepairResult {
  action: CompatibilityRepairAction;
  success: boolean;
  message: string;
}

export class MacCompatibilityRepair {
  private readonly paths: MacCompatibilityPaths;

  constructor(
    paths: MacCompatibilityPaths,
  ) {
    this.paths = paths;
  }

  /**
   * Execute a single safe repair operation.
   */
  async repair(
    profile: MacGameCompatibilityProfile,
    request: CompatibilityRepairRequest,
  ): Promise<CompatibilityRepairResult> {
    try {
      switch (request.action) {
        case "create-game-directory":
          await this.createDirectory(
            this.paths.getGamePath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Game compatibility directory is ready.",
          );

        case "create-prefix-directory":
          await this.createDirectory(
            this.paths.getGamePrefixPath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Wine prefix directory is ready.",
          );

        case "create-config-directory":
          await this.createDirectory(
            this.paths.getGameConfigPath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Game configuration directory is ready.",
          );

        case "create-dependencies-directory":
          await this.createDirectory(
            this.paths.getGameDependenciesPath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Dependencies directory is ready.",
          );

        case "create-graphics-directory":
          await this.createDirectory(
            this.paths.getGameGraphicsPath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Graphics configuration directory is ready.",
          );

        case "create-logs-directory":
          await this.createDirectory(
            this.paths.getGameLogsPath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Logs directory is ready.",
          );

        case "create-backups-directory":
          await this.createDirectory(
            this.paths.getGameBackupsPath(
              profile.gameName,
            ),
          );

          return this.success(
            request.action,
            "Backups directory is ready.",
          );

        case "reset-status":
          return this.success(
            request.action,
            "The compatibility status can be reset by the game manager.",
          );

        default:
          return {
            action: request.action,
            success: false,
            message:
              "Unsupported compatibility repair action.",
          };
      }
    } catch (error) {
      return {
        action: request.action,
        success: false,
        message:
          this.getErrorMessage(
            error,
          ),
      };
    }
  }

  /**
   * Create every safe directory belonging to a game.
   *
   * This does NOT create or initialize an actual Wine prefix.
   */
  async prepareGameDirectories(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityRepairResult[]> {
    const actions:
      CompatibilityRepairAction[] = [
        "create-game-directory",
        "create-prefix-directory",
        "create-config-directory",
        "create-dependencies-directory",
        "create-graphics-directory",
        "create-logs-directory",
        "create-backups-directory",
      ];

    const results: CompatibilityRepairResult[] = [];

    for (
      const action of actions
    ) {
      results.push(
        await this.repair(
          profile,
          { action },
        ),
      );
    }

    return results;
  }

  /**
   * Create a directory safely.
   */
  private async createDirectory(
    directoryPath: string,
  ): Promise<void> {
    await fs.mkdir(
      directoryPath,
      {
        recursive: true,
      },
    );
  }

  /**
   * Build a successful repair result.
   */
  private success(
    action: CompatibilityRepairAction,
    message: string,
  ): CompatibilityRepairResult {
    return {
      action,
      success: true,
      message,
    };
  }

  /**
   * Convert an unknown error into a readable message.
   */
  private getErrorMessage(
    error: unknown,
  ): string {
    if (
      error instanceof Error
    ) {
      return error.message;
    }

    return String(error);
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Backup management for Windows game compatibility data.
 *
 * This subsystem is intentionally conservative:
 * backups are created before important changes and can be
 * restored if a repair or configuration change fails.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacCompatibilityPaths } from "./MacCompatibilityPaths";

export interface MacCompatibilityBackup {
  id: string;
  gameId: string;
  createdAt: string;
  path: string;
}

export class MacCompatibilityBackups {
  private readonly paths: MacCompatibilityPaths;

  constructor(
    paths: MacCompatibilityPaths,
  ) {
    this.paths = paths;
  }

  /**
   * Create a backup of a game's compatibility profile.
   *
   * The original profile is never modified.
   */
  async createProfileBackup(
    profile: MacGameCompatibilityProfile,
  ): Promise<MacCompatibilityBackup> {
    const gameId = profile.gameId;
    const createdAt =
      new Date().toISOString();

    const id =
      this.createBackupId(
        createdAt,
      );

    const backupDirectory =
      path.join(
        this.paths.getBackupsPath(
          gameId,
        ),
        id,
      );

    await fs.mkdir(
      backupDirectory,
      {
        recursive: true,
      },
    );

    const backupPath =
      path.join(
        backupDirectory,
        "compatibility.json",
      );

    await fs.writeFile(
      backupPath,
      JSON.stringify(
        profile,
        null,
        2,
      ),
      "utf8",
    );

    return {
      id,
      gameId,
      createdAt,
      path: backupPath,
    };
  }

  /**
   * Restore a compatibility profile from a backup.
   *
   * The returned profile can then be handed back to the
   * profile store or manager.
   */
  async restoreProfileBackup(
    backup: MacCompatibilityBackup,
  ): Promise<MacGameCompatibilityProfile> {
    const raw =
      await fs.readFile(
        backup.path,
        "utf8",
      );

    const profile =
      JSON.parse(
        raw,
      ) as MacGameCompatibilityProfile;

    if (
      profile.gameId !==
      backup.gameId
    ) {
      throw new Error(
        "Backup game ID does not match the requested game.",
      );
    }

    return profile;
  }

  /**
   * List available backups for a game.
   */
  async listBackups(
    gameId: string,
  ): Promise<MacCompatibilityBackup[]> {
    const backupsPath =
      this.paths.getBackupsPath(
        gameId,
      );

    try {
      const entries =
        await fs.readdir(
          backupsPath,
          {
            withFileTypes: true,
          },
        );

      const backups: MacCompatibilityBackup[] =
        [];

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        const backupPath =
          path.join(
            backupsPath,
            entry.name,
            "compatibility.json",
          );

        try {
          const raw =
            await fs.readFile(
              backupPath,
              "utf8",
            );

          const profile =
            JSON.parse(
              raw,
            ) as MacGameCompatibilityProfile;

          if (
            profile.gameId !==
            gameId
          ) {
            continue;
          }

          const stats =
            await fs.stat(
              backupPath,
            );

          backups.push({
            id: entry.name,
            gameId,
            createdAt:
              stats.mtime.toISOString(),
            path: backupPath,
          });
        } catch {
          // Ignore incomplete or corrupt backup entries.
        }
      }

      return backups.sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      );
    } catch (error) {
      const code =
        (
          error as NodeJS.ErrnoException
        ).code;

      if (code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

  /**
   * Delete one specific backup.
   *
   * This is intentionally explicit. Backups are never
   * automatically deleted by this class.
   */
  async deleteBackup(
    backup: MacCompatibilityBackup,
  ): Promise<void> {
    const backupDirectory =
      path.dirname(
        backup.path,
      );

    await fs.rm(
      backupDirectory,
      {
        recursive: true,
        force: true,
      },
    );
  }

  /**
   * Remove old backups while keeping the newest
   * requested number.
   *
   * This method should only be called by explicit
   * maintenance operations.
   */
  async pruneBackups(
    gameId: string,
    keep: number,
  ): Promise<MacCompatibilityBackup[]> {
    if (
      !Number.isInteger(keep) ||
      keep < 1
    ) {
      throw new Error(
        "Backup retention count must be a positive integer.",
      );
    }

    const backups =
      await this.listBackups(
        gameId,
      );

    const toDelete =
      backups.slice(keep);

    for (const backup of toDelete) {
      await this.deleteBackup(
        backup,
      );
    }

    return backups.slice(
      0,
      keep,
    );
  }

  /**
   * Create a filesystem-safe backup ID.
   */
  private createBackupId(
    timestamp: string,
  ): string {
    return timestamp
      .replace(
        /[:.]/g,
        "-",
      )
      .replace(
        /Z$/,
        "",
      );
  }
}

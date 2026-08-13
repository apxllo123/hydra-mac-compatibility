/**
 * Hydra Mac Compatibility
 *
 * Backup and restore support for per-game compatibility
 * configurations.
 *
 * IMPORTANT:
 * This component is intentionally conservative.
 * It backs up compatibility configuration data and does
 * not automatically delete or overwrite game files.
 */

import {
  promises as fs,
} from "node:fs";

import * as path from "node:path";

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export interface CompatibilityBackupMetadata {
  id: string;

  gameId: string;

  gameName: string;

  createdAt: string;

  reason: string;

  profileFile: string;
}

export class MacCompatibilityBackups {
  /**
   * Create a backup of a game's compatibility profile.
   */
  async createBackup(
    profile: MacGameCompatibilityProfile,
    backupDirectory: string,
    reason = "manual",
  ): Promise<CompatibilityBackupMetadata> {
    const backupId =
      this.createBackupId();

    const gameDirectory =
      path.join(
        backupDirectory,
        this.sanitizeName(
          profile.gameName,
        ),
      );

    const destination =
      path.join(
        gameDirectory,
        backupId,
      );

    await fs.mkdir(
      destination,
      {
        recursive: true,
      },
    );

    const profileFile =
      path.join(
        destination,
        "compatibility.json",
      );

    await fs.writeFile(
      profileFile,
      JSON.stringify(
        profile,
        null,
        2,
      ),
      "utf8",
    );

    const metadata: CompatibilityBackupMetadata =
      {
        id: backupId,

        gameId:
          profile.gameId,

        gameName:
          profile.gameName,

        createdAt:
          new Date().toISOString(),

        reason,

        profileFile,
      };

    await fs.writeFile(
      path.join(
        destination,
        "backup.json",
      ),
      JSON.stringify(
        metadata,
        null,
        2,
      ),
      "utf8",
    );

    return metadata;
  }

  /**
   * Restore a compatibility profile from a backup.
   *
   * This returns the backed-up profile rather than
   * automatically modifying the current profile.
   */
  async restoreBackup(
    profileFile: string,
  ): Promise<MacGameCompatibilityProfile> {
    const contents =
      await fs.readFile(
        profileFile,
        "utf8",
      );

    const profile =
      JSON.parse(
        contents,
      ) as MacGameCompatibilityProfile;

    this.validateBackupProfile(
      profile,
    );

    return profile;
  }

  /**
   * List available backups for a specific game.
   */
  async listBackups(
    backupDirectory: string,
    gameName: string,
  ): Promise<CompatibilityBackupMetadata[]> {
    const gameDirectory =
      path.join(
        backupDirectory,
        this.sanitizeName(
          gameName,
        ),
      );

    try {
      const entries =
        await fs.readdir(
          gameDirectory,
          {
            withFileTypes: true,
          },
        );

      const backups:
        CompatibilityBackupMetadata[] =
        [];

      for (
        const entry of entries
      ) {
        if (
          !entry.isDirectory()
        ) {
          continue;
        }

        const metadataFile =
          path.join(
            gameDirectory,
            entry.name,
            "backup.json",
          );

        try {
          const contents =
            await fs.readFile(
              metadataFile,
              "utf8",
            );

          const metadata =
            JSON.parse(
              contents,
            ) as CompatibilityBackupMetadata;

          backups.push(
            metadata,
          );
        } catch {
          /*
           * Ignore incomplete or corrupted backup
           * metadata instead of failing the entire listing.
           */
        }
      }

      return backups.sort(
        (
          a,
          b,
        ) =>
          b.createdAt.localeCompare(
            a.createdAt,
          ),
      );
    } catch {
      return [];
    }
  }

  /**
   * Remove a single backup.
   *
   * This operation is explicit and never happens automatically.
   */
  async deleteBackup(
    backupDirectory: string,
    gameName: string,
    backupId: string,
  ): Promise<void> {
    const backupPath =
      path.join(
        backupDirectory,
        this.sanitizeName(
          gameName,
        ),
        backupId,
      );

    await fs.rm(
      backupPath,
      {
        recursive: true,
        force: false,
      },
    );
  }

  /**
   * Generate a unique backup identifier.
   */
  private createBackupId(): string {
    const timestamp =
      new Date()
        .toISOString()
        .replace(
          /[:.]/g,
          "-",
        );

    const random =
      Math.random()
        .toString(36)
        .slice(
          2,
          8,
        );

    return `backup-${timestamp}-${random}`;
  }

  /**
   * Make a game name safe to use as a directory name.
   */
  private sanitizeName(
    name: string,
  ): string {
    const sanitized =
      name
        .trim()
        .replace(
          /[<>:"/\\|?*\u0000-\u001F]/g,
          "_",
        );

    return (
      sanitized ||
      "Unknown Game"
    );
  }

  /**
   * Validate the basic structure of a restored profile.
   */
  private validateBackupProfile(
    profile: MacGameCompatibilityProfile,
  ): void {
    if (
      !profile ||
      typeof profile !==
        "object"
    ) {
      throw new Error(
        "Backup does not contain a valid compatibility profile.",
      );
    }

    if (
      typeof profile.gameId !==
      "string"
    ) {
      throw new Error(
        "Backup compatibility profile is missing gameId.",
      );
    }

    if (
      typeof profile.gameName !==
      "string"
    ) {
      throw new Error(
        "Backup compatibility profile is missing gameName.",
      );
    }

    if (
      !profile.wine ||
      typeof profile.wine !==
        "object"
    ) {
      throw new Error(
        "Backup compatibility profile is missing Wine configuration.",
      );
    }

    if (
      !profile.graphics ||
      typeof profile.graphics !==
        "object"
    ) {
      throw new Error(
        "Backup compatibility profile is missing graphics configuration.",
      );
    }
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Backup coordination for Windows game compatibility data.
 *
 * This class is intentionally focused on backup metadata and
 * backup lifecycle decisions. Actual filesystem copying will
 * be connected to the storage implementation.
 */

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export interface MacCompatibilityBackup {
  id: string;
  gameId: string;
  gameName: string;
  createdAt: string;
  reason: string;
  profile: MacGameCompatibilityProfile;
}

export class MacCompatibilityBackups {
  private readonly backups = new Map<
    string,
    MacCompatibilityBackup[]
  >();

  /**
   * Create an in-memory backup of a game's compatibility profile.
   *
   * The physical filesystem backup will be connected later.
   */
  create(
    profile: MacGameCompatibilityProfile,
    reason = "manual",
  ): MacCompatibilityBackup {
    const backup: MacCompatibilityBackup = {
      id: this.createBackupId(
        profile.gameId,
      ),
      gameId: profile.gameId,
      gameName: profile.gameName,
      createdAt:
        new Date().toISOString(),
      reason,
      profile: this.cloneProfile(
        profile,
      ),
    };

    const existing =
      this.backups.get(
        profile.gameId,
      ) ?? [];

    existing.push(
      backup,
    );

    this.backups.set(
      profile.gameId,
      existing,
    );

    return this.cloneBackup(
      backup,
    );
  }

  /**
   * Return all backups for a game.
   */
  getAll(
    gameId: string,
  ): MacCompatibilityBackup[] {
    return (
      this.backups.get(
        gameId,
      ) ?? []
    ).map(
      (backup) =>
        this.cloneBackup(
          backup,
        ),
    );
  }

  /**
   * Return the most recent backup.
   */
  getLatest(
    gameId: string,
  ):
    | MacCompatibilityBackup
    | undefined {
    const backups =
      this.backups.get(
        gameId,
      );

    if (
      !backups ||
      backups.length === 0
    ) {
      return undefined;
    }

    return this.cloneBackup(
      backups[
        backups.length - 1
      ],
    );
  }

  /**
   * Find a specific backup.
   */
  get(
    gameId: string,
    backupId: string,
  ):
    | MacCompatibilityBackup
    | undefined {
    const backup =
      this.backups
        .get(gameId)
        ?.find(
          (item) =>
            item.id ===
            backupId,
        );

    return backup
      ? this.cloneBackup(
          backup,
        )
      : undefined;
  }

  /**
   * Restore a profile from a backup.
   *
   * This returns the saved profile.
   * Actual filesystem restoration will be connected later.
   */
  restore(
    gameId: string,
    backupId: string,
  ):
    | MacGameCompatibilityProfile
    | undefined {
    const backup =
      this.get(
        gameId,
        backupId,
      );

    if (!backup) {
      return undefined;
    }

    return this.cloneProfile(
      backup.profile,
    );
  }

  /**
   * Remove one backup.
   */
  remove(
    gameId: string,
    backupId: string,
  ): boolean {
    const backups =
      this.backups.get(
        gameId,
      );

    if (!backups) {
      return false;
    }

    const index =
      backups.findIndex(
        (backup) =>
          backup.id ===
          backupId,
      );

    if (index === -1) {
      return false;
    }

    backups.splice(
      index,
      1,
    );

    return true;
  }

  /**
   * Remove every backup for a game.
   */
  clear(
    gameId: string,
  ): void {
    this.backups.delete(
      gameId,
    );
  }

  /**
   * Limit the number of backups retained for a game.
   *
   * The oldest backups are removed first.
   */
  prune(
    gameId: string,
    maximum: number,
  ): MacCompatibilityBackup[] {
    if (
      !Number.isInteger(
        maximum,
      ) ||
      maximum < 1
    ) {
      throw new Error(
        "Backup maximum must be a positive integer.",
      );
    }

    const backups =
      this.backups.get(
        gameId,
      ) ?? [];

    while (
      backups.length >
      maximum
    ) {
      backups.shift();
    }

    return this.getAll(
      gameId,
    );
  }

  /**
   * Generate a unique backup ID.
   */
  private createBackupId(
    gameId: string,
  ): string {
    return [
      gameId,
      Date.now().toString(36),
      Math.random()
        .toString(36)
        .slice(2, 8),
    ].join("-");
  }

  /**
   * Safely clone a backup.
   */
  private cloneBackup(
    backup: MacCompatibilityBackup,
  ): MacCompatibilityBackup {
    return {
      ...backup,
      profile:
        this.cloneProfile(
          backup.profile,
        ),
    };
  }

  /**
   * Safely clone a compatibility profile.
   */
  private cloneProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,

      wine: profile.wine
        ? {
            ...profile.wine,
          }
        : profile.wine,

      graphics: profile.graphics
        ? {
            ...profile.graphics,

            environmentVariables: {
              ...profile.graphics
                .environmentVariables,
            },

            compatibilityFlags: [
              ...profile.graphics
                .compatibilityFlags,
            ],
          }
        : profile.graphics,

      dependencies:
        profile.dependencies?.map(
          (dependency) => ({
            ...dependency,
          }),
        ),

      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration
          ? this.cloneProfile(
              profile.lastKnownGoodConfiguration,
            )
          : undefined,
    };
  }
}

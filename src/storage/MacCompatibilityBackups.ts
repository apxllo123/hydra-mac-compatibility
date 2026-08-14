/**
 * Hydra Mac Compatibility
 *
 * Coordinates backup metadata for individual game compatibility
 * environments.
 *
 * This class does not perform filesystem copies yet. The actual
 * file operations will be connected through the storage layer.
 */

import type {
  CompatibilityBackup,
} from "../manager/MacCompatibilityTypes";

export class MacCompatibilityBackups {
  private readonly backups = new Map<
    string,
    CompatibilityBackup[]
  >();

  /**
   * Add backup metadata for a game.
   */
  add(
    gameId: string,
    backup: CompatibilityBackup,
  ): void {
    const gameBackups =
      this.backups.get(gameId) ?? [];

    gameBackups.push({
      ...backup,
    });

    this.backups.set(
      gameId,
      gameBackups,
    );
  }

  /**
   * Return all backups for a game.
   */
  getAll(
    gameId: string,
  ): CompatibilityBackup[] {
    return (
      this.backups.get(gameId) ?? []
    ).map(
      (backup) => ({
        ...backup,
      }),
    );
  }

  /**
   * Return the most recent backup for a game.
   */
  getLatest(
    gameId: string,
  ): CompatibilityBackup | undefined {
    const gameBackups =
      this.backups.get(gameId);

    if (
      !gameBackups ||
      gameBackups.length === 0
    ) {
      return undefined;
    }

    return {
      ...gameBackups[
        gameBackups.length - 1
      ],
    };
  }

  /**
   * Check whether a game has any backups.
   */
  has(
    gameId: string,
  ): boolean {
    return (
      (this.backups.get(gameId)?.length ??
        0) > 0
    );
  }

  /**
   * Return the number of backups for a game.
   */
  count(
    gameId: string,
  ): number {
    return (
      this.backups.get(gameId)?.length ??
      0
    );
  }

  /**
   * Remove one backup by its ID.
   *
   * This only removes the backup metadata from memory.
   * It does not delete the actual backup files.
   */
  remove(
    gameId: string,
    backupId: string,
  ): boolean {
    const gameBackups =
      this.backups.get(gameId);

    if (!gameBackups) {
      return false;
    }

    const index =
      gameBackups.findIndex(
        (backup) =>
          backup.id === backupId,
      );

    if (index === -1) {
      return false;
    }

    gameBackups.splice(
      index,
      1,
    );

    if (
      gameBackups.length === 0
    ) {
      this.backups.delete(
        gameId,
      );
    }

    return true;
  }

  /**
   * Remove all backup metadata for a game.
   *
   * This does not delete files from disk.
   */
  clear(
    gameId: string,
  ): void {
    this.backups.delete(
      gameId,
    );
  }

  /**
   * Remove all in-memory backup metadata.
   */
  clearAll(): void {
    this.backups.clear();
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Backup coordination for Windows game compatibility environments.
 *
 * This class is responsible for tracking backup operations.
 * Actual filesystem copying/restoration will be connected to the
 * platform storage layer as the project is integrated into Hydra.
 */

import {
  CompatibilityBackup,
} from "../manager/MacCompatibilityTypes";

export interface CompatibilityBackupRequest {
  gameId: string;
  sourcePath: string;
  description?: string;
}

export interface CompatibilityRestoreResult {
  success: boolean;
  backupId: string;
  restoredPath?: string;
  error?: string;
}

export class MacCompatibilityBackups {
  private readonly backups = new Map<
    string,
    CompatibilityBackup[]
  >();

  /**
   * Register a backup for a game.
   *
   * This currently records the backup metadata. The actual
   * filesystem copy will be implemented by the storage layer.
   */
  registerBackup(
    gameId: string,
    backup: CompatibilityBackup,
  ): void {
    const gameBackups = this.backups.get(gameId) ?? [];

    gameBackups.push(backup);

    this.backups.set(gameId, gameBackups);
  }

  /**
   * Return all backups belonging to a game.
   */
  getBackups(gameId: string): CompatibilityBackup[] {
    return [
      ...(this.backups.get(gameId) ?? []),
    ];
  }

  /**
   * Find a specific backup by ID.
   */
  getBackup(
    gameId: string,
    backupId: string,
  ): CompatibilityBackup | undefined {
    return this.backups
      .get(gameId)
      ?.find((backup) => backup.id === backupId);
  }

  /**
   * Check whether a backup exists.
   */
  hasBackup(
    gameId: string,
    backupId: string,
  ): boolean {
    return Boolean(
      this.getBackup(gameId, backupId),
    );
  }

  /**
   * Remove backup metadata from the in-memory registry.
   *
   * This does NOT delete the physical backup.
   * Physical deletion belongs to the storage layer.
   */
  unregisterBackup(
    gameId: string,
    backupId: string,
  ): boolean {
    const gameBackups = this.backups.get(gameId);

    if (!gameBackups) {
      return false;
    }

    const originalLength = gameBackups.length;

    const remainingBackups = gameBackups.filter(
      (backup) => backup.id !== backupId,
    );

    if (remainingBackups.length === originalLength) {
      return false;
    }

    if (remainingBackups.length === 0) {
      this.backups.delete(gameId);
    } else {
      this.backups.set(
        gameId,
        remainingBackups,
      );
    }

    return true;
  }

  /**
   * Remove all tracked backup metadata for a game.
   *
   * This does NOT delete physical backup files.
   */
  clearGameBackups(gameId: string): void {
    this.backups.delete(gameId);
  }

  /**
   * Remove all tracked backup metadata.
   *
   * This does NOT delete physical backup files.
   */
  clear(): void {
    this.backups.clear();
  }

  /**
   * Return the number of tracked backups for a game.
   */
  getBackupCount(gameId: string): number {
    return this.backups.get(gameId)?.length ?? 0;
  }

  /**
   * Return the total number of tracked backups.
   */
  getTotalBackupCount(): number {
    let count = 0;

    for (const gameBackups of this.backups.values()) {
      count += gameBackups.length;
    }

    return count;
  }
}

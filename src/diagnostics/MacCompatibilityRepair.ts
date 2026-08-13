/**
 * Hydra Mac Compatibility
 *
 * Handles safe repair operations for Windows game
 * compatibility configurations on macOS.
 *
 * Repair is intentionally conservative:
 *
 * 1. Inspect the problem.
 * 2. Create a backup before making changes.
 * 3. Make the smallest appropriate change.
 * 4. Test the result.
 * 5. Restore when necessary.
 *
 * Runtime-specific repair operations will be connected
 * to the Wine and storage layers later.
 */

import {
  MacGameCompatibilityProfile,
  CompatibilityRepairResult,
} from "../manager/MacCompatibilityTypes";

export interface MacCompatibilityRepairOptions {
  createBackup?: boolean;
  testAfterRepair?: boolean;
}

export class MacCompatibilityRepair {
  /**
   * Attempt to repair a compatibility configuration.
   *
   * This method currently performs safe configuration-level
   * repairs only. Destructive runtime operations are not
   * performed until the required subsystems are connected.
   */
  async repair(
    profile: MacGameCompatibilityProfile,
    options: MacCompatibilityRepairOptions = {},
  ): Promise<CompatibilityRepairResult> {
    const createBackup =
      options.createBackup ?? true;

    const testAfterRepair =
      options.testAfterRepair ?? true;

    const changes: string[] = [];
    const warnings: string[] = [];

    /*
     * We intentionally do not claim a backup was created yet.
     * The real backup implementation belongs to the storage
     * subsystem.
     */
    if (createBackup) {
      warnings.push(
        "Backup creation will be connected to the storage subsystem.",
      );
    }

    this.repairProfile(
      profile,
      changes,
    );

    this.repairGraphics(
      profile,
      changes,
    );

    if (testAfterRepair) {
      warnings.push(
        "Post-repair runtime testing will be connected to the compatibility tester.",
      );
    }

    return {
      gameId: profile.gameId,
      success: true,
      repairedAt:
        new Date().toISOString(),
      changes,
      warnings,
    };
  }

  /**
   * Repair safe profile-level issues.
   */
  private repairProfile(
    profile: MacGameCompatibilityProfile,
    changes: string[],
  ): void {
    if (
      profile.gameName &&
      profile.gameName.trim()
    ) {
      return;
    }

    if (
      profile.gameId &&
      profile.gameId.trim()
    ) {
      profile.gameName =
        profile.gameId;

      changes.push(
        "Restored missing game name from the game ID.",
      );
    }
  }

  /**
   * Repair safe graphics configuration issues.
   *
   * We disable incomplete optional graphics components
   * rather than inventing versions or runtime files.
   */
  private repairGraphics(
    profile: MacGameCompatibilityProfile,
    changes: string[],
  ): void {
    const graphics =
      profile.graphics;

    if (
      graphics.dxvk.enabled &&
      !graphics.dxvk.version
    ) {
      graphics.dxvk.enabled =
        false;

      changes.push(
        "Disabled DXVK because it was enabled without a configured version.",
      );
    }

    if (
      graphics.vkd3d.enabled &&
      !graphics.vkd3d.version
    ) {
      graphics.vkd3d.enabled =
        false;

      changes.push(
        "Disabled VKD3D because it was enabled without a configured version.",
      );
    }
  }

  /**
   * Determine whether a repair operation can be attempted.
   */
  canRepair(
    profile: MacGameCompatibilityProfile,
  ): boolean {
    return Boolean(
      profile.gameId &&
        profile.gameId.trim(),
    );
  }

  /**
   * Return a human-readable explanation of the repair policy.
   */
  getRepairPolicy(): string[] {
    return [
      "Back up important configuration before destructive changes.",
      "Make the smallest appropriate change.",
      "Do not invent missing runtime components.",
      "Test after repair.",
      "Restore the previous configuration when repair fails.",
    ];
  }
}

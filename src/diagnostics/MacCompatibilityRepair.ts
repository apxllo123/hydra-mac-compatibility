/**
 * Hydra Mac Compatibility
 *
 * Safe repair coordinator for Windows game compatibility.
 *
 * Repair operations should always prefer reversible changes.
 * Actual filesystem, Wine, dependency, and graphics repairs
 * will be connected through their respective subsystems.
 */

import {
  CompatibilityRepairResult,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacCompatibilityBackups } from "../storage/MacCompatibilityBackups";
import { MacCompatibilityDiagnostics } from "./MacCompatibilityDiagnostics";
import { MacCompatibilityTester } from "./MacCompatibilityTester";

export class MacCompatibilityRepair {
  private readonly backups: MacCompatibilityBackups;
  private readonly diagnostics: MacCompatibilityDiagnostics;
  private readonly tester: MacCompatibilityTester;

  constructor(
    backups = new MacCompatibilityBackups(),
    diagnostics = new MacCompatibilityDiagnostics(),
    tester = new MacCompatibilityTester(
      diagnostics,
    ),
  ) {
    this.backups = backups;
    this.diagnostics = diagnostics;
    this.tester = tester;
  }

  /**
   * Run a safe repair attempt.
   *
   * The current implementation creates a backup and
   * validates the configuration. Actual repair operations
   * will be connected once the underlying subsystems are
   * operational.
   */
  repair(
    profile: MacGameCompatibilityProfile,
    reason = "compatibility-repair",
  ): CompatibilityRepairResult {
    const backup =
      this.backups.create(
        profile,
        reason,
      );

    const diagnostics =
      this.diagnostics.diagnose(
        profile,
      );

    if (!diagnostics.healthy) {
      return {
        gameId: profile.gameId,
        success: false,
        repairedAt:
          new Date().toISOString(),
        message:
          "Repair could not safely proceed because compatibility problems remain unresolved.",
        backupId: backup.id,
      };
    }

    const test =
      this.tester.test(
        profile,
      );

    if (!test.passed) {
      return {
        gameId: profile.gameId,
        success: false,
        repairedAt:
          new Date().toISOString(),
        message:
          "The compatibility test failed after the repair attempt.",
        backupId: backup.id,
      };
    }

    return {
      gameId: profile.gameId,
      success: true,
      repairedAt:
        new Date().toISOString(),
      message:
        "Compatibility configuration passed validation.",
      backupId: backup.id,
    };
  }

  /**
   * Restore a game profile from a backup.
   *
   * The caller is responsible for applying the returned
   * profile to the active game configuration.
   */
  restore(
    gameId: string,
    backupId: string,
  ): MacGameCompatibilityProfile | undefined {
    return this.backups.restore(
      gameId,
      backupId,
    );
  }

  /**
   * Return the latest backup for a game.
   */
  getLatestBackup(
    gameId: string,
  ) {
    return this.backups.getLatest(
      gameId,
    );
  }
}

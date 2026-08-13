/**
 * Hydra Mac Compatibility
 *
 * Safe repair coordinator for Windows game compatibility.
 *
 * Repair operations should always prefer:
 *
 *     Backup
 *       ↓
 *     Change
 *       ↓
 *     Test
 *       ↓
 *     Keep or Restore
 *
 * This class currently provides the orchestration layer.
 * Actual Wine, dependency, graphics, and filesystem repair
 * operations will be connected during integration.
 */

import {
  CompatibilityRepairResult,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

export class MacCompatibilityRepair {
  /**
   * Perform a safe profile-level repair attempt.
   *
   * At this stage, repair only identifies configuration
   * problems that can be safely corrected without modifying
   * the user's game files.
   */
  repair(
    profile: MacGameCompatibilityProfile,
  ): CompatibilityRepairResult {
    const repaired: string[] = [];
    const failures: string[] = [];

    if (!profile.gameId) {
      failures.push(
        "Game ID is missing.",
      );
    }

    if (!profile.gameName) {
      failures.push(
        "Game name is missing.",
      );
    }

    if (!profile.gamePath) {
      failures.push(
        "Game installation path is not configured.",
      );
    }

    if (!profile.wine) {
      failures.push(
        "Wine configuration is missing.",
      );
    } else {
      if (!profile.wine.version) {
        failures.push(
          "Wine version is not configured.",
        );
      }

      if (!profile.wine.prefixPath) {
        failures.push(
          "Wine prefix is not configured.",
        );
      }
    }

    if (!profile.graphics) {
      failures.push(
        "Graphics configuration is missing.",
      );
    }

    const success =
      failures.length === 0;

    if (success) {
      repaired.push(
        "Profile-level compatibility configuration verified.",
      );
    }

    return {
      gameId: profile.gameId,
      success,
      repairedAt: new Date().toISOString(),
      repaired,
      failures,
      backupCreated: false,
    };
  }

  /**
   * Determine whether the repair operation succeeded.
   */
  wasSuccessful(
    result: CompatibilityRepairResult,
  ): boolean {
    return result.success;
  }

  /**
   * Return a human-readable repair summary.
   */
  getSummary(
    result: CompatibilityRepairResult,
  ): string {
    if (result.success) {
      return [
        "Repair completed successfully.",
        ...result.repaired.map(
          (item) => `- ${item}`,
        ),
      ].join("\n");
    }

    return [
      "Repair could not be completed:",
      ...result.failures.map(
        (failure) => `- ${failure}`,
      ),
    ].join("\n");
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Main coordinator for Windows game compatibility on macOS.
 *
 * The manager is intentionally lightweight.
 * Specialized work belongs to the appropriate subsystem:
 *
 * - Wine management
 * - Game profiles
 * - Diagnostics
 * - Dependencies
 * - Graphics
 * - Storage
 */

import {
  CompatibilityDiagnosticResult,
  CompatibilityRepairResult,
  CompatibilityTestResult,
  MacGameCompatibilityProfile,
} from "./MacCompatibilityTypes";

export class MacCompatibilityManager {
  /**
   * Registered game compatibility profiles.
   */
  private readonly profiles = new Map<
    string,
    MacGameCompatibilityProfile
  >();

  /**
   * Register or replace a game's compatibility profile.
   */
  registerProfile(profile: MacGameCompatibilityProfile): void {
    this.profiles.set(profile.gameId, profile);
  }

  /**
   * Remove a game's compatibility profile.
   */
  unregisterProfile(gameId: string): boolean {
    return this.profiles.delete(gameId);
  }

  /**
   * Retrieve a game's compatibility profile.
   */
  getProfile(gameId: string): MacGameCompatibilityProfile | undefined {
    return this.profiles.get(gameId);
  }

  /**
   * Check whether a game has a registered compatibility profile.
   */
  hasProfile(gameId: string): boolean {
    return this.profiles.has(gameId);
  }

  /**
   * Return all registered game profiles.
   */
  getProfiles(): MacGameCompatibilityProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Return the number of registered profiles.
   */
  getProfileCount(): number {
    return this.profiles.size;
  }

  /**
   * Update the compatibility status of a game.
   */
  setStatus(
    gameId: string,
    status: MacGameCompatibilityProfile["status"],
  ): boolean {
    const profile = this.profiles.get(gameId);

    if (!profile) {
      return false;
    }

    profile.status = status;
    return true;
  }

  /**
   * Record the result of a compatibility test.
   *
   * The actual testing is performed by MacCompatibilityTester.
   * This method only records the result.
   */
  recordTestResult(result: CompatibilityTestResult): boolean {
    const profile = this.profiles.get(result.gameId);

    if (!profile) {
      return false;
    }

    profile.lastTested = result.testedAt;
    profile.status = result.passed ? "ready" : "degraded";

    return true;
  }

  /**
   * Record diagnostic information.
   *
   * The actual diagnostic work is performed by
   * MacCompatibilityDiagnostics.
   */
  recordDiagnosticResult(
    result: CompatibilityDiagnosticResult,
  ): boolean {
    const profile = this.profiles.get(result.gameId);

    if (!profile) {
      return false;
    }

    if (result.healthy) {
      profile.status = "ready";
    } else if (
      result.diagnostics.some(
        (diagnostic) =>
          diagnostic.severity === "critical" ||
          diagnostic.severity === "error",
      )
    ) {
      profile.status = "broken";
    } else {
      profile.status = "degraded";
    }

    return true;
  }

  /**
   * Record the result of a repair operation.
   *
   * The actual repair work is performed by
   * MacCompatibilityRepair.
   */
  recordRepairResult(result: CompatibilityRepairResult): boolean {
    const profile = this.profiles.get(result.gameId);

    if (!profile) {
      return false;
    }

    profile.status = result.success ? "ready" : "broken";

    return true;
  }

  /**
   * Clear every registered profile.
   *
   * This only clears the manager's in-memory registry.
   * It does NOT delete files or game data.
   */
  clearProfiles(): void {
    this.profiles.clear();
  }
}

/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for Windows game compatibility on macOS.
 *
 * The manager coordinates compatibility subsystems but does not
 * contain their specialized implementation logic.
 */

import {
  CompatibilityDiagnosticResult,
  CompatibilityRepairResult,
  CompatibilityTestResult,
  MacGameCompatibilityProfile,
} from "./MacCompatibilityTypes";

export class MacCompatibilityManager {
  private readonly profiles = new Map<
    string,
    MacGameCompatibilityProfile
  >();

  /**
   * Register a game compatibility profile.
   *
   * Existing profiles with the same game ID are replaced.
   */
  registerProfile(profile: MacGameCompatibilityProfile): void {
    this.profiles.set(profile.gameId, profile);
  }

  /**
   * Remove a game compatibility profile.
   *
   * This only removes the profile from memory.
   * It does not delete files or game data.
   */
  unregisterProfile(gameId: string): boolean {
    return this.profiles.delete(gameId);
  }

  /**
   * Retrieve a game compatibility profile.
   */
  getProfile(gameId: string): MacGameCompatibilityProfile | undefined {
    return this.profiles.get(gameId);
  }

  /**
   * Check whether a game has a registered profile.
   */
  hasProfile(gameId: string): boolean {
    return this.profiles.has(gameId);
  }

  /**
   * Return all registered profiles.
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
   * Update a game's compatibility status.
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
    profile.lastUpdated = new Date().toISOString();

    return true;
  }

  /**
   * Record the result of a compatibility test.
   *
   * Actual testing belongs to MacCompatibilityTester.
   */
  recordTestResult(result: CompatibilityTestResult): boolean {
    const profile = this.profiles.get(result.gameId);

    if (!profile) {
      return false;
    }

    profile.lastTested = result.testedAt;
    profile.lastUpdated = result.testedAt;
    profile.status = result.passed ? "ready" : "degraded";

    return true;
  }

  /**
   * Record diagnostic information.
   *
   * Actual diagnostic work belongs to MacCompatibilityDiagnostics.
   */
  recordDiagnosticResult(
    result: CompatibilityDiagnosticResult,
  ): boolean {
    const profile = this.profiles.get(result.gameId);

    if (!profile) {
      return false;
    }

    profile.lastDiagnosed = result.diagnosedAt;
    profile.lastUpdated = result.diagnosedAt;

    if (result.healthy) {
      profile.status = "ready";
      return true;
    }

    const hasCriticalIssue = result.diagnostics.some(
      (diagnostic) =>
        diagnostic.severity === "critical" ||
        diagnostic.severity === "error",
    );

    profile.status = hasCriticalIssue ? "broken" : "degraded";

    return true;
  }

  /**
   * Record the result of a repair operation.
   *
   * Actual repair work belongs to MacCompatibilityRepair.
   */
  recordRepairResult(result: CompatibilityRepairResult): boolean {
    const profile = this.profiles.get(result.gameId);

    if (!profile) {
      return false;
    }

    profile.lastRepaired = result.repairedAt;
    profile.lastUpdated = result.repairedAt;
    profile.status = result.success ? "ready" : "broken";

    return true;
  }

  /**
   * Clear all profiles from the in-memory manager.
   *
   * This does NOT delete game data from disk.
   */
  clearProfiles(): void {
    this.profiles.clear();
  }
}

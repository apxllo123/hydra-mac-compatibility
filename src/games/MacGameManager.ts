/**
 * Hydra Mac Compatibility
 *
 * Coordinates Windows game compatibility profiles on macOS.
 *
 * The game manager owns game-level coordination.
 * It does not directly manage Wine, dependencies, graphics,
 * diagnostics, repairs, or filesystem persistence.
 */

import type {
  CompatibilityStatus,
  GameDependency,
  GraphicsConfiguration,
  MacGameCompatibilityProfile,
  WineConfiguration,
} from "../manager/MacCompatibilityTypes";

import {
  MacGameProfile,
  MacGameProfileOptions,
} from "./MacGameProfile";

import { MacGameProfileStore } from "./MacGameProfileStore";

export class MacGameManager {
  private readonly store: MacGameProfileStore;

  constructor(
    store = new MacGameProfileStore(),
  ) {
    this.store = store;
  }

  /**
   * Register a new game.
   */
  register(
    options: MacGameProfileOptions,
  ): MacGameProfile {
    const profile =
      new MacGameProfile(
        options,
      );

    this.store.add(
      profile,
    );

    return profile;
  }

  /**
   * Register or replace a game.
   */
  upsert(
    options: MacGameProfileOptions,
  ): MacGameProfile {
    const profile =
      new MacGameProfile(
        options,
      );

    this.store.upsert(
      profile,
    );

    return profile;
  }

  /**
   * Retrieve a game by ID.
   */
  get(
    gameId: string,
  ): MacGameProfile | undefined {
    return this.store.get(
      gameId,
    );
  }

  /**
   * Check whether a game is registered.
   */
  has(
    gameId: string,
  ): boolean {
    return this.store.has(
      gameId,
    );
  }

  /**
   * Remove a game profile.
   *
   * This does not delete game files.
   */
  remove(
    gameId: string,
  ): boolean {
    return this.store.remove(
      gameId,
    );
  }

  /**
   * Return every registered game.
   */
  getAll(): MacGameProfile[] {
    return this.store.getAll();
  }

  /**
   * Return the number of registered games.
   */
  count(): number {
    return this.store.count();
  }

  /**
   * Find a game by human-readable name.
   */
  findByGameName(
    gameName: string,
  ): MacGameProfile | undefined {
    return this.store.findByGameName(
      gameName,
    );
  }

  /**
   * Find games by compatibility status.
   */
  findByStatus(
    status: CompatibilityStatus,
  ): MacGameProfile[] {
    return this.store.findByStatus(
      status,
    );
  }

  /**
   * Update a game's compatibility status.
   */
  setStatus(
    gameId: string,
    status: CompatibilityStatus,
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setStatus(
      status,
    );

    return true;
  }

  /**
   * Update a game's Wine configuration.
   */
  setWineConfiguration(
    gameId: string,
    wine: WineConfiguration,
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setWineConfiguration(
      wine,
    );

    return true;
  }

  /**
   * Update a game's graphics configuration.
   */
  setGraphicsConfiguration(
    gameId: string,
    graphics: GraphicsConfiguration,
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setGraphicsConfiguration(
      graphics,
    );

    return true;
  }

  /**
   * Replace all dependencies for a game.
   */
  setDependencies(
    gameId: string,
    dependencies: GameDependency[],
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setDependencies(
      dependencies,
    );

    return true;
  }

  /**
   * Add or replace one dependency.
   */
  setDependency(
    gameId: string,
    dependency: GameDependency,
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setDependency(
      dependency,
    );

    return true;
  }

  /**
   * Remove one dependency.
   */
  removeDependency(
    gameId: string,
    dependencyId: string,
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    return profile.removeDependency(
      dependencyId,
    );
  }

  /**
   * Record that a compatibility test was performed.
   */
  recordTest(
    gameId: string,
    passed: boolean,
    testedAt = new Date().toISOString(),
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setLastTested(
      testedAt,
    );

    profile.setStatus(
      passed
        ? "ready"
        : "degraded",
    );

    return true;
  }

  /**
   * Record that diagnostics were performed.
   */
  recordDiagnostic(
    gameId: string,
    healthy: boolean,
    hasCriticalOrError = false,
    diagnosedAt = new Date().toISOString(),
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setLastDiagnosed(
      diagnosedAt,
    );

    if (healthy) {
      profile.setStatus(
        "ready",
      );
    } else if (
      hasCriticalOrError
    ) {
      profile.setStatus(
        "broken",
      );
    } else {
      profile.setStatus(
        "degraded",
      );
    }

    return true;
  }

  /**
   * Record that a repair was performed.
   */
  recordRepair(
    gameId: string,
    success: boolean,
    repairedAt = new Date().toISOString(),
  ): boolean {
    const profile =
      this.store.get(
        gameId,
      );

    if (!profile) {
      return false;
    }

    profile.setLastRepaired(
      repairedAt,
    );

    profile.setStatus(
      success
        ? "ready"
        : "broken",
    );

    return true;
  }

  /**
   * Export one profile as plain data.
   */
  exportProfile(
    gameId: string,
  ):
    | MacGameCompatibilityProfile
    | undefined {
    return this.store.export(
      gameId,
    );
  }

  /**
   * Export every profile.
   */
  exportAll(): MacGameCompatibilityProfile[] {
    return this.store.exportAll();
  }

  /**
   * Import a persisted profile.
   */
  importProfile(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    return this.store.import(
      profile,
    );
  }

  /**
   * Return the underlying profile store.
   */
  getStore(): MacGameProfileStore {
    return this.store;
  }

  /**
   * Clear all in-memory profiles.
   *
   * This does not delete game files.
   */
  clear(): void {
    this.store.clear();
  }
}

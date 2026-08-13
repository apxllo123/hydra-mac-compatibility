/**
 * Hydra Mac Compatibility
 *
 * Central coordinator for Windows game compatibility profiles.
 *
 * The game manager owns game-profile operations.
 * It does not handle Wine, dependencies, graphics, diagnostics,
 * or filesystem persistence directly.
 */

import {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import { MacGameProfile } from "./MacGameProfile";
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
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    return this.store.add(
      profile,
    );
  }

  /**
   * Register or replace a game.
   */
  upsert(
    profile: MacGameCompatibilityProfile,
  ): MacGameProfile {
    return this.store.upsert(
      profile,
    );
  }

  /**
   * Retrieve a game by stable ID.
   */
  get(
    gameId: string,
  ): MacGameProfile | undefined {
    return this.store.get(
      gameId,
    );
  }

  /**
   * Determine whether a game is registered.
   */
  has(
    gameId: string,
  ): boolean {
    return this.store.has(
      gameId,
    );
  }

  /**
   * Remove a game from the manager.
   *
   * This does NOT delete game files.
   */
  remove(
    gameId: string,
  ): boolean {
    return this.store.remove(
      gameId,
    );
  }

  /**
   * Return all registered games.
   */
  getAll(): MacGameProfile[] {
    return this.store.getAll();
  }

  /**
   * Find a game by its human-readable name.
   */
  findByGameName(
    gameName: string,
  ): MacGameProfile | undefined {
    return this.store.findByGameName(
      gameName,
    );
  }

  /**
   * Return the number of registered games.
   */
  count(): number {
    return this.store.count();
  }

  /**
   * Clear the in-memory game registry.
   *
   * This does NOT delete game data from disk.
   */
  clear(): void {
    this.store.clear();
  }
}

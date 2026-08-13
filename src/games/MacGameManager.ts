/**
 * Hydra Mac Compatibility
 *
 * Manager responsible for creating, loading, and organizing
 * individual Windows game compatibility environments.
 */

import type {
  GraphicsConfiguration,
  MacGameCompatibilityProfile,
  WineConfiguration,
} from "../manager/MacCompatibilityTypes";

import {
  MacCompatibilityPaths,
} from "../storage/MacCompatibilityPaths";

import {
  MacGameProfile,
  MacGameProfileOptions,
} from "./MacGameProfile";

import {
  MacGameProfileStore,
} from "./MacGameProfileStore";

export interface CreateGameOptions {
  gameId: string;
  gameName: string;

  /**
   * Wine configuration selected for this game.
   */
  wine: WineConfiguration;

  /**
   * Graphics configuration selected for this game.
   */
  graphics: GraphicsConfiguration;
}

export class MacGameManager {
  private readonly paths: MacCompatibilityPaths;

  private readonly store: MacGameProfileStore;

  constructor(
    paths: MacCompatibilityPaths,
  ) {
    this.paths = paths;
    this.store = new MacGameProfileStore(
      paths,
    );
  }

  /**
   * Create a new game compatibility profile.
   *
   * This creates the game's compatibility directory,
   * but does not create a Wine prefix yet.
   */
  async createGame(
    options: CreateGameOptions,
  ): Promise<MacGameProfile> {
    const existingProfile =
      await this.store.load(
        options.gameName,
      );

    if (existingProfile) {
      throw new Error(
        `A compatibility profile already exists for "${options.gameName}".`,
      );
    }

    const gamePath =
      this.paths.getGamePath(
        options.gameName,
      );

    const profileOptions:
      MacGameProfileOptions = {
      gameId: options.gameId,
      gameName: options.gameName,
      gamePath,
      wine: options.wine,
      graphics: options.graphics,
      schemaVersion: 1,
    };

    const profile =
      new MacGameProfile(
        profileOptions,
      );

    await this.saveGame(
      profile,
    );

    return profile;
  }

  /**
   * Load an existing game profile.
   */
  async loadGame(
    gameName: string,
  ): Promise<MacGameProfile | undefined> {
    const profile =
      await this.store.load(
        gameName,
      );

    if (!profile) {
      return undefined;
    }

    const game =
      new MacGameProfile(
        {
          gameId: profile.gameId,
          gameName: profile.gameName,
          gamePath: profile.gamePath,
          wine: profile.wine,
          graphics: profile.graphics,
          schemaVersion:
            profile.schemaVersion,
        },
      );

    game.loadProfile(
      profile,
    );

    return game;
  }

  /**
   * Save a game profile.
   */
  async saveGame(
    game: MacGameProfile,
  ): Promise<void> {
    await this.store.save(
      game.getProfile(),
    );
  }

  /**
   * Check whether a game has a compatibility profile.
   */
  async gameExists(
    gameName: string,
  ): Promise<boolean> {
    return this.store.exists(
      gameName,
    );
  }

  /**
   * Remove a game's compatibility profile.
   *
   * This does not delete the game's prefix,
   * configuration, logs, backups, or other data.
   */
  async removeGameProfile(
    gameName: string,
  ): Promise<boolean> {
    return this.store.deleteProfile(
      gameName,
    );
  }

  /**
   * List all games known to the compatibility system.
   */
  async listGames(): Promise<string[]> {
    return this.store.listGameNames();
  }

  /**
   * Update a game's Wine configuration.
   */
  async updateWineConfiguration(
    game: MacGameProfile,
    wine: WineConfiguration,
  ): Promise<void> {
    game.setWineConfiguration(
      wine,
    );

    await this.saveGame(
      game,
    );
  }

  /**
   * Update a game's graphics configuration.
   */
  async updateGraphicsConfiguration(
    game: MacGameProfile,
    graphics: GraphicsConfiguration,
  ): Promise<void> {
    game.setGraphicsConfiguration(
      graphics,
    );

    await this.saveGame(
      game,
    );
  }

  /**
   * Update the game's compatibility status.
   */
  async updateStatus(
    game: MacGameProfile,
    status: MacGameCompatibilityProfile["status"],
  ): Promise<void> {
    game.setStatus(
      status,
    );

    await this.saveGame(
      game,
    );
  }
}

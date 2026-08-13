/**
 * Hydra Mac Compatibility
 *
 * Persistent storage for individual game compatibility profiles.
 *
 * This class is responsible for reading and writing
 * compatibility.json files.
 */

import { promises as fs } from "node:fs";

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import {
  MacCompatibilityPaths,
} from "../storage/MacCompatibilityPaths";

export class MacGameProfileStore {
  private readonly paths: MacCompatibilityPaths;

  constructor(paths: MacCompatibilityPaths) {
    this.paths = paths;
  }

  /**
   * Save a game compatibility profile to compatibility.json.
   */
  async save(
    profile: MacGameCompatibilityProfile,
  ): Promise<void> {
    const gamePath = this.paths.getGamePath(
      profile.gameName,
    );

    const profilePath =
      this.paths.getGameCompatibilityProfilePath(
        profile.gameName,
      );

    await fs.mkdir(gamePath, {
      recursive: true,
    });

    const serializedProfile = JSON.stringify(
      profile,
      null,
      2,
    );

    await fs.writeFile(
      profilePath,
      serializedProfile,
      "utf8",
    );
  }

  /**
   * Load a game's compatibility profile.
   *
   * Returns undefined when no profile exists.
   */
  async load(
    gameName: string,
  ): Promise<MacGameCompatibilityProfile | undefined> {
    const profilePath =
      this.paths.getGameCompatibilityProfilePath(
        gameName,
      );

    try {
      const contents = await fs.readFile(
        profilePath,
        "utf8",
      );

      return JSON.parse(
        contents,
      ) as MacGameCompatibilityProfile;
    } catch (error) {
      if (
        this.isFileNotFoundError(error)
      ) {
        return undefined;
      }

      throw error;
    }
  }

  /**
   * Check whether a game's compatibility profile exists.
   */
  async exists(
    gameName: string,
  ): Promise<boolean> {
    const profilePath =
      this.paths.getGameCompatibilityProfilePath(
        gameName,
      );

    try {
      await fs.access(profilePath);
      return true;
    } catch (error) {
      if (
        this.isFileNotFoundError(error)
      ) {
        return false;
      }

      throw error;
    }
  }

  /**
   * Delete a game's compatibility profile.
   *
   * This only removes compatibility.json.
   * It does NOT delete the game's prefix or other data.
   */
  async deleteProfile(
    gameName: string,
  ): Promise<boolean> {
    const profilePath =
      this.paths.getGameCompatibilityProfilePath(
        gameName,
      );

    try {
      await fs.unlink(profilePath);
      return true;
    } catch (error) {
      if (
        this.isFileNotFoundError(error)
      ) {
        return false;
      }

      throw error;
    }
  }

  /**
   * List game directories currently stored by the
   * compatibility system.
   */
  async listGameNames(): Promise<string[]> {
    const gamesPath =
      this.paths.getGamesPath();

    try {
      const entries = await fs.readdir(
        gamesPath,
        {
          withFileTypes: true,
        },
      );

      return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch (error) {
      if (
        this.isFileNotFoundError(error)
      ) {
        return [];
      }

      throw error;
    }
  }

  /**
   * Determine whether an error represents a missing file
   * or directory.
   */
  private isFileNotFoundError(
    error: unknown,
  ): boolean {
    return (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    );
  }
}

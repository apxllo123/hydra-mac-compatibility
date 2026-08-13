/**
 * Hydra Mac Compatibility
 *
 * Represents a single Windows game and its compatibility
 * environment on macOS.
 */

import type {
  GraphicsConfiguration,
  MacGameCompatibilityProfile,
  WineConfiguration,
} from "../manager/MacCompatibilityTypes";

export interface MacGameProfileOptions {
  gameId: string;
  gameName: string;
  gamePath: string;
  wine: WineConfiguration;
  graphics: GraphicsConfiguration;
  schemaVersion?: number;
}

/**
 * Represents one Windows game managed by Hydra's
 * Mac Compatibility system.
 */
export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;

  constructor(options: MacGameProfileOptions) {
    this.profile = {
      gameId: options.gameId,
      gameName: options.gameName,
      gamePath: options.gamePath,

      wine: options.wine,
      graphics: options.graphics,

      installedDependencies: [],

      status: "unknown",

      schemaVersion: options.schemaVersion ?? 1,
    };
  }

  /**
   * Return the complete compatibility profile.
   */
  getProfile(): MacGameCompatibilityProfile {
    return {
      ...this.profile,
      wine: {
        ...this.profile.wine,
        environment: this.profile.wine.environment
          ? { ...this.profile.wine.environment }
          : undefined,
      },
      graphics: {
        ...this.profile.graphics,
        environment: this.profile.graphics.environment
          ? { ...this.profile.graphics.environment }
          : undefined,
      },
      installedDependencies: [
        ...this.profile.installedDependencies,
      ],
    };
  }

  /**
   * Return the game's stable ID.
   */
  getGameId(): string {
    return this.profile.gameId;
  }

  /**
   * Return the game's display name.
   */
  getGameName(): string {
    return this.profile.gameName;
  }

  /**
   * Return the game's compatibility directory.
   */
  getGamePath(): string {
    return this.profile.gamePath;
  }

  /**
   * Return the current Wine configuration.
   */
  getWineConfiguration(): WineConfiguration {
    return {
      ...this.profile.wine,
      environment: this.profile.wine.environment
        ? { ...this.profile.wine.environment }
        : undefined,
    };
  }

  /**
   * Return the current graphics configuration.
   */
  getGraphicsConfiguration(): GraphicsConfiguration {
    return {
      ...this.profile.graphics,
      environment: this.profile.graphics.environment
        ? { ...this.profile.graphics.environment }
        : undefined,
    };
  }

  /**
   * Change the Wine configuration.
   */
  setWineConfiguration(
    wine: WineConfiguration,
  ): void {
    this.profile.wine = wine;
  }

  /**
   * Change the graphics configuration.
   */
  setGraphicsConfiguration(
    graphics: GraphicsConfiguration,
  ): void {
    this.profile.graphics = graphics;
  }

  /**
   * Update the compatibility status.
   */
  setStatus(
    status: MacGameCompatibilityProfile["status"],
  ): void {
    this.profile.status = status;
  }

  /**
   * Return the current compatibility status.
   */
  getStatus(): MacGameCompatibilityProfile["status"] {
    return this.profile.status;
  }

  /**
   * Update the last-tested timestamp.
   */
  setLastTested(timestamp: string): void {
    this.profile.lastTested = timestamp;
  }

  /**
   * Return the last-tested timestamp.
   */
  getLastTested(): string | undefined {
    return this.profile.lastTested;
  }

  /**
   * Replace the complete profile.
   *
   * Useful when loading a profile from persistent storage.
   */
  loadProfile(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profile = {
      ...profile,
      installedDependencies: [
        ...profile.installedDependencies,
      ],
    };
  }
}

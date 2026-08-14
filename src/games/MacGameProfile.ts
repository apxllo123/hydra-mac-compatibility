/**
 * Hydra Mac Compatibility
 *
 * Represents one Windows game's compatibility profile.
 *
 * A profile is the central per-game record containing the
 * configuration Hydra needs to remember what worked.
 */
import type {
  CompatibilityStatus,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";
export class MacGameProfile {
  private profile: MacGameCompatibilityProfile;
  constructor(
    profile: MacGameCompatibilityProfile,
  ) {
    this.profile = this.clone(profile);
  }
  /**
   * Return the complete game compatibility profile.
   */
  getProfile(): MacGameCompatibilityProfile {
    return this.clone(this.profile);
  }
  /**
   * Return the game's stable ID.
   */
  getGameId(): string {
    return this.profile.gameId;
  }
  /**
   * Return the game's human-readable name.
   */
  getGameName(): string {
    return this.profile.gameName;
  }
  /**
   * Return the current compatibility status.
   */
  getStatus(): CompatibilityStatus {
    return this.profile.status;
  }
  /**
   * Update the compatibility status.
   */
  setStatus(
    status: CompatibilityStatus,
  ): void {
    this.profile.status = status;
  }
  /**
   * Return the installed game path.
   */
  getGamePath(): string {
    return this.profile.gamePath;
  }
  /**
   * Update the installed game path.
   */
  setGamePath(
    gamePath: string,
  ): void {
    this.profile.gamePath = gamePath;
  }
  /**
   * Return the configured Wine information.
   */
  getWine(): MacGameCompatibilityProfile["wine"] {
    return this.profile.wine;
  }
  /**
   * Update the Wine configuration.
   */
  setWine(
    wine: MacGameCompatibilityProfile["wine"],
  ): void {
    this.profile.wine = {
      ...wine,
      environmentVariables: wine.environmentVariables
        ? { ...wine.environmentVariables }
        : undefined,
    };
  }
  /**
   * Return the graphics configuration.
   */
  getGraphics(): MacGameCompatibilityProfile["graphics"] {
    return this.profile.graphics;
  }
  /**
   * Update the graphics configuration.
   */
  setGraphics(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): void {
    this.profile.graphics = {
      ...graphics,
      dxvk: {
        ...graphics.dxvk,
      },
      vkd3d: {
        ...graphics.vkd3d,
      },
      environmentVariables: {
        ...graphics.environmentVariables,
      },
      compatibilityFlags: [
        ...graphics.compatibilityFlags,
      ],
    };
  }
  /**
   * Return a copy of the dependency list.
   */
  getDependencies() {
    return this.profile.dependencies.map(
      (dependency) => ({
        ...dependency,
      }),
    );
  }
  /**
   * Return the timestamp of the last compatibility test.
   */
  getLastTested(): string | undefined {
    return this.profile.lastTested;
  }
  /**
   * Update the last-tested timestamp.
   */
  setLastTested(
    timestamp: string,
  ): void {
    this.profile.lastTested = timestamp;
  }
  /**
   * Replace the entire profile.
   */
  replace(
    profile: MacGameCompatibilityProfile,
  ): void {
    this.profile = this.clone(profile);
  }
  /**
   * Create a safe copy of the profile.
   */
  private clone(
    profile: MacGameCompatibilityProfile,
  ): MacGameCompatibilityProfile {
    return {
      ...profile,
      wine: {
        ...profile.wine,
        environmentVariables:
          profile.wine.environmentVariables
            ? {
                ...profile.wine.environmentVariables,
              }
            : undefined,
      },
      graphics: {
        ...profile.graphics,
        dxvk: {
          ...profile.graphics.dxvk,
        },
        vkd3d: {
          ...profile.graphics.vkd3d,
        },
        environmentVariables: {
          ...profile.graphics.environmentVariables,
        },
        compatibilityFlags: [
          ...profile.graphics.compatibilityFlags,
        ],
      },
      dependencies: profile.dependencies.map(
        (dependency) => ({
          ...dependency,
        }),
      ),
      backups: profile.backups.map(
        (backup) => ({
          ...backup,
        }),
      ),
      lastKnownGoodConfiguration:
        profile.lastKnownGoodConfiguration
          ? {
              ...profile.lastKnownGoodConfiguration,
              dependencies:
                profile.lastKnownGoodConfiguration
                  .dependencies.map(
                    (dependency) => ({
                      ...dependency,
                    }),
                  ),
              wine:
                profile.lastKnownGoodConfiguration.wine
                  ? {
                      ...profile.lastKnownGoodConfiguration
                        .wine,
                    }
                  : undefined,
              graphics:
                profile.lastKnownGoodConfiguration.graphics
                  ? {
                      ...profile.lastKnownGoodConfiguration
                        .graphics,
                      dxvk: {
                        ...profile.lastKnownGoodConfiguration
                          .graphics.dxvk,
                      },
                      vkd3d: {
                        ...profile.lastKnownGoodConfiguration
                          .graphics.vkd3d,
                      },
                      environmentVariables: {
                        ...profile.lastKnownGoodConfiguration
                          .graphics.environmentVariables,
                      },
                      compatibilityFlags: [
                        ...profile.lastKnownGoodConfiguration
                          .graphics.compatibilityFlags,
                      ],
                    }
                  : undefined,
            }
          : undefined,
    };
  }
}

⸻

2. src/graphics/MacGraphicsProfile.ts

I found the exact error.

Your current method is:

setBackend(backend: string): void

but our central type correctly says the backend must be one of the allowed GraphicsBackend values. (GitHub)

So this is a small, correct type fix, not a workaround.

Replace the file with:

:::writing{variant=“document” id=“30584” title=“src/graphics/MacGraphicsProfile.ts”}

/**
 * Hydra Mac Compatibility
 *
 * Represents the graphics configuration for a Windows game
 * running through the macOS compatibility layer.
 *
 * This class manages graphics configuration only.
 * It does not apply settings to Wine or the game runtime.
 */
import type {
  GraphicsBackend,
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";
export class MacGraphicsProfile {
  private graphics: MacGameCompatibilityProfile["graphics"];
  constructor(
    graphics: MacGameCompatibilityProfile["graphics"],
  ) {
    this.graphics = this.clone(graphics);
  }
  /**
   * Return the complete graphics configuration.
   */
  get(): MacGameCompatibilityProfile["graphics"] {
    return this.clone(this.graphics);
  }
  /**
   * Return the configured graphics backend.
   */
  getBackend(): GraphicsBackend {
    return this.graphics.backend;
  }
  /**
   * Change the graphics backend.
   */
  setBackend(
    backend: GraphicsBackend,
  ): void {
    this.graphics.backend = backend;
  }
  /**
   * Determine whether DXVK is enabled.
   */
  isDxvkEnabled(): boolean {
    return this.graphics.dxvk.enabled;
  }
  /**
   * Enable or disable DXVK.
   */
  setDxvkEnabled(
    enabled: boolean,
  ): void {
    this.graphics.dxvk.enabled = enabled;
  }
  /**
   * Return the configured DXVK version.
   */
  getDxvkVersion(): string | undefined {
    return this.graphics.dxvk.version;
  }
  /**
   * Set the DXVK version.
   */
  setDxvkVersion(
    version: string | undefined,
  ): void {
    this.graphics.dxvk.version = version;
  }
  /**
   * Determine whether VKD3D is enabled.
   */
  isVkd3dEnabled(): boolean {
    return this.graphics.vkd3d.enabled;
  }
  /**
   * Enable or disable VKD3D.
   */
  setVkd3dEnabled(
    enabled: boolean,
  ): void {
    this.graphics.vkd3d.enabled = enabled;
  }
  /**
   * Return the configured VKD3D version.
   */
  getVkd3dVersion(): string | undefined {
    return this.graphics.vkd3d.version;
  }
  /**
   * Set the VKD3D version.
   */
  setVkd3dVersion(
    version: string | undefined,
  ): void {
    this.graphics.vkd3d.version = version;
  }
  /**
   * Return all environment variables.
   */
  getEnvironmentVariables(): Record<
    string,
    string
  > {
    return {
      ...this.graphics.environmentVariables,
    };
  }
  /**
   * Set an environment variable.
   */
  setEnvironmentVariable(
    name: string,
    value: string,
  ): void {
    this.graphics.environmentVariables[name] =
      value;
  }
  /**
   * Remove an environment variable.
   */
  removeEnvironmentVariable(
    name: string,
  ): boolean {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.graphics.environmentVariables,
        name,
      )
    ) {
      return false;
    }
    delete this.graphics.environmentVariables[name];
    return true;
  }
  /**
   * Return compatibility flags.
   */
  getCompatibilityFlags(): string[] {
    return [
      ...this.graphics.compatibilityFlags,
    ];
  }
  /**
   * Add a compatibility flag.
   */
  addCompatibilityFlag(
    flag: string,
  ): void {
    if (
      !this.graphics.compatibilityFlags.includes(
        flag,
      )
    ) {
      this.graphics.compatibilityFlags.push(
        flag,
      );
    }
  }
  /**
   * Remove a compatibility flag.
   */
  removeCompatibilityFlag(
    flag: string,
  ): boolean {
    const index =
      this.graphics.compatibilityFlags.indexOf(
        flag,
      );
    if (index === -1) {
      return false;
    }
    this.graphics.compatibilityFlags.splice(
      index,
      1,
    );
    return true;
  }
  /**
   * Replace the entire graphics configuration.
   */
  replace(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): void {
    this.graphics = this.clone(graphics);
  }
  /**
   * Create a safe copy of the graphics configuration.
   */
  private clone(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): MacGameCompatibilityProfile["graphics"] {
    return {
      ...graphics,
      dxvk: {
        ...graphics.dxvk,
      },
      vkd3d: {
        ...graphics.vkd3d,
      },
      environmentVariables: {
        ...graphics.environmentVariables,
      },
      compatibilityFlags: [
        ...graphics.compatibilityFlags,
      ],
    };
  }
}

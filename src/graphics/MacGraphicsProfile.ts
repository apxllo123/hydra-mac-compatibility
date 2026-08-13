/**
 * Hydra Mac Compatibility
 *
 * Represents the graphics configuration for a Windows game
 * running through the macOS compatibility layer.
 *
 * This class manages graphics configuration only.
 * It does not apply settings to Wine or the game runtime.
 */

import {
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
  getBackend(): string {
    return this.graphics.backend;
  }

  /**
   * Change the graphics backend.
   */
  setBackend(
    backend: string,
  ): void {
    this.graphics.backend =
      backend;
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
    this.graphics.dxvk.enabled =
      enabled;
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
    this.graphics.dxvk.version =
      version;
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
    this.graphics.vkd3d.enabled =
      enabled;
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
    this.graphics.vkd3d.version =
      version;
  }

  /**
   * Return all environment variables.
   */
  getEnvironmentVariables(): Record<
    string,
    string
  > {
    return {
      ...this.graphics
        .environmentVariables,
    };
  }

  /**
   * Set an environment variable.
   */
  setEnvironmentVariable(
    name: string,
    value: string,
  ): void {
    this.graphics.environmentVariables[
      name
    ] = value;
  }

  /**
   * Remove an environment variable.
   */
  removeEnvironmentVariable(
    name: string,
  ): boolean {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.graphics
          .environmentVariables,
        name,
      )
    ) {
      return false;
    }

    delete this.graphics
      .environmentVariables[name];

    return true;
  }

  /**
   * Return compatibility flags.
   */
  getCompatibilityFlags(): string[] {
    return [
      ...this.graphics
        .compatibilityFlags,
    ];
  }

  /**
   * Add a compatibility flag.
   */
  addCompatibilityFlag(
    flag: string,
  ): void {
    if (
      !this.graphics
        .compatibilityFlags
        .includes(flag)
    ) {
      this.graphics
        .compatibilityFlags
        .push(flag);
    }
  }

  /**
   * Remove a compatibility flag.
   */
  removeCompatibilityFlag(
    flag: string,
  ): boolean {
    const index =
      this.graphics
        .compatibilityFlags
        .indexOf(flag);

    if (index === -1) {
      return false;
    }

    this.graphics
      .compatibilityFlags
      .splice(index, 1);

    return true;
  }

  /**
   * Replace the entire graphics configuration.
   */
  replace(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): void {
    this.graphics =
      this.clone(graphics);
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

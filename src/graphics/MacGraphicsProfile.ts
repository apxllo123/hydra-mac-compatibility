/**
 * Hydra Mac Compatibility
 *
 * Per-game graphics configuration.
 *
 * Graphics settings belong to the individual game profile
 * and must never be shared accidentally between games.
 */

import {
  MacGraphicsConfiguration,
} from "../manager/MacCompatibilityTypes";

export class MacGraphicsProfile {
  private configuration: MacGraphicsConfiguration;

  constructor(
    configuration: MacGraphicsConfiguration,
  ) {
    this.configuration =
      this.clone(configuration);
  }

  /**
   * Return the complete graphics configuration.
   */
  getConfiguration(): MacGraphicsConfiguration {
    return this.clone(
      this.configuration,
    );
  }

  /**
   * Return the selected graphics backend.
   */
  getBackend(): MacGraphicsConfiguration["backend"] {
    return this.configuration.backend;
  }

  /**
   * Change the graphics backend.
   */
  setBackend(
    backend: MacGraphicsConfiguration["backend"],
  ): void {
    this.configuration.backend =
      backend;
  }

  /**
   * Determine whether DXVK is enabled.
   */
  isDxvkEnabled(): boolean {
    return this.configuration.dxvk.enabled;
  }

  /**
   * Enable or disable DXVK.
   */
  setDxvkEnabled(
    enabled: boolean,
  ): void {
    this.configuration.dxvk.enabled =
      enabled;
  }

  /**
   * Determine whether VKD3D is enabled.
   */
  isVkd3dEnabled(): boolean {
    return this.configuration.vkd3d.enabled;
  }

  /**
   * Enable or disable VKD3D.
   */
  setVkd3dEnabled(
    enabled: boolean,
  ): void {
    this.configuration.vkd3d.enabled =
      enabled;
  }

  /**
   * Update the DXVK version.
   */
  setDxvkVersion(
    version?: string,
  ): void {
    this.configuration.dxvk.version =
      version;
  }

  /**
   * Update the VKD3D version.
   */
  setVkd3dVersion(
    version?: string,
  ): void {
    this.configuration.vkd3d.version =
      version;
  }

  /**
   * Return environment variables.
   */
  getEnvironmentVariables(): Record<
    string,
    string
  > {
    return {
      ...this.configuration
        .environmentVariables,
    };
  }

  /**
   * Set an environment variable.
   */
  setEnvironmentVariable(
    key: string,
    value: string,
  ): void {
    this.configuration.environmentVariables[
      key
    ] = value;
  }

  /**
   * Remove an environment variable.
   */
  removeEnvironmentVariable(
    key: string,
  ): boolean {
    if (
      !Object.prototype.hasOwnProperty.call(
        this.configuration
          .environmentVariables,
        key,
      )
    ) {
      return false;
    }

    delete this.configuration
      .environmentVariables[key];

    return true;
  }

  /**
   * Return compatibility flags.
   */
  getCompatibilityFlags(): string[] {
    return [
      ...this.configuration
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
      !this.configuration
        .compatibilityFlags
        .includes(flag)
    ) {
      this.configuration
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
      this.configuration
        .compatibilityFlags
        .indexOf(flag);

    if (index === -1) {
      return false;
    }

    this.configuration
      .compatibilityFlags
      .splice(index, 1);

    return true;
  }

  /**
   * Update notes attached to the graphics profile.
   */
  setNotes(
    notes?: string,
  ): void {
    this.configuration.notes =
      notes;
  }

  /**
   * Create a safe copy of the configuration.
   */
  private clone(
    configuration: MacGraphicsConfiguration,
  ): MacGraphicsConfiguration {
    return {
      ...configuration,

      dxvk: {
        ...configuration.dxvk,
      },

      vkd3d: {
        ...configuration.vkd3d,
      },

      environmentVariables: {
        ...configuration
          .environmentVariables,
      },

      compatibilityFlags: [
        ...configuration
          .compatibilityFlags,
      ],
    };
  }
}

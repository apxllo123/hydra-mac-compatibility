/**
 * Hydra Mac Compatibility
 *
 * Per-game graphics compatibility profile.
 *
 * Graphics settings belong to the individual game and should
 * never accidentally affect another game's configuration.
 */

import {
  MacGraphicsConfiguration,
} from "../manager/MacCompatibilityTypes";

export class MacGraphicsProfile {
  private configuration: MacGraphicsConfiguration;

  constructor(
    configuration: MacGraphicsConfiguration,
  ) {
    this.configuration = {
      ...configuration,

      environmentVariables: {
        ...configuration.environmentVariables,
      },

      compatibilityFlags: [
        ...configuration.compatibilityFlags,
      ],
    };
  }

  /**
   * Return the current graphics configuration.
   */
  getConfiguration(): MacGraphicsConfiguration {
    return {
      ...this.configuration,

      environmentVariables: {
        ...this.configuration.environmentVariables,
      },

      compatibilityFlags: [
        ...this.configuration.compatibilityFlags,
      ],
    };
  }

  /**
   * Replace the complete graphics configuration.
   */
  setConfiguration(
    configuration: MacGraphicsConfiguration,
  ): void {
    this.configuration = {
      ...configuration,

      environmentVariables: {
        ...configuration.environmentVariables,
      },

      compatibilityFlags: [
        ...configuration.compatibilityFlags,
      ],
    };
  }

  /**
   * Enable or disable DXVK.
   */
  setDXVKEnabled(
    enabled: boolean,
  ): void {
    this.configuration.dxvkEnabled =
      enabled;
  }

  /**
   * Enable or disable VKD3D.
   */
  setVKD3DEnabled(
    enabled: boolean,
  ): void {
    this.configuration.vkd3dEnabled =
      enabled;
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
   * Set the DXVK version.
   */
  setDXVKVersion(
    version: string | undefined,
  ): void {
    this.configuration.dxvkVersion =
      version;
  }

  /**
   * Set the VKD3D version.
   */
  setVKD3DVersion(
    version: string | undefined,
  ): void {
    this.configuration.vkd3dVersion =
      version;
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
  ): void {
    delete this.configuration
      .environmentVariables[key];
  }

  /**
   * Add a compatibility flag.
   */
  addCompatibilityFlag(
    flag: string,
  ): void {
    if (
      !this.configuration.compatibilityFlags.includes(
        flag,
      )
    ) {
      this.configuration.compatibilityFlags.push(
        flag,
      );
    }
  }

  /**
   * Remove a compatibility flag.
   */
  removeCompatibilityFlag(
    flag: string,
  ): void {
    this.configuration.compatibilityFlags =
      this.configuration.compatibilityFlags.filter(
        (existingFlag) =>
          existingFlag !== flag,
      );
  }

  /**
   * Update notes describing this graphics configuration.
   */
  setNotes(
    notes: string,
  ): void {
    this.configuration.notes =
      notes;
  }

  /**
   * Validate the current configuration.
   *
   * This performs structural validation only.
   * It does not determine whether a particular GPU,
   * Wine version, DXVK version, or game supports it.
   */
  isValid(): boolean {
    if (!this.configuration.backend) {
      return false;
    }

    if (
      this.configuration.dxvkEnabled &&
      this.configuration.vkd3dEnabled
    ) {
      // Both can potentially exist in the same environment,
      // so this is intentionally NOT considered an error.
      // Keep the configuration valid.
    }

    return true;
  }
}

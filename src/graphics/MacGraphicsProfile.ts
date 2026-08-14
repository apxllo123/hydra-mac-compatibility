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
} from "../manager/MacCompatibilityTypes.js";

export class MacGraphicsProfile {
  private graphics: MacGameCompatibilityProfile["graphics"];

  constructor(
    graphics: MacGameCompatibilityProfile["graphics"],
  ) {
    this.graphics = this.clone(graphics);
  }

  get(): MacGameCompatibilityProfile["graphics"] {
    return this.clone(this.graphics);
  }

  getBackend(): GraphicsBackend {
    return this.graphics.backend;
  }

  setBackend(backend: GraphicsBackend): void {
    this.graphics.backend = backend;
  }

  isDxvkEnabled(): boolean {
    return this.graphics.dxvk.enabled;
  }

  setDxvkEnabled(enabled: boolean): void {
    this.graphics.dxvk.enabled = enabled;
  }

  getDxvkVersion(): string | undefined {
    return this.graphics.dxvk.version;
  }

  setDxvkVersion(
    version: string | undefined,
  ): void {
    this.graphics.dxvk.version = version;
  }

  isVkd3dEnabled(): boolean {
    return this.graphics.vkd3d.enabled;
  }

  setVkd3dEnabled(enabled: boolean): void {
    this.graphics.vkd3d.enabled = enabled;
  }

  getVkd3dVersion(): string | undefined {
    return this.graphics.vkd3d.version;
  }

  setVkd3dVersion(
    version: string | undefined,
  ): void {
    this.graphics.vkd3d.version = version;
  }

  getEnvironmentVariables(): Record<string, string> {
    return {
      ...this.graphics.environmentVariables,
    };
  }

  setEnvironmentVariable(
    name: string,
    value: string,
  ): void {
    this.graphics.environmentVariables[name] = value;
  }

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

  getCompatibilityFlags(): string[] {
    return [
      ...this.graphics.compatibilityFlags,
    ];
  }

  addCompatibilityFlag(flag: string): void {
    if (
      !this.graphics.compatibilityFlags.includes(
        flag,
      )
    ) {
      this.graphics.compatibilityFlags.push(flag);
    }
  }

  removeCompatibilityFlag(flag: string): boolean {
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

  replace(
    graphics: MacGameCompatibilityProfile["graphics"],
  ): void {
    this.graphics = this.clone(graphics);
  }

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

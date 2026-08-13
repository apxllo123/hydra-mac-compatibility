/**
 * Hydra Mac Compatibility
 *
 * Defines the per-game graphics compatibility profile.
 *
 * This file contains data structures only.
 * It does not modify the game or Wine environment.
 */

/**
 * Graphics backends supported by the compatibility layer.
 *
 * "auto" allows the compatibility system to select
 * the appropriate backend later.
 */
export type MacGraphicsBackend =
  | "auto"
  | "vulkan"
  | "metal"
  | "opengl";

/**
 * Per-game graphics compatibility configuration.
 */
export interface MacGraphicsProfile {
  /**
   * Graphics backend used by the compatibility environment.
   */
  backend: MacGraphicsBackend;

  /**
   * Whether DXVK is enabled for this game.
   *
   * DXVK translates DirectX 9/10/11 calls to Vulkan.
   */
  dxvkEnabled: boolean;

  /**
   * Whether VKD3D is enabled for this game.
   *
   * VKD3D is used for DirectX 12 compatibility.
   */
  vkd3dEnabled: boolean;

  /**
   * Optional DXVK version selected for this game.
   */
  dxvkVersion?: string;

  /**
   * Optional VKD3D version selected for this game.
   */
  vkd3dVersion?: string;

  /**
   * Optional environment variables used by the game.
   */
  environmentVariables: Record<
    string,
    string
  >;

  /**
   * Additional compatibility flags.
   *
   * These are intentionally represented as strings so
   * new flags can be added without changing the core
   * profile structure every time.
   */
  compatibilityFlags: string[];

  /**
   * Optional notes describing why this configuration
   * was selected.
   */
  notes?: string;
}

/**
 * Create a safe default graphics profile.
 */
export function createDefaultMacGraphicsProfile(): MacGraphicsProfile {
  return {
    backend: "auto",

    dxvkEnabled: false,

    vkd3dEnabled: false,

    environmentVariables: {},

    compatibilityFlags: [],
  };
}

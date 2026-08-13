/**
 * Hydra Mac Compatibility
 *
 * Shared types used by the Windows Compatibility system.
 *
 * This file intentionally contains types only.
 * Business logic belongs in the appropriate manager/service.
 */

/**
 * Overall compatibility state of a game.
 */
export type CompatibilityStatus =
  | "unknown"
  | "ready"
  | "needs_setup"
  | "degraded"
  | "broken"
  | "testing";

/**
 * Supported graphics backends.
 */
export type GraphicsBackend =
  | "auto"
  | "metal"
  | "vulkan"
  | "dxvk"
  | "vkd3d"
  | "opengl";

/**
 * Wine configuration for a game.
 */
export interface WineConfiguration {
  /**
   * Identifier of the Wine build being used.
   */
  version: string;

  /**
   * Path to the Wine installation.
   */
  path: string;

  /**
   * Path to the game's Wine prefix.
   */
  prefixPath: string;

  /**
   * Optional Wine environment variables.
   */
  environment?: Record<string, string>;
}

/**
 * Graphics configuration for a game.
 */
export interface GraphicsConfiguration {
  backend: GraphicsBackend;

  /**
   * Whether DXVK is enabled for DirectX 9/10/11 translation.
   */
  dxvkEnabled: boolean;

  /**
   * Whether VKD3D is enabled for DirectX 12 translation.
   */
  vkd3dEnabled: boolean;

  /**
   * Optional graphics environment variables.
   */
  environment?: Record<string, string>;
}

/**
 * A Windows dependency installed into a game's environment.
 */
export interface GameDependency {
  /**
   * Dependency identifier, such as "vcrun2022".
   */
  id: string;

  /**
   * Human-readable dependency name.
   */
  name: string;

  /**
   * Installed version, when known.
   */
  version?: string;

  /**
   * Whether the dependency was installed successfully.
   */
  installed: boolean;

  /**
   * When the dependency was installed.
   */
  installedAt?: string;
}

/**
 * A known-good configuration that Hydra can return to.
 */
export interface KnownGoodConfiguration {
  wine: WineConfiguration;
  graphics: GraphicsConfiguration;
  dependencies: GameDependency[];

  /**
   * ISO 8601 timestamp.
   */
  recordedAt: string;

  /**
   * Optional description explaining why this configuration
   * was saved.
   */
  description?: string;
}

/**
 * Complete compatibility profile for a Windows game.
 */
export interface MacGameCompatibilityProfile {
  /**
   * Human-readable game name.
   */
  gameName: string;

  /**
   * Stable identifier for the game.
   */
  gameId: string;

  /**
   * Absolute path to the game's compatibility directory.
   */
  gamePath: string;

  wine: WineConfiguration;
  graphics: GraphicsConfiguration;

  /**
   * Dependencies currently known to be installed.
   */
  installedDependencies: GameDependency[];

  /**
   * Most recent known-good configuration.
   */
  lastKnownGoodConfiguration?: KnownGoodConfiguration;

  /**
   * ISO 8601 timestamp of the most recent compatibility test.
   */
  lastTested?: string;

  status: CompatibilityStatus;

  /**
   * Profile schema version.
   *
   * This allows future migrations when the structure changes.
   */
  schemaVersion: number;
}

/**
 * Severity of a diagnostic finding.
 */
export type DiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

/**
 * A single diagnostic finding.
 */
export interface CompatibilityDiagnostic {
  id: string;
  severity: DiagnosticSeverity;
  title: string;
  message: string;

  /**
   * Whether the issue can potentially be repaired automatically.
   */
  repairable: boolean;
}

/**
 * Result returned by the compatibility diagnostic system.
 */
export interface CompatibilityDiagnosticResult {
  gameId: string;

  /**
   * ISO 8601 timestamp.
   */
  checkedAt: string;

  healthy: boolean;
  diagnostics: CompatibilityDiagnostic[];
}

/**
 * Result of a compatibility test.
 */
export interface CompatibilityTestResult {
  gameId: string;

  /**
   * ISO 8601 timestamp.
   */
  testedAt: string;

  passed: boolean;

  /**
   * How long the test took in milliseconds.
   */
  durationMs: number;

  diagnostics: CompatibilityDiagnostic[];
}

/**
 * Result of a repair operation.
 */
export interface CompatibilityRepairResult {
  gameId: string;

  /**
   * ISO 8601 timestamp.
   */
  repairedAt: string;

  success: boolean;

  /**
   * Human-readable description of what was repaired.
   */
  actions: string[];

  diagnostics: CompatibilityDiagnostic[];
}

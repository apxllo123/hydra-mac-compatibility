/**
 * Hydra Mac Compatibility
 *
 * Shared type definitions for Windows game compatibility on macOS.
 *
 * This file is the central contract used by the compatibility system.
 * Other subsystems should import these types instead of creating
 * competing versions of the same data structures.
 */

/* -------------------------------------------------------------------------- */
/* Compatibility Status                                                       */
/* -------------------------------------------------------------------------- */

export type CompatibilityStatus =
  | "unknown"
  | "ready"
  | "degraded"
  | "broken"
  | "testing"
  | "repairing";

/* -------------------------------------------------------------------------- */
/* Wine                                                                         */
/* -------------------------------------------------------------------------- */

export interface WineConfiguration {
  /**
   * Human-readable Wine version.
   */
  version: string;

  /**
   * Optional path to the Wine executable/runtime.
   */
  executablePath?: string;

  /**
   * Per-game Wine prefix.
   */
  prefixPath: string;

  /**
   * Whether this Wine configuration is currently selected
   * for the game.
   */
  enabled: boolean;
}

/* -------------------------------------------------------------------------- */
/* Dependencies                                                               */
/* -------------------------------------------------------------------------- */

export type DependencyStatus =
  | "unknown"
  | "available"
  | "installed"
  | "missing"
  | "unsupported"
  | "failed";

export interface GameDependency {
  /**
   * Stable dependency identifier.
   */
  id: string;

  /**
   * Human-readable dependency name.
   */
  name: string;

  /**
   * Optional version.
   */
  version?: string;

  /**
   * Current installation status.
   */
  status: DependencyStatus;

  /**
   * Whether the dependency is required for the game.
   */
  required: boolean;
}

/**
 * Backwards-compatible alias for code that uses MacDependency.
 *
 * New code should prefer GameDependency.
 */
export type MacDependency = GameDependency;

/* -------------------------------------------------------------------------- */
/* Graphics                                                                    */
/* -------------------------------------------------------------------------- */

export type GraphicsBackend =
  | "auto"
  | "vulkan"
  | "metal"
  | "opengl"
  | "directx"
  | "unknown";

export interface GraphicsConfiguration {
  /**
   * Graphics backend used by the compatibility environment.
   */
  backend: GraphicsBackend;

  /**
   * Whether DXVK is enabled.
   */
  dxvkEnabled: boolean;

  /**
   * Optional DXVK version.
   */
  dxvkVersion?: string;

  /**
   * Whether VKD3D is enabled.
   */
  vkd3dEnabled: boolean;

  /**
   * Optional VKD3D version.
   */
  vkd3dVersion?: string;

  /**
   * Environment variables applied to the game.
   */
  environmentVariables: Record<string, string>;

  /**
   * Compatibility flags applied to the game.
   */
  compatibilityFlags: string[];

  /**
   * Optional developer/user notes.
   */
  notes?: string;
}

/**
 * Alias used by the dedicated graphics subsystem.
 */
export type MacGraphicsProfile = GraphicsConfiguration;

/* -------------------------------------------------------------------------- */
/* Compatibility Test Results                                                  */
/* -------------------------------------------------------------------------- */

export type CompatibilityTestStatus =
  | "passed"
  | "failed"
  | "partial"
  | "skipped";

export interface CompatibilityTest {
  /**
   * Identifier for the individual test.
   */
  id: string;

  /**
   * Human-readable test name.
   */
  name: string;

  /**
   * Test result.
   */
  status: CompatibilityTestStatus;

  /**
   * Optional explanation.
   */
  message?: string;

  /**
   * Optional test duration.
   */
  durationMs?: number;
}

export interface CompatibilityTestResult {
  /**
   * Game this result belongs to.
   */
  gameId: string;

  /**
   * Whether the overall compatibility test passed.
   */
  passed: boolean;

  /**
   * When the test was performed.
   */
  testedAt: string;

  /**
   * Individual tests performed.
   */
  tests: CompatibilityTest[];

  /**
   * Optional diagnostic information produced during testing.
   */
  diagnostics?: string[];

  /**
   * Total test duration.
   */
  durationMs?: number;
}

/* -------------------------------------------------------------------------- */
/* Diagnostics                                                                 */
/* -------------------------------------------------------------------------- */

export type DiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export interface CompatibilityDiagnostic {
  /**
   * Stable diagnostic identifier.
   */
  id: string;

  /**
   * Severity of the issue.
   */
  severity: DiagnosticSeverity;

  /**
   * Human-readable title.
   */
  title: string;

  /**
   * Detailed explanation.
   */
  message: string;

  /**
   * Optional subsystem responsible for the issue.
   */
  subsystem?: string;

  /**
   * Whether the issue can potentially be repaired automatically.
   */
  repairable?: boolean;
}

export interface CompatibilityDiagnosticResult {
  /**
   * Game this diagnostic result belongs to.
   */
  gameId: string;

  /**
   * Whether the compatibility environment is healthy.
   */
  healthy: boolean;

  /**
   * Diagnostics discovered during inspection.
   */
  diagnostics: CompatibilityDiagnostic[];

  /**
   * When diagnostics were performed.
   */
  diagnosedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Repair                                                                      */
/* -------------------------------------------------------------------------- */

export type CompatibilityRepairStatus =
  | "success"
  | "failed"
  | "partial"
  | "cancelled";

export interface CompatibilityRepairAction {
  /**
   * Identifier for the repair action.
   */
  id: string;

  /**
   * Human-readable description.
   */
  description: string;

  /**
   * Whether the action completed successfully.
   */
  success: boolean;

  /**
   * Optional explanation.
   */
  message?: string;
}

export interface CompatibilityRepairResult {
  /**
   * Game this repair belongs to.
   */
  gameId: string;

  /**
   * Whether the overall repair succeeded.
   */
  success: boolean;

  /**
   * Overall repair status.
   */
  status?: CompatibilityRepairStatus;

  /**
   * When the repair was performed.
   */
  repairedAt: string;

  /**
   * Individual repair actions.
   */
  actions?: CompatibilityRepairAction[];

  /**
   * Optional backup identifier created before repair.
   */
  backupId?: string;

  /**
   * Optional error message.
   */
  error?: string;
}

/* -------------------------------------------------------------------------- */
/* Known-Good Configuration                                                    */
/* -------------------------------------------------------------------------- */

export interface KnownGoodConfiguration {
  /**
   * Wine configuration known to work.
   */
  wine?: WineConfiguration;

  /**
   * Graphics configuration known to work.
   */
  graphics?: GraphicsConfiguration;

  /**
   * Dependencies known to be installed/working.
   */
  dependencies: GameDependency[];

  /**
   * When this configuration was confirmed.
   */
  confirmedAt: string;

  /**
   * Optional notes describing the successful configuration.
   */
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/* Backup Information                                                          */
/* -------------------------------------------------------------------------- */

export interface CompatibilityBackup {
  /**
   * Stable backup identifier.
   */
  id: string;

  /**
   * Backup location.
   */
  path: string;

  /**
   * When the backup was created.
   */
  createdAt: string;

  /**
   * Optional description.
   */
  description?: string;
}

/* -------------------------------------------------------------------------- */
/* Game Compatibility Profile                                                  */
/* -------------------------------------------------------------------------- */

export interface MacGameCompatibilityProfile {
  /**
   * Stable Hydra/game identifier.
   */
  gameId: string;

  /**
   * Human-readable game name.
   */
  gameName: string;

  /**
   * Original Windows game path.
   */
  gamePath: string;

  /**
   * Root directory containing this game's compatibility data.
   */
  compatibilityPath: string;

  /**
   * Current compatibility status.
   */
  status: CompatibilityStatus;

  /**
   * Wine configuration for this game.
   */
  wine: WineConfiguration;

  /**
   * Graphics configuration for this game.
   */
  graphics: GraphicsConfiguration;

  /**
   * Windows dependencies associated with this game.
   */
  dependencies: GameDependency[];

  /**
   * Last compatibility test timestamp.
   */
  lastTested?: string;

  /**
   * Last diagnostic timestamp.
   */
  lastDiagnosed?: string;

  /**
   * Last repair timestamp.
   */
  lastRepaired?: string;

  /**
   * Last time the profile was modified.
   */
  lastUpdated?: string;

  /**
   * Last known-good configuration.
   */
  lastKnownGoodConfiguration?: KnownGoodConfiguration;

  /**
   * Available backups for this game.
   */
  backups: CompatibilityBackup[];

  /**
   * Optional user/developer notes.
   */
  notes?: string;
}

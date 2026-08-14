/**
 * Hydra Mac Compatibility
 *
 * Central type definitions for the macOS compatibility system.
 *
 * All compatibility subsystems should use these shared contracts.
 */
/* -------------------------------------------------------------------------- */
/* Compatibility Status                                                       */
/* -------------------------------------------------------------------------- */
export type CompatibilityStatus =
  | "unknown"
  | "ready"
  | "needs_setup"
  | "degraded"
  | "broken"
  | "testing"
  | "repairing";
/* -------------------------------------------------------------------------- */
/* Wine                                                                        */
/* -------------------------------------------------------------------------- */
export interface MacWineInstallation {
  /** Stable identifier for this Wine installation. */
  id: string;
  /** Human-readable Wine version. */
  version: string;
  /** Path to the Wine executable/runtime. */
  executablePath: string;
  /** Whether this installation is currently usable. */
  available: boolean;
  /** Optional display name. */
  name?: string;
  /** Optional architecture information. */
  architecture?: string;
}
export interface WineConfiguration {
  /** Stable identifier of the selected Wine installation. */
  id: string;
  /** Human-readable Wine version. */
  version: string;
  /** Path to the Wine executable/runtime. */
  executablePath: string;
  /** Per-game Wine prefix. */
  prefixPath: string;
  /** Whether this Wine configuration is enabled. */
  enabled: boolean;
  /** Optional Wine environment variables. */
  environmentVariables?: Record<string, string>;
}
/* -------------------------------------------------------------------------- */
/* Dependencies                                                               */
/* -------------------------------------------------------------------------- */
export interface GameDependency {
  /** Stable dependency identifier. */
  id: string;
  /** Human-readable dependency name. */
  name: string;
  /** Installed version, when known. */
  version?: string;
  /** Whether the dependency is currently installed. */
  installed: boolean;
  /** When the dependency was installed. */
  installedAt?: string;
  /** Whether the dependency is required by the game. */
  required?: boolean;
}
/**
 * Backwards-compatible alias used by the dependency subsystem.
 */
export type MacDependency = GameDependency;
/* -------------------------------------------------------------------------- */
/* Graphics                                                                    */
/* -------------------------------------------------------------------------- */
export type GraphicsBackend =
  | "auto"
  | "metal"
  | "vulkan"
  | "opengl"
  | "directx"
  | "dxvk"
  | "vkd3d"
  | "unknown";
export interface GraphicsTranslationLayer {
  /** Whether the translation layer is enabled. */
  enabled: boolean;
  /** Optional installed/configured version. */
  version?: string;
}
export interface GraphicsConfiguration {
  /** Graphics backend used by the compatibility environment. */
  backend: GraphicsBackend;
  /** DXVK configuration. */
  dxvk: GraphicsTranslationLayer;
  /** VKD3D configuration. */
  vkd3d: GraphicsTranslationLayer;
  /** Environment variables applied to the game. */
  environmentVariables: Record<string, string>;
  /** Compatibility flags applied to the game. */
  compatibilityFlags: string[];
  /** Optional developer/user notes. */
  notes?: string;
}
/**
 * Alias for code that refers to the graphics configuration as a profile.
 */
export type MacGraphicsProfile = GraphicsConfiguration;
/* -------------------------------------------------------------------------- */
/* Diagnostics                                                                */
/* -------------------------------------------------------------------------- */
export type DiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";
export interface CompatibilityDiagnostic {
  /** Stable diagnostic identifier. */
  id: string;
  /** Severity of the issue. */
  severity: DiagnosticSeverity;
  /** Human-readable title. */
  title: string;
  /** Detailed explanation. */
  message: string;
  /** Optional subsystem responsible for the issue. */
  subsystem?: string;
  /** Whether the issue can potentially be repaired automatically. */
  repairable?: boolean;
}
export interface CompatibilityDiagnosticResult {
  /** Game this diagnostic result belongs to. */
  gameId: string;
  /** When diagnostics were performed. */
  diagnosedAt: string;
  /** Whether the compatibility environment is healthy. */
  healthy: boolean;
  /** Diagnostics discovered during inspection. */
  diagnostics: CompatibilityDiagnostic[];
}
/* -------------------------------------------------------------------------- */
/* Compatibility Testing                                                      */
/* -------------------------------------------------------------------------- */
export interface CompatibilityTestResult {
  /** Game this result belongs to. */
  gameId: string;
  /** Whether all required checks passed. */
  passed: boolean;
  /** When the test was performed. */
  testedAt: string;
  /** Human-readable checks that were performed successfully. */
  checks: string[];
  /** Human-readable failures discovered during testing. */
  failures: string[];
  /** Optional total duration in milliseconds. */
  durationMs?: number;
}
/* -------------------------------------------------------------------------- */
/* Repair                                                                      */
/* -------------------------------------------------------------------------- */
export interface CompatibilityRepairResult {
  /** Game this repair belongs to. */
  gameId: string;
  /** Whether the repair operation completed successfully. */
  success: boolean;
  /** When the repair was performed. */
  repairedAt: string;
  /** Human-readable changes made by the repair. */
  changes: string[];
  /** Warnings that do not necessarily indicate repair failure. */
  warnings: string[];
  /** Optional backup identifier. */
  backupId?: string;
}
/* -------------------------------------------------------------------------- */
/* Known-Good Configuration                                                    */
/* -------------------------------------------------------------------------- */
export interface KnownGoodConfiguration {
  /** Wine configuration known to work. */
  wine?: WineConfiguration;
  /** Graphics configuration known to work. */
  graphics?: GraphicsConfiguration;
  /** Dependencies known to be installed/working. */
  dependencies: GameDependency[];
  /** When this configuration was confirmed. */
  confirmedAt: string;
  /** Optional notes describing the successful configuration. */
  notes?: string;
}
/* -------------------------------------------------------------------------- */
/* Backup                                                                      */
/* -------------------------------------------------------------------------- */
export interface CompatibilityBackup {
  /** Stable backup identifier. */
  id: string;
  /** Backup location, when a physical backup exists. */
  path: string;
  /** When the backup was created. */
  createdAt: string;
  /** Optional description. */
  description?: string;
}
/* -------------------------------------------------------------------------- */
/* Game Compatibility Profile                                                  */
/* -------------------------------------------------------------------------- */
export interface MacGameCompatibilityProfile {
  /** Stable Hydra/game identifier. */
  gameId: string;
  /** Human-readable game name. */
  gameName: string;
  /** Original Windows game path. */
  gamePath: string;
  /** Windows game executable inside the game environment. */
  executable: string;
  /** Root directory containing this game's compatibility data. */
  compatibilityPath: string;
  /** Current compatibility status. */
  status: CompatibilityStatus;
  /** Wine configuration for this game. */
  wine: WineConfiguration;
  /** Graphics configuration for this game. */
  graphics: GraphicsConfiguration;
  /** Windows dependencies associated with this game. */
  dependencies: GameDependency[];
  /** Last compatibility test timestamp. */
  lastTested?: string;
  /** Last diagnostic timestamp. */
  lastDiagnosed?: string;
  /** Last repair timestamp. */
  lastRepaired?: string;
  /** Last time the profile was modified. */
  lastUpdated?: string;
  /** Last known-good configuration. */
  lastKnownGoodConfiguration?: KnownGoodConfiguration;
  /** Available backups for this game. */
  backups: CompatibilityBackup[];
  /** Optional user/developer notes. */
  notes?: string;
}

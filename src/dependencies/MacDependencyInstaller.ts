/**
 * Hydra Mac Compatibility
 *
 * Controlled dependency installation layer.
 *
 * IMPORTANT:
 * This class does not blindly install dependencies.
 * Every dependency must be explicitly registered with
 * an installation definition before it can be installed.
 */

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import type {
  DependencyRequirement,
} from "./MacDependencyManager";

export interface DependencyInstallDefinition {
  /**
   * Stable dependency identifier.
   */
  id: string;

  /**
   * Human-readable dependency name.
   */
  name: string;

  /**
   * Optional supported version.
   */
  version?: string;

  /**
   * Description of what the installer will do.
   */
  description: string;

  /**
   * Whether this dependency is currently supported
   * by the compatibility system.
   */
  supported: boolean;
}

export interface DependencyInstallResult {
  dependencyId: string;
  dependencyName: string;

  success: boolean;

  installedVersion?: string;

  message: string;
}

export class MacDependencyInstaller {
  private readonly definitions =
    new Map<
      string,
      DependencyInstallDefinition
    >();

  /**
   * Register a dependency installation definition.
   *
   * Registering a dependency does not install it.
   */
  register(
    definition: DependencyInstallDefinition,
  ): void {
    this.definitions.set(
      definition.id,
      definition,
    );
  }

  /**
   * Return all registered dependency definitions.
   */
  getDefinitions(): DependencyInstallDefinition[] {
    return Array.from(
      this.definitions.values(),
    );
  }

  /**
   * Return a definition for a specific dependency.
   */
  getDefinition(
    dependencyId: string,
  ):
    | DependencyInstallDefinition
    | undefined {
    return this.definitions.get(
      dependencyId,
    );
  }

  /**
   * Determine whether a dependency has a supported
   * installation definition.
   */
  isSupported(
    dependencyId: string,
  ): boolean {
    const definition =
      this.getDefinition(
        dependencyId,
      );

    return (
      definition?.supported ??
      false
    );
  }

  /**
   * Install a requested dependency.
   *
   * The actual installation mechanism is intentionally
   * delegated to a future implementation.
   */
  async install(
    profile: MacGameCompatibilityProfile,
    requirement: DependencyRequirement,
  ): Promise<DependencyInstallResult> {
    const definition =
      this.getDefinition(
        requirement.id,
      );

    if (!definition) {
      return {
        dependencyId:
          requirement.id,

        dependencyName:
          requirement.name,

        success: false,

        message:
          `No installation definition exists for "${requirement.name}".`,
      };
    }

    if (!definition.supported) {
      return {
        dependencyId:
          requirement.id,

        dependencyName:
          definition.name,

        success: false,

        message:
          `"${definition.name}" is not currently supported by the Hydra Mac Compatibility system.`,
      };
    }

    const alreadyInstalled =
      profile.installedDependencies.some(
        (dependency) =>
          dependency.id ===
            requirement.id &&
          dependency.installed,
      );

    if (alreadyInstalled) {
      return {
        dependencyId:
          requirement.id,

        dependencyName:
          definition.name,

        success: true,

        installedVersion:
          definition.version ??
          requirement.version,

        message:
          `"${definition.name}" is already recorded as installed.`,
      };
    }

    /*
     * Actual installation will be implemented once we have
     * the Wine-prefix execution layer and dependency-specific
     * installation strategies.
     *
     * We intentionally do NOT execute arbitrary commands here.
     */
    return {
      dependencyId:
        requirement.id,

      dependencyName:
        definition.name,

      success: false,

      message:
        `Installation for "${definition.name}" is registered but its installation strategy has not been implemented yet.`,
    };
  }

  /**
   * Install every missing dependency that has been
   * explicitly requested.
   *
   * Unsupported or unimplemented dependencies are reported
   * rather than silently skipped.
   */
  async installMissing(
    profile: MacGameCompatibilityProfile,
    requirements: DependencyRequirement[],
  ): Promise<DependencyInstallResult[]> {
    const results:
      DependencyInstallResult[] = [];

    for (
      const requirement of requirements
    ) {
      const installed =
        profile.installedDependencies.some(
          (dependency) =>
            dependency.id ===
              requirement.id &&
            dependency.installed,
        );

      if (installed) {
        continue;
      }

      results.push(
        await this.install(
          profile,
          requirement,
        ),
      );
    }

    return results;
  }
}

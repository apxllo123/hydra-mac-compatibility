/**
 * Hydra Mac Compatibility
 *
 * Detects dependency requirements for Windows games.
 *
 * This component only detects and recommends dependencies.
 * It does not install anything.
 */

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

import type {
  DependencyRequirement,
} from "./MacDependencyManager";

export interface DependencyDetectionContext {
  /**
   * Optional metadata supplied by Hydra or a game source.
   */
  gameMetadata?: Record<string, unknown>;

  /**
   * Optional executable information.
   */
  executableName?: string;

  /**
   * Optional DirectX information.
   */
  directXVersion?: string;

  /**
   * Optional .NET requirement.
   */
  dotNetVersion?: string;
}

export interface DependencyDetectionResult {
  gameId: string;

  gameName: string;

  requirements: DependencyRequirement[];

  messages: string[];
}

export class MacDependencyDetector {
  /**
   * Detect dependency requirements using available
   * game metadata.
   */
  detect(
    profile: MacGameCompatibilityProfile,
    context: DependencyDetectionContext = {},
  ): DependencyDetectionResult {
    const requirements:
      DependencyRequirement[] = [];

    const messages: string[] = [];

    /*
     * Explicit metadata requirements always take
     * priority over generic assumptions.
     */
    this.detectMetadataDependencies(
      context,
      requirements,
      messages,
    );

    /*
     * Detect common runtime requirements based
     * on the game's known configuration.
     */
    this.detectDirectXDependency(
      context,
      requirements,
      messages,
    );

    this.detectDotNetDependency(
      context,
      requirements,
      messages,
    );

    /*
     * Remove duplicate dependency entries.
     */
    const uniqueRequirements =
      this.removeDuplicates(
        requirements,
      );

    return {
      gameId:
        profile.gameId,

      gameName:
        profile.gameName,

      requirements:
        uniqueRequirements,

      messages,
    };
  }

  /**
   * Detect dependencies explicitly supplied through
   * game metadata.
   */
  private detectMetadataDependencies(
    context: DependencyDetectionContext,
    requirements: DependencyRequirement[],
    messages: string[],
  ): void {
    const metadata =
      context.gameMetadata;

    if (!metadata) {
      return;
    }

    const dependencies =
      metadata[
        "dependencies"
      ];

    if (
      !Array.isArray(
        dependencies,
      )
    ) {
      return;
    }

    for (
      const dependency of dependencies
    ) {
      if (
        typeof dependency ===
        "string"
      ) {
        requirements.push({
          id: dependency,
          name: dependency,
          required: true,
        });

        messages.push(
          `Detected dependency requirement from game metadata: ${dependency}`,
        );

        continue;
      }

      if (
        typeof dependency !==
        "object" ||
        dependency === null
      ) {
        continue;
      }

      const item =
        dependency as Record<
          string,
          unknown
        >;

      if (
        typeof item.id !==
        "string" ||
        typeof item.name !==
        "string"
      ) {
        continue;
      }

      requirements.push({
        id: item.id,
        name: item.name,

        version:
          typeof item.version ===
          "string"
            ? item.version
            : undefined,

        required:
          item.required !==
          false,
      });

      messages.push(
        `Detected dependency requirement from game metadata: ${item.name}`,
      );
    }
  }

  /**
   * Detect common DirectX-related dependencies.
   */
  private detectDirectXDependency(
    context: DependencyDetectionContext,
    requirements: DependencyRequirement[],
    messages: string[],
  ): void {
    const version =
      context.directXVersion;

    if (!version) {
      return;
    }

    /*
     * This is intentionally represented as a requirement,
     * not as an instruction to blindly install DLLs.
     */
    requirements.push({
      id: `directx-${this.normalizeVersion(
        version,
      )}`,

      name:
        `DirectX ${version}`,

      version,

      required: true,
    });

    messages.push(
      `DirectX ${version} requirement detected.`,
    );
  }

  /**
   * Detect a .NET runtime requirement.
   */
  private detectDotNetDependency(
    context: DependencyDetectionContext,
    requirements: DependencyRequirement[],
    messages: string[],
  ): void {
    const version =
      context.dotNetVersion;

    if (!version) {
      return;
    }

    requirements.push({
      id: `dotnet-${this.normalizeVersion(
        version,
      )}`,

      name:
        `.NET ${version}`,

      version,

      required: true,
    });

    messages.push(
      `.NET ${version} requirement detected.`,
    );
  }

  /**
   * Normalize a version for use in a stable identifier.
   */
  private normalizeVersion(
    version: string,
  ): string {
    return version
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );
  }

  /**
   * Remove duplicate dependency IDs.
   */
  private removeDuplicates(
    requirements: DependencyRequirement[],
  ): DependencyRequirement[] {
    const seen =
      new Set<string>();

    return requirements.filter(
      (dependency) => {
        if (
          seen.has(
            dependency.id,
          )
        ) {
          return false;
        }

        seen.add(
          dependency.id,
        );

        return true;
      },
    );
  }
}

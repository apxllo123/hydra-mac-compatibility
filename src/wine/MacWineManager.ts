/**
 * Hydra Mac Compatibility
 *
 * Coordinates detected Wine installations and determines
 * which Wine installation should be used by a game.
 *
 * This class does not install or remove Wine.
 * Installation and version management belong to the
 * Wine version manager.
 */

import {
  MacWineDetector,
  WineDetectionResult,
  WineInstallation,
} from "./MacWineDetector";

export interface WineSelectionOptions {
  /**
   * Prefer a specific Wine executable.
   */
  executablePath?: string;

  /**
   * Prefer a specific Wine version.
   */
  version?: string;
}

export class MacWineManager {
  private readonly detector: MacWineDetector;

  private detectionResult?: WineDetectionResult;

  private selectedWine?: WineInstallation;

  constructor(
    detector: MacWineDetector = new MacWineDetector(),
  ) {
    this.detector = detector;
  }

  /**
   * Detect available Wine installations.
   */
  async refresh(): Promise<WineDetectionResult> {
    this.detectionResult =
      await this.detector.detect();

    this.selectDefaultWine();

    return this.detectionResult;
  }

  /**
   * Return the most recent Wine detection result.
   *
   * If detection has not happened yet, returns undefined.
   */
  getDetectionResult():
    | WineDetectionResult
    | undefined {
    return this.detectionResult;
  }

  /**
   * Return all detected Wine installations.
   */
  getInstallations(): WineInstallation[] {
    return [
      ...(this.detectionResult?.installations ?? []),
    ];
  }

  /**
   * Return the currently selected Wine installation.
   */
  getSelectedWine():
    | WineInstallation
    | undefined {
    return this.selectedWine;
  }

  /**
   * Select a Wine installation explicitly.
   */
  selectWine(
    options: WineSelectionOptions,
  ): WineInstallation {
    const installations =
      this.getInstallations();

    if (installations.length === 0) {
      throw new Error(
        "No Wine installations have been detected.",
      );
    }

    let selected:
      | WineInstallation
      | undefined;

    if (options.executablePath) {
      selected =
        installations.find(
          (installation) =>
            installation.executablePath ===
            options.executablePath,
        );
    }

    if (
      !selected &&
      options.version
    ) {
      selected =
        installations.find(
          (installation) =>
            installation.version ===
            options.version,
        );
    }

    if (!selected) {
      throw new Error(
        "No Wine installation matched the requested selection.",
      );
    }

    this.selectedWine =
      selected;

    return selected;
  }

  /**
   * Determine whether Wine is available.
   */
  isWineAvailable(): boolean {
    return (
      this.detectionResult?.available ??
      false
    );
  }

  /**
   * Determine whether a specific Wine executable
   * has been detected.
   */
  hasExecutable(
    executablePath: string,
  ): boolean {
    return this.getInstallations().some(
      (installation) =>
        installation.executablePath ===
        executablePath,
    );
  }

  /**
   * Select the first suitable Wine installation
   * when no explicit selection has been made.
   */
  private selectDefaultWine(): void {
    const installations =
      this.getInstallations();

    if (installations.length === 0) {
      this.selectedWine =
        undefined;

      return;
    }

    /*
     * Prefer installations discovered through PATH
     * because the operating system already knows how
     * to resolve them.
     */
    const pathInstallation =
      installations.find(
        (installation) =>
          installation.source ===
          "path",
      );

    this.selectedWine =
      pathInstallation ??
      installations[0];
  }
}

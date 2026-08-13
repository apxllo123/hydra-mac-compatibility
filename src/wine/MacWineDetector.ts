/**
 * Hydra Mac Compatibility
 *
 * Detects Wine-related executables and installations available
 * on the current macOS system.
 *
 * IMPORTANT:
 * This module only detects.
 * It does not install, modify, or remove Wine.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { access } from "node:fs/promises";

const execFileAsync = promisify(
  execFile,
);

export interface WineInstallation {
  /**
   * Executable used to launch Wine.
   */
  executablePath: string;

  /**
   * Detected Wine version.
   */
  version?: string;

  /**
   * How this Wine installation was discovered.
   */
  source:
    | "path"
    | "homebrew"
    | "known-location"
    | "unknown";
}

export interface WineDetectionResult {
  /**
   * Whether Wine was detected.
   */
  available: boolean;

  /**
   * Detected Wine installations.
   */
  installations: WineInstallation[];

  /**
   * Whether the host appears to be macOS.
   */
  isMacOS: boolean;

  /**
   * Human-readable detection messages.
   */
  messages: string[];
}

export class MacWineDetector {
  /**
   * Detect Wine installations available on the Mac.
   */
  async detect(): Promise<WineDetectionResult> {
    const isMacOS =
      process.platform === "darwin";

    if (!isMacOS) {
      return {
        available: false,
        installations: [],
        isMacOS: false,
        messages: [
          "Wine detection is currently intended for macOS.",
        ],
      };
    }

    const installations: WineInstallation[] = [];
    const messages: string[] = [];

    await this.detectFromPath(
      installations,
      messages,
    );

    await this.detectHomebrew(
      installations,
      messages,
    );

    await this.detectKnownLocations(
      installations,
      messages,
    );

    const uniqueInstallations =
      this.removeDuplicates(
        installations,
      );

    return {
      available:
        uniqueInstallations.length > 0,
      installations:
        uniqueInstallations,
      isMacOS: true,
      messages,
    };
  }

  /**
   * Check whether a specific executable exists.
   */
  async isExecutableAvailable(
    executablePath: string,
  ): Promise<boolean> {
    try {
      await access(
        executablePath,
      );

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Detect Wine available through PATH.
   */
  private async detectFromPath(
    installations: WineInstallation[],
    messages: string[],
  ): Promise<void> {
    try {
      const { stdout } =
        await execFileAsync(
          "which",
          ["wine"],
        );

      const executablePath =
        stdout.trim();

      if (!executablePath) {
        return;
      }

      const version =
        await this.getWineVersion(
          executablePath,
        );

      installations.push({
        executablePath,
        version,
        source: "path",
      });

      messages.push(
        `Wine detected through PATH: ${executablePath}`,
      );
    } catch {
      messages.push(
        "Wine was not found through PATH.",
      );
    }
  }

  /**
   * Detect Wine installations managed through Homebrew.
   */
  private async detectHomebrew(
    installations: WineInstallation[],
    messages: string[],
  ): Promise<void> {
    try {
      const { stdout } =
        await execFileAsync(
          "brew",
          ["--prefix", "wine"],
        );

      const prefix =
        stdout.trim();

      if (!prefix) {
        return;
      }

      const executablePath =
        `${prefix}/bin/wine`;

      if (
        !(await this.isExecutableAvailable(
          executablePath,
        ))
      ) {
        return;
      }

      const version =
        await this.getWineVersion(
          executablePath,
        );

      installations.push({
        executablePath,
        version,
        source: "homebrew",
      });

      messages.push(
        `Wine detected through Homebrew: ${executablePath}`,
      );
    } catch {
      messages.push(
        "No Homebrew Wine installation was detected.",
      );
    }
  }

  /**
   * Detect Wine in common locations.
   */
  private async detectKnownLocations(
    installations: WineInstallation[],
    messages: string[],
  ): Promise<void> {
    const homeDirectory =
      process.env.HOME;

    if (!homeDirectory) {
      return;
    }

    const knownLocations = [
      `${homeDirectory}/.wine/bin/wine`,
      "/usr/local/bin/wine",
      "/opt/homebrew/bin/wine",
    ];

    for (
      const executablePath of knownLocations
    ) {
      if (
        !(await this.isExecutableAvailable(
          executablePath,
        ))
      ) {
        continue;
      }

      const version =
        await this.getWineVersion(
          executablePath,
        );

      installations.push({
        executablePath,
        version,
        source: "known-location",
      });

      messages.push(
        `Wine detected at known location: ${executablePath}`,
      );
    }
  }

  /**
   * Ask a Wine executable for its version.
   */
  private async getWineVersion(
    executablePath: string,
  ): Promise<string | undefined> {
    try {
      const { stdout, stderr } =
        await execFileAsync(
          executablePath,
          ["--version"],
        );

      const output =
        `${stdout}\n${stderr}`.trim();

      return output || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Remove duplicate executable paths.
   */
  private removeDuplicates(
    installations: WineInstallation[],
  ): WineInstallation[] {
    const seen =
      new Set<string>();

    return installations.filter(
      (installation) => {
        if (
          seen.has(
            installation.executablePath,
          )
        ) {
          return false;
        }

        seen.add(
          installation.executablePath,
        );

        return true;
      },
    );
  }
}

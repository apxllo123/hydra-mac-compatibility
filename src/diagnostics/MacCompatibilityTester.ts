/**
 * Hydra Mac Compatibility
 *
 * Runs safe compatibility tests against a game's
 * configured Wine environment.
 *
 * IMPORTANT:
 * Testing should not modify the game environment.
 */

import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type {
  MacGameCompatibilityProfile,
} from "../manager/MacCompatibilityTypes";

const execFileAsync = promisify(execFile);

export type CompatibilityTestStatus =
  | "passed"
  | "failed"
  | "skipped";

export interface CompatibilityTest {
  id: string;
  name: string;
  status: CompatibilityTestStatus;
  message: string;
  durationMs?: number;
}

export interface CompatibilityTestResult {
  gameId: string;
  gameName: string;
  testedAt: string;
  passed: boolean;
  tests: CompatibilityTest[];
}

export class MacCompatibilityTester {
  /**
   * Run all safe compatibility tests for a game.
   */
  async test(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityTestResult> {
    const tests: CompatibilityTest[] = [];

    tests.push(
      await this.testGamePath(
        profile,
      ),
    );

    tests.push(
      await this.testWineExecutable(
        profile,
      ),
    );

    tests.push(
      await this.testWineVersion(
        profile,
      ),
    );

    tests.push(
      await this.testWinePrefix(
        profile,
      ),
    );

    const failed =
      tests.some(
        (test) =>
          test.status === "failed",
      );

    return {
      gameId: profile.gameId,
      gameName: profile.gameName,
      testedAt:
        new Date().toISOString(),
      passed: !failed,
      tests,
    };
  }

  /**
   * Verify that the configured game path exists.
   */
  private async testGamePath(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityTest> {
    const started =
      Date.now();

    if (!profile.gamePath.trim()) {
      return {
        id: "game-path",
        name: "Game compatibility path",
        status: "failed",
        message:
          "No game compatibility path is configured.",
        durationMs:
          Date.now() - started,
      };
    }

    try {
      await access(
        profile.gamePath,
        constants.F_OK,
      );

      return {
        id: "game-path",
        name: "Game compatibility path",
        status: "passed",
        message:
          "The game's compatibility directory exists.",
        durationMs:
          Date.now() - started,
      };
    } catch {
      return {
        id: "game-path",
        name: "Game compatibility path",
        status: "failed",
        message:
          "The game's compatibility directory could not be found.",
        durationMs:
          Date.now() - started,
      };
    }
  }

  /**
   * Verify that the configured Wine executable exists.
   */
  private async testWineExecutable(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityTest> {
    const started =
      Date.now();

    const winePath =
      profile.wine.path;

    if (!winePath?.trim()) {
      return {
        id: "wine-executable",
        name: "Wine executable",
        status: "failed",
        message:
          "No Wine executable is configured.",
        durationMs:
          Date.now() - started,
      };
    }

    try {
      await access(
        winePath,
        constants.X_OK,
      );

      return {
        id: "wine-executable",
        name: "Wine executable",
        status: "passed",
        message:
          "The configured Wine executable exists and is executable.",
        durationMs:
          Date.now() - started,
      };
    } catch {
      return {
        id: "wine-executable",
        name: "Wine executable",
        status: "failed",
        message:
          `The configured Wine executable could not be executed: ${winePath}`,
        durationMs:
          Date.now() - started,
      };
    }
  }

  /**
   * Ask Wine for its version.
   *
   * This verifies that the configured executable can
   * actually start successfully.
   */
  private async testWineVersion(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityTest> {
    const started =
      Date.now();

    const winePath =
      profile.wine.path;

    if (!winePath?.trim()) {
      return {
        id: "wine-version",
        name: "Wine version",
        status: "skipped",
        message:
          "Skipped because no Wine executable is configured.",
        durationMs:
          Date.now() - started,
      };
    }

    try {
      const {
        stdout,
        stderr,
      } = await execFileAsync(
        winePath,
        ["--version"],
      );

      const version =
        `${stdout}\n${stderr}`.trim();

      if (!version) {
        return {
          id: "wine-version",
          name: "Wine version",
          status: "failed",
          message:
            "Wine did not return a version.",
          durationMs:
            Date.now() - started,
        };
      }

      return {
        id: "wine-version",
        name: "Wine version",
        status: "passed",
        message:
          `Wine responded successfully: ${version}`,
        durationMs:
          Date.now() - started,
      };
    } catch (error) {
      return {
        id: "wine-version",
        name: "Wine version",
        status: "failed",
        message:
          this.getErrorMessage(
            error,
          ),
        durationMs:
          Date.now() - started,
      };
    }
  }

  /**
   * Verify that the configured Wine prefix exists.
   */
  private async testWinePrefix(
    profile: MacGameCompatibilityProfile,
  ): Promise<CompatibilityTest> {
    const started =
      Date.now();

    const prefixPath =
      profile.wine.prefixPath;

    if (!prefixPath?.trim()) {
      return {
        id: "wine-prefix",
        name: "Wine prefix",
        status: "failed",
        message:
          "No Wine prefix is configured.",
        durationMs:
          Date.now() - started,
      };
    }

    try {
      await access(
        prefixPath,
        constants.F_OK,
      );

      return {
        id: "wine-prefix",
        name: "Wine prefix",
        status: "passed",
        message:
          "The configured Wine prefix exists.",
        durationMs:
          Date.now() - started,
      };
    } catch {
      return {
        id: "wine-prefix",
        name: "Wine prefix",
        status: "failed",
        message:
          "The configured Wine prefix could not be found.",
        durationMs:
          Date.now() - started,
      };
    }
  }

  /**
   * Convert an unknown error into a safe readable message.
   */
  private getErrorMessage(
    error: unknown,
  ): string {
    if (
      error instanceof Error
    ) {
      return error.message;
    }

    return String(error);
  }
}

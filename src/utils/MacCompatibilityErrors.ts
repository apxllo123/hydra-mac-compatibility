/**
 * Hydra Mac Compatibility
 *
 * Standardized errors for the Mac compatibility system.
 *
 * These errors allow the manager, Wine, diagnostics,
 * dependencies, graphics, storage, and repair systems
 * to communicate failures consistently.
 */

export type MacCompatibilityErrorCode =
  | "INVALID_PROFILE"
  | "GAME_NOT_FOUND"
  | "GAME_PATH_NOT_FOUND"
  | "WINE_NOT_FOUND"
  | "WINE_NOT_EXECUTABLE"
  | "WINE_VERSION_FAILED"
  | "WINE_PREFIX_NOT_FOUND"
  | "WINE_PREFIX_INVALID"
  | "DEPENDENCY_NOT_FOUND"
  | "DEPENDENCY_NOT_SUPPORTED"
  | "DEPENDENCY_INSTALL_FAILED"
  | "GRAPHICS_CONFIGURATION_INVALID"
  | "BACKUP_NOT_FOUND"
  | "BACKUP_INVALID"
  | "BACKUP_FAILED"
  | "CONFIGURATION_INVALID"
  | "PERMISSION_DENIED"
  | "FILE_OPERATION_FAILED"
  | "TEST_FAILED"
  | "REPAIR_FAILED"
  | "UNSUPPORTED_OPERATION"
  | "UNKNOWN_ERROR";

/**
 * Base error used throughout Hydra Mac Compatibility.
 */
export class MacCompatibilityError extends Error {
  readonly code: MacCompatibilityErrorCode;

  readonly gameId?: string;

  readonly gameName?: string;

  readonly details?: Record<
    string,
    unknown
  >;

  constructor(
    code: MacCompatibilityErrorCode,
    message: string,
    options: MacCompatibilityErrorOptions = {},
  ) {
    super(message);

    this.name =
      "MacCompatibilityError";

    this.code =
      code;

    this.gameId =
      options.gameId;

    this.gameName =
      options.gameName;

    this.details =
      options.details;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}

/**
 * Additional context that can be attached to
 * a compatibility error.
 */
export interface MacCompatibilityErrorOptions {
  gameId?: string;

  gameName?: string;

  details?: Record<
    string,
    unknown
  >;

  cause?: unknown;
}

/**
 * Error specifically related to Wine.
 */
export class MacWineError extends MacCompatibilityError {
  constructor(
    code:
      | "WINE_NOT_FOUND"
      | "WINE_NOT_EXECUTABLE"
      | "WINE_VERSION_FAILED"
      | "WINE_PREFIX_NOT_FOUND"
      | "WINE_PREFIX_INVALID",
    message: string,
    options: MacCompatibilityErrorOptions = {},
  ) {
    super(
      code,
      message,
      options,
    );

    this.name =
      "MacWineError";
  }
}

/**
 * Error specifically related to dependencies.
 */
export class MacDependencyError extends MacCompatibilityError {
  constructor(
    code:
      | "DEPENDENCY_NOT_FOUND"
      | "DEPENDENCY_NOT_SUPPORTED"
      | "DEPENDENCY_INSTALL_FAILED",
    message: string,
    options: MacCompatibilityErrorOptions = {},
  ) {
    super(
      code,
      message,
      options,
    );

    this.name =
      "MacDependencyError";
  }
}

/**
 * Error specifically related to backups.
 */
export class MacBackupError extends MacCompatibilityError {
  constructor(
    code:
      | "BACKUP_NOT_FOUND"
      | "BACKUP_INVALID"
      | "BACKUP_FAILED",
    message: string,
    options: MacCompatibilityErrorOptions = {},
  ) {
    super(
      code,
      message,
      options,
    );

    this.name =
      "MacBackupError";
  }
}

/**
 * Error specifically related to repair operations.
 */
export class MacRepairError extends MacCompatibilityError {
  constructor(
    code:
      | "REPAIR_FAILED"
      | "UNSUPPORTED_OPERATION",
    message: string,
    options: MacCompatibilityErrorOptions = {},
  ) {
    super(
      code,
      message,
      options,
    );

    this.name =
      "MacRepairError";
  }
}

/**
 * Determine whether an unknown value is a
 * MacCompatibilityError.
 */
export function isMacCompatibilityError(
  error: unknown,
): error is MacCompatibilityError {
  return (
    error instanceof
    MacCompatibilityError
  );
}

/**
 * Convert any thrown value into a standardized
 * MacCompatibilityError.
 */
export function toMacCompatibilityError(
  error: unknown,
  fallbackCode:
    MacCompatibilityErrorCode =
    "UNKNOWN_ERROR",
): MacCompatibilityError {
  if (
    error instanceof
    MacCompatibilityError
  ) {
    return error;
  }

  if (
    error instanceof Error
  ) {
    return new MacCompatibilityError(
      fallbackCode,
      error.message,
    );
  }

  return new MacCompatibilityError(
    fallbackCode,
    String(error),
  );
}

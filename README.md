# Hydra Mac Compatibility

## Windows Compatibility for Hydra

Hydra Mac Compatibility is a dedicated compatibility system designed to allow Windows games to be managed, configured, diagnosed, repaired, and optimized for macOS while maintaining Hydra's existing design, behavior, and user experience.

**Internal project name:** Hydra Mac Compatibility

**Feature name inside Hydra:** Windows Compatibility

---

# Architecture

                    HYDRA
                      │
              Windows Compatibility
                      │
        ┌─────────────┴─────────────┐
        │                           │
      Manager                    Game Profile
        │                           │
   ┌────┼────┬────┐                │
   │    │    │    │                │
 Wine Games Deps Graphics           │
   │    │    │    │                │
   └────┴────┴────┴──────┐          │
                         │          │
                   Diagnostics      │
                         │          │
                      Repair        │
                         │          │
                       Tester       │
                         │          │
                    ┌────┴────┐     │
                    │         │     │
                  Logger    Errors   │
                    │         │     │
                    └────┬────┴─────┘
                         │
                       Storage
                         │
              ┌──────────┼──────────┐
              │          │          │
           Profiles   Backups   Configuration
              │          │          │
              └──────────┼──────────┘
                         │
                     Maintenance
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Backups       Migrations      Cleanup
          │              │              │
          └──────────────┼──────────────┘
                         │
                       Repair

---

# Project Structure

    hydra-mac-compatibility/
    │
    ├── README.md
    ├── LICENSE
    ├── package.json
    ├── tsconfig.json
    │
    ├── src/
    │   ├── index.ts
    │   │
    │   ├── manager/
    │   │   ├── MacCompatibilityTypes.ts
    │   │   ├── MacCompatibilityManager.ts
    │   │   └── MacCompatibilityRegistry.ts
    │   │
    │   ├── wine/
    │   │   ├── MacWineManager.ts
    │   │   ├── MacWineDetector.ts
    │   │   └── MacWineVersionManager.ts
    │   │
    │   ├── games/
    │   │   ├── MacGameManager.ts
    │   │   ├── MacGameProfile.ts
    │   │   └── MacGameProfileStore.ts
    │   │
    │   ├── diagnostics/
    │   │   ├── MacCompatibilityDiagnostics.ts
    │   │   ├── MacCompatibilityTester.ts
    │   │   └── MacCompatibilityRepair.ts
    │   │
    │   ├── dependencies/
    │   │   ├── MacDependencyManager.ts
    │   │   ├── MacDependencyDetector.ts
    │   │   └── MacDependencyInstaller.ts
    │   │
    │   ├── graphics/
    │   │   ├── MacGraphicsManager.ts
    │   │   └── MacGraphicsProfile.ts
    │   │
    │   ├── storage/
    │   │   ├── MacCompatibilityPaths.ts
    │   │   ├── MacCompatibilityConfig.ts
    │   │   └── MacCompatibilityBackups.ts
    │   │
    │   └── utils/
    │       ├── MacCompatibilityLogger.ts
    │       └── MacCompatibilityErrors.ts
    │
    ├── maintenance/
    │   ├── backups/
    │   ├── migrations/
    │   ├── cleanup/
    │   └── repair/
    │
    └── tests/
        ├── manager/
        ├── wine/
        ├── games/
        ├── diagnostics/
        ├── dependencies/
        ├── graphics/
        ├── storage/
        └── maintenance/

---

# Core Philosophy

The system should be:

- Organized
- Maintainable
- Safe
- Per-game
- Recoverable
- Testable
- Extensible
- Easy for Hydra to integrate
- Easy for developers to understand

The project should never become one giant compatibility file.

Each component should have one clear responsibility.

---

# Manager

The manager is the central coordinator.

It connects:

- Wine
- Games
- Dependencies
- Graphics
- Diagnostics
- Repair
- Storage
- Maintenance

The manager coordinates these systems instead of containing every piece of logic itself.

---

# Wine

The Wine system handles:

- Wine detection
- Wine versions
- Wine selection
- Wine prefixes
- Wine environment preparation
- Wine testing
- Wine version switching

Each game should be able to have its own Wine configuration.

---

# Games

Every Windows game receives its own compatibility profile.

Example:

    games/
    └── Grand Theft Auto V/
        ├── prefix/
        ├── config/
        ├── dependencies/
        ├── graphics/
        ├── logs/
        ├── backups/
        └── compatibility.json

Human-readable game names are preferred over meaningless folders such as:

    game_17382/

Internal IDs can still exist inside the compatibility profile.

---

# Game Compatibility Profile

A game profile remembers:

- Game name
- Game ID
- Game path
- Wine version
- Wine prefix
- Graphics configuration
- Dependencies
- Test results
- Last known good configuration
- Compatibility status
- Backup information
- Timestamps

The goal is simple:

> Hydra should remember what worked.

---

# Dependencies

The dependency system detects and manages Windows components and runtimes required by games.

It should never blindly install everything.

    Game
     ↓
    Detect requirements
     ↓
    Check what's installed
     ↓
    Find what's missing
     ↓
    Install only what is appropriate
     ↓
    Test

Components:

- MacDependencyManager.ts
- MacDependencyDetector.ts
- MacDependencyInstaller.ts

---

# Graphics

The graphics system manages per-game settings such as:

- Graphics backend
- DXVK
- VKD3D
- DXVK version
- VKD3D version
- Environment variables
- Compatibility flags
- Graphics notes

Example:

    Grand Theft Auto V

    Backend: Auto
    DXVK: Enabled
    VKD3D: Disabled

One game's graphics configuration must never accidentally modify another game's configuration.

---

# Diagnostics

Diagnostics answers:

> What is wrong?

It can inspect:

- Wine
- Wine prefix
- Dependencies
- Graphics
- Configuration
- Game files
- Compatibility profile
- Previous test results

Diagnostics should identify problems before attempting repairs.

---

# Repair

Repair answers:

> How can we fix it safely?

Important operations follow:

    Create Backup
          ↓
      Make Change
          ↓
         Test
          ↓
       Success?
       ┌────┴────┐
      Yes        No
       │          │
     Keep       Restore

Repair should avoid destructive changes whenever possible.

---

# Tester

The tester verifies whether a compatibility configuration actually works.

Example:

    Wine
     ↓
    Prefix
     ↓
    Dependencies
     ↓
    Graphics
     ↓
    Game Launch
     ↓
    Result

Test results should be understandable by both the manager and future Hydra UI.

---

# Logger

MacCompatibilityLogger.ts provides centralized logging.

Logs can contain:

- Debug information
- Information
- Warnings
- Errors
- Game information
- Component information
- Diagnostic details

This allows the future UI to provide:

**View Logs**

without requiring the user to understand terminal output.

---

# Errors

MacCompatibilityErrors.ts provides standardized error codes.

Examples:

    WINE_NOT_FOUND
    WINE_PREFIX_NOT_FOUND
    DEPENDENCY_NOT_SUPPORTED
    DEPENDENCY_INSTALL_FAILED
    GRAPHICS_CONFIGURATION_INVALID
    BACKUP_FAILED
    TEST_FAILED
    REPAIR_FAILED

This allows Hydra's UI to turn technical problems into understandable messages.

---

# Storage

Storage is responsible for keeping compatibility data organized.

It manages:

- Game paths
- Compatibility profiles
- Configuration
- Backups
- Storage locations

Storage should be predictable and consistent.

---

# Per-Game Storage

Every game receives its own compatibility directory.

    games/
    └── Example Game/
        ├── prefix/
        ├── config/
        ├── dependencies/
        ├── graphics/
        ├── logs/
        ├── backups/
        └── compatibility.json

Games should remain isolated from one another.

---

# compatibility.json

compatibility.json is the game's compatibility memory.

Conceptually:

    {
      "gameName": "Example Game",
      "wineVersion": "...",
      "graphicsBackend": "...",
      "dxvkEnabled": true,
      "vkd3dEnabled": false,
      "installedDependencies": [],
      "lastKnownGoodConfiguration": "...",
      "lastTested": "...",
      "status": "ready"
    }

The actual structure is defined by the TypeScript compatibility types.

---

# Backups

Backups protect working configurations before changes are made.

    Current Configuration
            ↓
          Backup
            ↓
        Make Change
            ↓
           Test

If the change fails:

    Failed Configuration
            ↓
          Restore
            ↓
    Previous Configuration

Backups are part of the recovery system.

---

# Maintenance

Maintenance is intentionally separated from normal runtime compatibility logic.

    maintenance/
    ├── backups/
    ├── migrations/
    ├── cleanup/
    └── repair/

## Backups

Maintenance-level backup operations.

## Migrations

Updates older compatibility profiles to newer formats.

    Profile v1
       ↓
    Migration
       ↓
    Profile v2

## Cleanup

Safely handles:

- Temporary files
- Obsolete compatibility data
- Unused artifacts

Cleanup should be conservative and explicit.

## Repair

Contains maintenance-level repair operations.

---

# Maintenance Philosophy

Six months from now, a developer should be able to look at this project and immediately understand it.

Avoid:

- Mystery files
- Random scripts
- Unnamed folders
- Giant manager classes
- Destructive automatic cleanup
- Untracked configuration changes
- Duplicate compatibility logic

Prefer:

- Clear names
- Small components
- Explicit responsibilities
- Backups
- Migrations
- Tests
- Logs
- Standardized errors
- Per-game isolation

---

# Hydra UI Integration

The compatibility system should look and feel like Hydra.

We do not want a separate application-style interface.

The eventual UI should use Hydra's existing:

- Colors
- Fonts
- Buttons
- Icons
- Spacing
- Animations
- Hydra logo/assets
- Existing game launcher UI
- Existing popup/dialog patterns

The compatibility system provides the logic.

Hydra provides the user experience.

---

# Compatibility Helper

Eventually Hydra can provide a helper like:

    ┌─────────────────────────────────────┐
    │ Windows Compatibility               │
    │                                     │
    │ 🟢 Everything looks good            │
    │                                     │
    │ Wine:         Ready                 │
    │ Prefix:       Ready                 │
    │ Dependencies: Ready                 │
    │ Graphics:     Ready                 │
    │                                     │
    │ [ Test Setup ]   [ View Logs ]      │
    │                                     │
    │ [ Repair ]       [ Reset ]          │
    └─────────────────────────────────────┘

When something is wrong:

    ┌─────────────────────────────────────┐
    │ Windows Compatibility               │
    │                                     │
    │ 🟡 Something needs attention        │
    │                                     │
    │ DXVK is configured but unavailable. │
    │                                     │
    │ [ Fix Everything ]                  │
    │ [ Test Setup ]                      │
    │ [ Try Another Wine Version ]        │
    │ [ Repair ]                          │
    │ [ View Logs ]                       │
    │ [ Reset ]                           │
    └─────────────────────────────────────┘

The UI should communicate with the compatibility system rather than contain compatibility logic itself.

---

# Known-Good Configurations

Hydra should remember configurations that successfully work.

Example:

    Game A

    Wine:    Version X
    DXVK:    Enabled
    VKD3D:   Disabled
    Backend: Vulkan
    Result:  Working

If the game later breaks, Hydra can try the known-good configuration before experimenting with new configurations.

---

# Optimization

Optimization comes after stability.

The system should follow:

    Detect
      ↓
    Diagnose
      ↓
    Repair
      ↓
    Test
      ↓
    Confirm Stability
      ↓
    Optimize
      ↓
    Test Again

Never sacrifice a working configuration simply to chase theoretical performance improvements.

---

# Safety Principles

The compatibility system should:

1. Keep games isolated.
2. Keep configurations backed up.
3. Avoid unnecessary dependency installation.
4. Avoid destructive operations unless explicitly requested.
5. Test important changes.
6. Preserve known-good configurations.
7. Log important operations.
8. Use standardized errors.
9. Keep maintenance operations separate.
10. Make failures recoverable whenever possible.

---

# Development Strategy

The project is being built incrementally.

    Types
     ↓
    Storage
     ↓
    Game Profiles
     ↓
    Wine
     ↓
    Dependencies
     ↓
    Graphics
     ↓
    Diagnostics
     ↓
    Repair
     ↓
    Testing
     ↓
    Main Manager
     ↓
    Integration
     ↓
    Hydra UI
     ↓
    Optimization

Each component should be completed and understood before adding unnecessary complexity.

---

# Testing

Tests will eventually cover:

    tests/
    ├── manager/
    ├── wine/
    ├── games/
    ├── diagnostics/
    ├── dependencies/
    ├── graphics/
    ├── storage/
    └── maintenance/

Tests should cover both successful and failure scenarios.

Examples:

- Wine missing
- Wine version unavailable
- Prefix missing
- Dependency already installed
- Dependency unsupported
- Invalid graphics configuration
- Backup creation
- Backup restoration
- Corrupt profile
- Failed repair
- Failed compatibility test

---

# Future Goal

The final goal is for a user to install a Windows game through Hydra and have Hydra intelligently manage its macOS compatibility environment.

    Install Game
         ↓
    Hydra detects Windows game
         ↓
    Create Game Compatibility Profile
         ↓
    Create isolated Wine environment
         ↓
    Detect requirements
         ↓
    Configure graphics
         ↓
    Test
         ↓
    ┌──────────────────────┐
    │ Windows Compatibility│
    │                      │
    │ 🟢 Ready             │
    └──────────────────────┘
         ↓
    Launch Game

If something breaks:

    Game
     ↓
    Diagnostics
     ↓
    Identify Problem
     ↓
    Backup
     ↓
    Repair
     ↓
    Test
     ↓
    Restore if necessary
     ↓
    Working Configuration

---

# Project Naming

**Repository**

    hydra-mac-compatibility

**Internal Project Name**

    Hydra Mac Compatibility

**Hydra Feature Name**

    Windows Compatibility

**Main Manager**

    MacCompatibilityManager.ts

**Individual Game Folder**

    Game Name/

---

# Status

🚧 Active Development

This project is being built incrementally.

The architecture is intentionally designed so compatibility logic can be developed and tested independently before being integrated into Hydra.

---

# Guiding Principle

> Make Windows games work on Mac, remember what worked, fix what breaks, and never make the user start from zero.

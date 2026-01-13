# GNOME AI - Implementation Plan

## Goal
Create a modular, secure, and integrated AI assistant for the GNOME desktop, adhering to the architecture defined: "GNOME AI Core" (Rust), "Shell Extension" (TS/GJS), and sandboxed "Tools".

## Architecture Overview

### 1. GNOME AI Core (`gnome-ai-core`)
- **Technology**: Rust (using `zbus` for D-Bus, `tokio` for async).
- **Responsibility**: Central orchestration, policy enforcement, audit logging.
- **IPC**: Exposes `org.gnome.AI.*` interfaces on the Session Bus.

### 2. GNOME Shell Extension (`ai-assistant@gnome.org`)
- **Technology**: TypeScript -> GJS.
- **Responsibility**: User Interface (Panel, Chat, Notifications).
- **Communication**: Calls `gnome-ai-core` via D-Bus. No heavy logic in the shell.

### 3. Tools / Skills
- **Technology**: Rust (binaries) or specialized scripts.
- **Security**: Run as isolated processes or via internal modules (Core MVP may link some internally for simplicity first, then split).

## Proposed Changes

### [NEW] Specifications
- `specs/org.gnome.AI.xml`: D-Bus Interface definitions.
- `specs/policy_schema.toml`: Configuration format for permissions.

### [NEW] Core Implementation (`core/`)
- `Cargo.toml`: Workspace definition.
- `src/main.rs`: Service entry point.
- `src/dbus/`: D-Bus interface implementations.
- `src/policy/`: Permission logic.

### [NEW] Extension Implementation (`shell-extension/`)
- `package.json`, `tsconfig.json`: Build setup.
- `src/extension.ts`: Main entry point.
- `src/dbus-client.ts`: Typed D-Bus wrappers.

## Verification Plan
1. **Build**: `cargo build` for core, `npm run build` for extension.
2. **Run Service**: Start `gnome-ai-core` manually and inspect with `d-feet` or `busctl`.
3. **Install Extension**: Load into a nested GNOME shell (`dbus-run-session -- gnome-shell --nested`).
4. **Test Interaction**: Send a message via UI, verify Core logs receiving it.

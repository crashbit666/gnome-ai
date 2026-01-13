# GNOME AI Assistant

A modern, modular, and secure AI integration layer for the GNOME Desktop.

## Project Structure

This project follows a **Monorepo** architecture to ensure consistency between the core logic, API specifications, and the user interface.

*   **`gnome-ai/core`** (Rust): The central service that runs as a user daemon. It handles model orchestration, policy enforcement (allow/deny permissions), and audit logging.
*   **`gnome-ai/shell-extension`** (TypeScript/GJS): The frontend integration for GNOME Shell. It provides a non-intrusive indicator and panel for interacting with the AI.
*   **`gnome-ai/specs`**: The Single Source of Truth for the D-Bus Interfaces (`org.gnome.AI.xml`) and Policy Configurations (`policy.toml`).
*   **`gnome-ai/tools`**: Collection of modular "skills" that the AI can invoke (e.g., Clipboard reader, Note taker).

## Modular Architecture

This system is designed with **Security by Design** principles:
*   **Sandboxing**: Tools run isolated.
*   **Auditability**: Every AI action is logged.
*   **User Control**: Sensitive actions require explicit user consent via Policy configuration.

## Getting Started

### Prerequisites
*   Rust (latest stable)
*   Node.js & NPM (for Extension build)
*   GNOME Shell 45+

### Build & Run
See the `README.md` inside each subdirectory for specific instructions.

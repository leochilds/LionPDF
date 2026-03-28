# Contributing to LionPDF

Welcome! We are excited to have you contribute to LionPDF, a highly secure, privacy-focused, cross-platform PDF reader built with Tauri and React.

## Versioning Strategy

LionPDF strictly follows [Semantic Versioning (SemVer)](https://semver.org/).
Version tags are formatted as `vMAJOR.MINOR.PATCH`:
- **MAJOR:** Incompatible API changes or massive architectural shifts.
- **MINOR:** Adding new features in a backwards-compatible manner.
- **PATCH:** Backwards-compatible bug fixes and minor tweaks.

Since LionPDF is currently in an early development stage, the version starts at `v0.x.x`, meaning the core APIs are still solidifying and minor bugs may occur.

## Branching Strategy

We follow **GitHub Flow**:
1. **Never commit directly to `main`**. The `main` branch must always be stable and deployable.
2. Create a new branch from `main` for your work. Use clear prefixes for your branch names:
   - `feature/your-feature-name` (for new features)
   - `fix/issue-description` (for bug fixes)
   - `docs/what-you-documented` (for documentation updates)
   - `chore/update-dependencies` (for maintenance tasks)
3. Submit a **Pull Request (PR)** against the `main` branch when your work is ready for review.

## Commit Guidelines

We enforce **Conventional Commits** for an automated, readable commit history. Please structure your commit messages like this:

`type(scope): subject`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

**Example:**
`feat(viewer): add support for zooming in and out`

## Development Setup

LionPDF is built with **Tauri (Rust)** for the secure backend, and **React + Vite** for the frontend.

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **Rust** (Install via [rustup](https://rustup.rs/))
3. **OS-Specific Dependencies** required by Tauri:
   - **Linux:** `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`
   - **Mac:** Xcode command line tools (`xcode-select --install`)
   - **Windows:** C++ Build Tools (via Visual Studio Build Tools)

### Running Locally
1. Clone the repository and checkout your feature branch.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development server (which compiles the Rust backend and starts the React frontend):
   ```bash
   npm run tauri dev
   ```

## Security & Privacy First

LionPDF is designed to be fully sandboxed. When contributing, keep in mind:
- **No Telemetry:** We strictly prohibit any form of analytics or tracking.
- **Strict CSP:** The app runs with a strict Content Security Policy. External network requests from the frontend are blocked.
- **IPC Over Node:** Do not enable `nodeIntegration`. All backend/system access must explicitly be routed through secure Tauri Rust commands.

Thank you for helping us build a secure, open-source PDF reader!

# LionPDF

LionPDF is an open-source, purely privacy-conscious, and highly secure desktop PDF reader built with Tauri and React. 

## 🛡️ Security First
LionPDF guarantees zero telemetry, zero analytics, and zero unauthorized network traffic. 

Our security architecture enforces the following restrictions:
- **Strict Content Security Policy:** The frontend is completely isolated and all external network calls are blocked.
- **Zero Frontend File System Permissions:** The frontend never has direct access to read or write files. All file handling is securely intercepted by Rust natively using native OS dialogs.
- **Tauri V2:** Built with the latest Tauri version, leveraging its process isolation guarantees.

## 🚀 Features
- Fast, secure PDF rendering using Mozilla's `pdfjs-dist`.
- Cross-platform support natively built for Windows, macOS (Intel & Silicon), and Linux.
- Beautiful, lightweight UI featuring zoom and page navigation.

## 🏗️ Development Setup

If you wish to contribute to the code, please review our [CONTRIBUTING.md](./CONTRIBUTING.md) guide.

### Prerequisites
1. **Node.js:** v18 or newer
2. **Rust:** latest stable version (install via `rustup`)
3. **OS-Specific Tauri Dependencies:** (See [Tauri documentation](https://tauri.app/start/prerequisites/))

### Running Locally
```bash
# Clone the repository
git clone https://github.com/leochilds/LionPDF.git
cd LionPDF

# Install frontend dependencies
npm install

# Start the development server (auto compiles Rust & Vite)
npm run tauri dev
```

## 📦 Building for Production

Thanks to our CI pipeline, creating a release tag (e.g., `v1.0.0`) automatically compiles and creates installers for all major platforms (Windows `.msi`, macOS `.dmg`/`.app`, Linux `.AppImage`/`.deb`).

To build locally:
```bash
npm run tauri build
```
The output binaries will be generated inside `src-tauri/target/release/bundle/`.

## 📜 License
This project is licensed under the terms of the MIT License.

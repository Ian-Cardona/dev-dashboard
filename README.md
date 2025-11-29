# Dev Dashboard

A specialized dashboard for core development tasks and notifications that consolidates information from various services (e.g., GitHub) and in-file TODOs into a single interface. Instead of switching between multiple browser tabs, you can quickly check GitHub deployment status, notifications, and review code TODO lists from one place:

- **GitHub Integration:** View notifications and monitor workflow runs per repository
- **TODO Sync:** Scan, organize, and tag `// TODO:` comments from your VS Code workspace across all projects to the web app
- **Reduce context switching:** Centralized workspace to minimize tab-hopping, allowing you to maintain your flow state.

This tool was built to reduce the hassle and mental overhead of jumping between different tools during development. It's not meant to replace what you already use, but to make the routine checks easier so you can stay focused. It might even save you a space in memory.

This project includes a custom VS Code extension that will be available in the VS Code Marketplace for easy installation and integration with your development environment.

## Usage

This section explains how to set up and start using the Dev Dashboard. The process is simple and takes just a few minutes.

1.  **Download the VS Code extension** from the marketplace
2.  **Add your API key** to the extension settings (you'll get this after creating an account on the web app settings)
3.  **Workspace scanning** happens automatically - the extension finds all `// TODO:` comments in your open projects
4.  **Sync on-demand** - TODOs are synced from VS Code to the web app
5.  **Open the dashboard** in your browser to see all your development information in one place

---

## Contributing

This section will be updated once the initial development phase is complete. Contribution guidelines, setup instructions for local development, and information on how to submit issues or pull requests will be added here.

**Thank you for showing interest and supporting this project :)**

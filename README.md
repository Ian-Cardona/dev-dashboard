# Dev Dashboard

A unified dashboard for core development tasks and notifications that consolidates information from various services (GitHub, Netlify, AWS) and local editor TODOs into a single interface. Instead of switching between multiple browser tabs and applications throughout the day, you can check deployments, review issues, and manage tasks from one place:

- **GitHub Integration:** View notifications, open pull requests, and workflow runs
- **TODO Sync:** Automatically collect and organize `// TODO:` comments from your VS Code workspace across all projects
- **Web Interface:** Clean UI with filtering and sorting options to highlight items that need attention
- **API Backend:** Handles authentication, data storage, and secure connections to external services

The tool was built to reduce the hassle and mental overhead of jumping between different tools during development. It's not meant to replace what you already use, but to make the routine checks easier so you can stay focused.

This project includes a custom VS Code extension that will be available in the VS Code marketplace for easy installation and integration with your development environment.

## Usage

This section explains how to set up and start using Dev Dashboard. The process is simple and takes just a few minutes.

1. **Download the VS Code extension** from the marketplace
2. **Add your API key** to the extension settings (you'll get this after creating an account on the web dashboard)
3. **Workspace scanning** happens automatically - the extension finds all `// TODO:` comments in your open projects
4. **Sync on-demand** - todos are sent from VS Code to the backend and show up in the web dashboard
5. **Open the dashboard** in your browser to see all your development information in one place

## Contributing

This section will be updated once the initial development phase is complete. Contribution guidelines, setup instructions for local development, and information on how to submit issues or pull requests will be added here.

# Dev Dashboard - VS Code Extension

Sync your code comments from VS Code to your Dev Dashboard.

## What It Does

This extension scans your workspace for special comments and automatically syncs them to your Dev Dashboard. No more scattered task lists across different projects - everything shows up in one central location.

Supported comment types:

- `// TODO:` or `// TODO -` - Tasks you need to complete
- `// FIXME:` or `// FIXME -` - Code that needs fixing
- `// HACK:` or `// HACK -` - Temporary workarounds
- `// NOTE:` or `// NOTE -` - Important notes and reminders
- `// BUG:` or `// BUG -` - Known bugs to track
- `// XXX:` or `// XXX -` - Warnings or concerns
- Custom tags like `// REFACTOR:` or `// OPTIMIZE:` - Add your own comment types (any uppercase word 2-20 letters followed by `:` or `-`)

The extension works with both single-line (`//`) and multi-line (`/* */` or `*`) comment styles.

## Setup

1. Install the extension from the VS Code marketplace
2. Open the extension settings and add your API key (get this from your Dev Dashboard account)
3. That's it - the extension will automatically scan your workspace and sync comments to your dashboard

Your comments will now appear in the Dev Dashboard web interface alongside your GitHub notifications, deployments, and other development tasks.

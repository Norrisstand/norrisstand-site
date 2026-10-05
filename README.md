# Norris Stand site

Public GitHub Pages site for Norris Stand and Drive Folder Sync at `https://norrisstand.com/`. This repository is `Norrisstand/norrisstand-site`; Pages deploys from `main` at the repository root. It contains the homepage, product and pricing pages, downloads, release notes, privacy and terms pages, and the DFS updater manifest at `/updates/drive-folder-sync.json`.

Read [site instructions](AGENTS.md) before editing. The canonical Drive Folder Sync source, tests, packaging and release truth are in the separate private `Norrisstand/drive-folder-sync` repository. Its release runbook governs the cross-repository handoff. The Platform source is `Norrisstand/norrisstand-platform`; the local site checkout under Platform's `deploy/norrisstand-site/` is a separate Git repository and can be behind GitHub. Verify `origin/main` before starting.

## Ordinary site changes

Use one active writer, a branch and PR. Every merge to `main` deploys publicly through GitHub Pages. Require the exact-head `Validate` check and the appropriate owner authority for the change. Never push directly to `main` or treat a local preview as public evidence.

## Drive Folder Sync release assets

An exact owner-approved DFS release packet precedes any public installer or updater change. Receive the versioned, signed installer and its SHA-256 from the protected DFS release candidate; never build or sign DFS inside this site repository. The release PR must keep these items consistent:

- `downloads/DriveFolderSync-Setup-<version>.exe` and its `.sha256.txt`;
- `downloads/DriveFolderSync-Setup-latest.exe` and its `.sha256.txt` when latest is intentionally advanced;
- `updates/drive-folder-sync.json` and the matching release-notes page when the existing-customer updater is intentionally advanced;
- customer-facing download copy only when the exact publication decision includes it.

Run `python .github/scripts/verify_release_assets.py` before the PR; CI runs the same asset check. Microsoft Store EXE/MSI package hosting requires a stable versioned HTTPS URL. Hosting the file can be a public effect even before it is linked. Do not replace bytes at a versioned URL already submitted to Microsoft. The Store product is [Drive Folder Sync by NorrisStand](https://apps.microsoft.com/store/detail/XP8BRXQSWQCV5V), Store ID `XP8BRXQSWQCV5V`; Partner Center updates are a separate approval and action.

After an approved merge, verify the live page, manifest, release notes, versioned and latest downloaded bytes, signature and rollback point. Record exactly which channels became available. A GitHub Pages deployment does not prove a Microsoft Store submission or an in-app updater result.

## Historical setup

GitHub Pages was configured for `main` at `/ (root)` with the `norrisstand.com` custom domain and HTTPS. DNS and repository bootstrap steps are historical setup, not routine release steps; do not repeat them to publish a DFS update.

The public Google OAuth information URLs are `https://norrisstand.com/`, `https://norrisstand.com/privacy.html`, and `https://norrisstand.com/terms.html`. A release should preserve these destinations unless a separately approved product/Google configuration change requires otherwise.

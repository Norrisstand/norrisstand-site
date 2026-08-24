# Norris Stand site

Static public site for Norris Stand and Drive Folder Sync. It provides:

- The Norris Stand homepage at `/`
- The Drive Folder Sync product page at `/drive-folder-sync.html`
- The Drive Folder Sync pricing page at `/pricing.html`
- The public support and setup page at `/support.html`
- The public downloads page at `/downloads/`
- The public release notes index at `/release-notes/`
- The product privacy policy at `/privacy.html`
- The product terms at `/terms.html`
- The updater manifest at `/updates/drive-folder-sync.json`

## GitHub Pages deployment

1. Create a public GitHub repository, for example `norrisstand-site`.
2. Upload the contents of this `site` directory to the repository root.
3. In the repository, open **Settings > Pages** and set the deployment source to the `main` branch and `/ (root)`.
4. Wait for the temporary `https://<github-user>.github.io/<repository>/` address to work.
5. Add `norrisstand.com` as the custom domain in the Pages settings before editing GoDaddy DNS.
6. At GoDaddy, replace the current `@` WebsiteBuilder A record with GitHub Pages' four A records and replace the `www` CNAME with `<github-user>.github.io`. Keep unrelated DNS records unchanged.
7. Enable **Enforce HTTPS** in GitHub once it becomes available.

Use these Drive Folder Sync URLs in the Google OAuth configuration:

- `https://norrisstand.com/`
- `https://norrisstand.com/privacy.html`
- `https://norrisstand.com/terms.html`

## Release publishing

1. Add or update the release notes page in `site/release-notes/`.
2. Add or update the matching metadata file in `release-metadata/`.
3. Run `.\build.ps1`.
4. Upload the refreshed `site` folder contents to the website repository or hosting target.

When an installer is built, `build.ps1` refreshes:

- `site/downloads/DriveFolderSync-Setup-latest.exe`
- `site/downloads/DriveFolderSync-Setup-latest.sha256.txt`
- `site/downloads/DriveFolderSync-Setup-<version>.exe`
- `site/downloads/DriveFolderSync-Setup-<version>.sha256.txt`
- `site/updates/drive-folder-sync.json`

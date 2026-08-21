# Norris Stand Labs site

Static public site for Drive Folder Sync. It provides the home page, privacy policy, and terms required for the Google OAuth production configuration.

## GitHub Pages deployment

1. Create a public GitHub repository, for example `norrisstand-site`.
2. Upload the contents of this `site` directory to the repository root.
3. In the repository, open **Settings > Pages** and set the deployment source to the `main` branch and `/ (root)`.
4. Wait for the temporary `https://<github-user>.github.io/<repository>/` address to work.
5. Add `norrisstand.com` as the custom domain in the Pages settings before editing GoDaddy DNS.
6. At GoDaddy, replace the current `@` WebsiteBuilder A record with GitHub Pages' four A records and replace the `www` CNAME with `<github-user>.github.io`. Keep unrelated DNS records unchanged.
7. Enable **Enforce HTTPS** in GitHub once it becomes available.

Use these eventual OAuth URLs:

- `https://norrisstand.com/`
- `https://norrisstand.com/privacy.html`
- `https://norrisstand.com/terms.html`

# Purvi Keni — Editorial Marketing Portfolio

A zero-build static personal-brand site for **Purvi Keni** — marketing associate, content creator and brand designer based in Mumbai. Built for hiring managers and agencies: selected work, capability, experience and a direct contact route.

**Design direction:** editorial warm — paper, ink and persimmon; Fraunces display type with Inter body (self-hosted); light and ink themes; subtle motion that respects `prefers-reduced-motion`.

**Live:** <https://mevikrampawar.github.io/purvi-keni/> — deployed on GitHub Pages.

## Preview locally

```bash
cd Projects/purvi_keni_portfolio
python3 -m http.server 8080
```

Open <http://localhost:8080>. Use `localhost` rather than opening `index.html` directly so the email copy button can use the Clipboard API (it requires a secure context).

There is no build step and no npm install.

## Structure

```
index.html                  All page content (semantic, single page)
styles.css                  Design tokens, layout, themes, responsive, print
main.js                     Theme, menu, reveals, filters, accordions, tilt, form, copy
404.html                    Branded not-found page (self-contained, inline CSS)
assets/purvi-keni-resume.pdf  Downloadable résumé
assets/og.png               1200 × 630 social preview image
assets/fonts/               Self-hosted woff2 (Fraunces subset + Inter latin)
.nojekyll                   Tells GitHub Pages to serve files as-is
robots.txt
```

## Deploy to GitHub Pages

This folder is a git repository tracking [`mevikrampawar/purvi-keni`](https://github.com/mevikrampawar/purvi-keni). Pages builds `main` from the repository root.

To publish changes:

```bash
git add .
git commit -m "Describe the change"
git push
```

Pages rebuilds automatically. No GitHub Actions workflow is required. All asset paths are relative, so the site works from a project subpath. `.nojekyll` keeps the files untouched.

### Live URL and social metadata

- Live site: <https://mevikrampawar.github.io/purvi-keni/>
- `og:url`, `og:image`, `twitter:image`, the canonical link and the JSON-LD `url` / `image` use that absolute URL.
- If the site moves to a custom domain, update those values together. A `sitemap.xml` can be added once the final URL is fixed.

### Social preview image

`assets/og.png` (1200 × 630) is included. To regenerate it after a design change:

```bash
# Option A: Chrome headless (local template, self-contained)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1200,630 \
  --screenshot=assets/og.png \
  "file:///Users/vikrampawar/Documents/AI-Workspace/Projects/purvi_keni_portfolio/.planning/og-template.html"

# Option B: Serve locally and screenshot via Playwright/Puppeteer (if installed)
```

The template at `.planning/og-template.html` is local-only (gitignored) and uses system fonts. The live site preloads self-hosted woff2.

## Content and truth rules

- Every metric, role, date, certification and tool on the page comes from `Purvi Keni - Marketing Associate.pdf`.
- No testimonials, client logos, awards or case-study images have been invented.
- **Phone number:** the résumé includes `9833228224`, but the public page intentionally omits it to reduce spam exposure. It remains in the downloadable PDF, and because this repository is public the PDF (and the number in it) is publicly downloadable. Confirm with Purvi before publishing the number on the page.
- Contact is a `mailto:` form — no backend, no stored data. It opens the visitor's email app with a prefilled draft.

## Manual checks (no build pipeline)

- Keyboard: skip link, menu, theme toggle, filters, accordions, form, copy button.
- Accessibility: visible focus, labelled controls, `aria-expanded` / `aria-hidden` state, AA contrast for small text.
- Mobile at 390px and 768px: no horizontal scroll, menu opens/closes, cards stack.
- Reduced motion: disable animations, content still visible.
- Light and ink themes: contrast, form card, marquee.
- Filters: all five categories and the empty state.
- Form: invalid name/email/message, then valid submission opens a mail draft.
- Print: all case-study panels expanded, navigation hidden.
- Experience timeline: scroll progress rail fills, active job highlights.

## Editing

- Content: `index.html`.
- Colours, type and spacing: design tokens at the top of `styles.css`.
- Interactions: `main.js`.
- Résumé: replace `assets/purvi-keni-resume.pdf` with the same filename.
- The 404 page links back to `/purvi-keni/`. If the repository is renamed or the site moves to a custom domain, update that base path in `404.html` along with the canonical/OG/JSON-LD URLs.
- Self-hosted fonts: `assets/fonts/fraunces-subset.woff2`, `assets/fonts/fraunces-italic-subset.woff2`, `assets/fonts/inter-latin.woff2`. Preloaded in `index.html` head.

## v2 candidates

- Real campaign visuals and case-study imagery (only with client permission).
- A portrait photograph and an about-page narrative.
- Custom domain.
- Privacy-friendly analytics, if requested.
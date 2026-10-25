# Purvi Keni — Editorial Marketing Portfolio

A zero-build static personal-brand site for **Purvi Keni** — marketing associate, content creator and brand designer based in Mumbai. Built for hiring managers and agencies: selected work, capability, experience and a direct contact route.

**Design direction:** editorial warm — paper, ink and persimmon; Fraunces display type with Inter body; light and ink themes; subtle motion that respects `prefers-reduced-motion`.

**Status:** v1 built and verified locally. Not yet pushed to GitHub.

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
favicon.svg                 Asterisk monogram
404.html                    Branded not-found page
assets/purvi-keni-resume.pdf  Downloadable résumé
assets/og.png               1200 × 630 social preview image
.nojekyll                   Tells GitHub Pages to serve files as-is
robots.txt
```

## Deploy to GitHub Pages

1. Create a repository (for example `purvi-keni`) under the account that should own the site.
2. Initialise and push this folder (only when approved):

   ```bash
   git init -b main
   git add .
   git commit -m "Purvi Keni portfolio v1"
   git remote add origin https://github.com/<account>/<repo>.git
   git push -u origin main
   ```

3. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`**.
4. The site will be at `https://<account>.github.io/<repo>/`.

No GitHub Actions workflow is required. All asset paths are relative, so the site works from a project subpath. `.nojekyll` keeps the files untouched.

### After the first deploy

- Replace the relative `og:image` / `twitter:image` values in `index.html` with the absolute deployed URL (social crawlers generally require absolute image URLs).
- Add `og:url` and a canonical link with the final URL.
- Optionally add a `sitemap.xml` once the URL is known.

### Social preview image

`assets/og.png` (1200 × 630) is included. To regenerate it after a design change, serve the site locally and screenshot the template in `.planning/og-template.html` (local-only, gitignored):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot=assets/og.png \
  "http://localhost:8080/.planning/og-template.html"
```

## Content and truth rules

- Every metric, role, date, certification and tool on the page comes from `Purvi Keni - Marketing Associate.pdf`.
- No testimonials, client logos, awards or case-study images have been invented.
- **Phone number:** the résumé includes `9833228224`, but the public page intentionally omits it to reduce spam exposure. It remains in the downloadable PDF. Confirm with Purvi before publishing the number on the page.
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

## Editing

- Content: `index.html`.
- Colours, type and spacing: design tokens at the top of `styles.css`.
- Interactions: `main.js`.
- Résumé: replace `assets/purvi-keni-resume.pdf` with the same filename.

## v2 candidates

- Real campaign visuals and case-study imagery (only with client permission).
- A portrait photograph and an about-page narrative.
- Custom domain.
- Privacy-friendly analytics, if requested.
- Absolute social-preview URL and canonical tags for the live domain.

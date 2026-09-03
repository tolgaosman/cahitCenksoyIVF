# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
Static marketing site for **Dr. John Doe's IVF / fertility clinic** (Lefkoşa/Girne, North Cyprus). Plain HTML + CSS + vanilla JS, **no build step, no package manager** — files are deployed as-is. Primary content language is **Turkish**; an **English** translation is offered via a TR/EN flag dropdown (left of the theme toggle) powered by a reload-based Google Translate integration.

## Running / previewing
There is no build or test suite. Serve the folder over HTTP (not `file://`) so Firebase and Google Translate load:
```
npx serve .        # or any static server on the repo root
```
Open `http://localhost:PORT/index.html`. To screenshot headlessly on Windows for visual checks:
`msedge.exe --headless=new --hide-scrollbars --window-size=1440,900 --screenshot=out.png URL`
(viewport-only capture; `--blink-settings=preferredColorScheme=1` forces light theme, `--force-prefers-reduced-motion` reveals all `.reveal` sections without scrolling).

## Architecture (read before editing pages)

### Shared chrome is injected by JS — do not hand-copy nav/footer
`components.js` is the **single source of truth** for the navbar and footer. Each page contains only two placeholders:
```html
<div id="site-header"></div>   <!-- near top of <body> -->
<div id="site-footer"></div>   <!-- before closing scripts -->
```
`components.js` injects the markup synchronously on script eval and highlights the active nav link from `location.pathname` (`.nav-link--active`). **It must be loaded before `app.js`** (app.js captures `.navbar` and wires `#themeToggle` etc., which only exist after injection). To change navigation/footer for the whole site, edit the `NAV_LINKS` / `headerHTML` / `footerHTML` in `components.js` — never re-duplicate chrome into individual pages.

Script order on every page:
```html
<script src="components.js"></script>
<script src="translations.js"></script>   <!-- procDescriptions for the process modal -->
<script src="app.js"></script>
```

### `app.js` is the wiring layer
Theme toggle (light/dark via `data-theme` on `<html>` + localStorage; swaps `siyahLogo↔beyazLogo` and `johnSignature↔johnSignature_white`), TR/EN language switching (`changeLanguage`), navbar hide-on-scroll + `.scrolled` shrink, mobile menu / dropdowns (event delegation on `document`), the process modal (`openProcessModal`/`closeProcessModal` reading `procDescriptions`), the team carousel, the toast utility, and the **motion layer** (IntersectionObserver scroll-reveal for `.reveal`, count-up for `[data-count]`, both disabled under `prefers-reduced-motion`).

**IDs/classes that `app.js` and inline page scripts depend on — keep them when restyling:** `navbar`, `navLogo`, `footerLogo`, `johnSignature`, `themeToggle`, `mobileToggle`, `.nav-links`, `.dropdown`, `.lang-selector`, `currentLang`, `currentLangFlag`, `.lang-option`, `google_translate_element`, `teamCarousel`, `teamPrev`, `teamNext`, `processModal`, `modalTitle`, `modalDescription`.

### Design system — `style.css` (v4.0, "Modern & Dynamic")
Theming is driven entirely by CSS custom properties on `:root` and `[data-theme="dark"]`. Brand pink (`--primary-color: #f8c8dc`) is preserved; a complementary plum accent (`--accent: #6d2c4f`, `--accent-2: #b14d80`), lavender/peach, neutral creams, gradient tokens (`--grad-cta`, `--grad-text`, `--grad-soft`…), and glass tokens (`--glass-bg`, `--blur`) were added. **Style via these tokens, not hard-coded colors**, so both themes stay correct. Reusable building blocks: `.glass`, `.gradient-text`, `.eyebrow`, `.section-header`/`.header-line`, `.btn`/`.btn-primary`/`.btn-secondary`, `.card`-like section grids, and `.reveal[data-delay="1..4"]` for staggered entrance animations. An animated ambient gradient lives on `body::before`.

### TR/EN translation via Google Translate (reload-based)
A `.lang-selector` flag dropdown (🇹🇷 TR / 🇺🇸 EN, left of `#themeToggle`) is injected by `components.js`. Clicking a flag calls `changeLanguage()` in `app.js`, which sets/clears the `googtrans` cookie and reloads; the hidden `#google_translate_element` widget (loaded via `element.js`, initialized in global `googleTranslateElementInit`) reads the cookie on load and translates. Only `tr,en` are enabled. The widget container is hidden **off-screen** (not `display:none`) and only the visible Google banner is hidden — do not blanket-hide `.skiptranslate`, which would break translation. Flags render via the "Twemoji Country Flags" polyfill font. The chosen language persists via `localStorage.lang` + the cookie.

### Dynamic data — Firebase
`index.html` and `team.html` load team members from **Firestore** (`collection "team"`, `orderBy("sortOrder")`) via an inline ES-module script and render `.team-card`s. `admin-panel.html` + `admin-firebase.js` manage that content (separate dark/peach admin theme — out of scope for the public redesign). The Firebase web config/apiKey is intentionally client-side.

### Contact forms (`contact.html`)
Two forms (detailed appointment + simple message). On submit they **POST to `https://john-doe-admin.onrender.com/api/basvuru`** (fire-and-forget) and then open a prefilled **WhatsApp** chat (`wa.me/905488880112`). Inline JS handles validation/enable-state. Keep both the POST and the WhatsApp `window.open` when editing.

## Conventions / gotchas
- **Preserve page content verbatim.** The redesign mandate is design/architecture only — do not alter clinic information: doctor bio, the 8 treatment descriptions, process steps, the stats (`3640 / 2260 / 693 / 538 / 610` and success %), phone numbers, or emails.
- Bump the `?v=` query on `style.css` (and other shared assets) when changing them, for cache-busting.
- All assets (images, logos, PDF) live in the repo root; logos have light/dark variants swapped at runtime.

## Redesign rollout status
- **Done (Phase 1):** new design system in `style.css`, shared `components.js`, redesigned `index.html`, motion in `app.js`.
- **Done (Phase 2):** all public pages migrated to the shared chrome — the 8 treatment detail pages, `team.html`, `treatments.html`, `ivf.html`, `testimonials.html`, `faq.html`, `blog.html`, `blog-post.html`, `tbSozluk.html`, `contact.html` now use the `#site-header`/`#site-footer` placeholders + `components.js` and inherit the new design tokens. Their page-specific sections pick up the new palette automatically because every original CSS variable name was preserved.
- `admin-panel.html` intentionally keeps its own separate dark/peach admin theme and is not part of the public redesign.

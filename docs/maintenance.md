# Ghost 6 refresh

This fork starts at `driftwareio/liebling` upstream commit
`5aaee33`. No merge, cherry-pick, copied stylesheet, script, template, vendor asset,
privacy proxy, consent bootstrap or analytics wrapper from `liebling-old` is used.
The old repository's build/test, deploy and release workflows served as references;
they were adapted to this fork's `master` branch and new build. Hover effects and
single slider arrows are newly implemented against the original upstream source.
Privacy scanning/service inventory/dependency gate workflows from the old fork are
not copied because they rely on unrelated old code.

## Build and install

Use Node 24 (GScan currently supports Node 22.17+ or 24).

```sh
npm ci --prefix src
npm run audit --prefix src
npm run production --prefix src
npm run check --prefix src
npm test --prefix src
npm exec --prefix src -- playwright install chromium
npm run test:browser --prefix src
```

`liebling.zip` includes root templates, package metadata, LICENSE, assets, partials
and locales only. Source, node_modules, workflows, tests, docs and source maps are
excluded by an allowlist. The existing Liebling fonts/icon font remain theme assets.
No downloaded JavaScript library or library stylesheet enters the ZIP.

`npm run watch --prefix src` watches theme JS and Sass. Local Ghost development:
`docker compose -f src/docker-compose.yml up -d`. The compose setup uses Ghost 6
and a fresh persistent data volume rather than downloading an old demo database.

## Runtime libraries

Verified against npm on 2026-10-26. Exact versions appear in CDN import URLs;
`+esm` asks jsDelivr to provide an ES module for packages without browser ESM.
Transitive runtime dependencies of those modules are also served by the CDN.

| Library | Version | Use |
| --- | --- | --- |
| jQuery | 4.0.0 | Existing theme interactions |
| Headroom | 0.12.0 | Header scrolling |
| Tippy | 6.3.7 | Tooltips / secondary navigation |
| Shave | 5.2.0 | Card title truncation |
| Swiper | 14.3.0 | Featured, recent and related sliders |
| medium-zoom | 1.1.2 | Images and galleries |
| FitVids | 2.1.1 | Responsive video embeds |
| Ghost Content API | 1.12.13 | Optional legacy search only |
| Fuse | 7.5.0 | Optional legacy search only |

Ghost native search is the default. Content API and Fuse load dynamically only
when the legacy search is explicitly configured. They do not load for native
search. Theme JS is built with esbuild; Sass compiles theme CSS. Runtime imports
stay external and a build assertion rejects node_modules in the emitted bundles.

Dependabot checks npm build dependencies and Actions weekly. CDN runtime versions
are intentionally pinned and must be updated in `src/js/*.js`, `default.hbs` and
this table after checking npm releases. Then run the full validation above,
including browser tests against the actual CDN. No automatic unreviewed runtime
upgrade or floating CDN version is used.

## Ghost feature coverage

| Feature | Handling |
| --- | --- |
| SEO, canonical URLs, structured data, social previews | Ghost's `ghost_head` retained |
| Portal, sign-in, account, paid tiers, offers, payments | Ghost core via `ghost_head` / `ghost_foot`; Portal links can be added through Ghost navigation |
| Public/member/paid content and public previews | Unmodified `content` helper; Ghost's built-in restricted-content CTA retained |
| Newsletter forms | Native `data-members-form`; omitted when membership is disabled |
| Native search | Enabled by default, `data-ghost-search` on both search buttons |
| Native comments | Original `comments` helper retained; removed unsafe direct access to cross-origin comments iframe |
| Announcement bar | Existing mutation/resize handling retained |
| Custom body/heading fonts | `--gh-font-body` and `--gh-font-heading` with original font fallbacks |
| Page title and feature image visibility | `@page.show_title_and_feature_image` respected |
| Editor cards | `config.card_assets: true`; Ghost supplies current card CSS/JS including bookmark/gallery, audio/video, file, product, header, signup, CTA, toggle and before/after cards |
| Card interactions | Generic theme buttons no longer override card buttons; only image/gallery images get zoom, never product or signup images |
| Authors / social profiles | `social_url` replaces deprecated helpers and supports all nine Ghost social platforms |
| Tags/authors archives | Explicit limit 100, the Ghost 6 supported maximum; no unsupported `limit='all'` |
| Navigation, secondary navigation, RSS, pagination | Existing upstream functionality retained |
| ActivityPub, recommendations, analytics, email rendering | Owned by Ghost/server/Portal rather than recreated or intercepted in theme code |

This is theme compatibility, not an implementation of every server feature. SMTP,
Stripe, ActivityPub/federation, analytics hosting, paid tiers and site consent
settings remain Ghost/site configuration. There is no new consent script, CMP
snippet, tracking script, embed rewrite or analytics switch in the theme.

No Mermaid, syntax-highlighting/copy implementation, old layout redesign or other
custom feature from the previous fork has been brought across.

Links in article prose use blue and a visited purple variant for light and dark
modes. Hover/focus underlines them. Cards/buttons retain their native styling.
The CSS `:visited` state uses browser history, never a click-tracking script.
Card lift/shadow effects apply on pointer-hover devices with motion enabled;
reduced-motion users do not get that animation. Swiper icon injection is disabled
and its fallback pseudo-element is hidden so the original icon spans appear once.

## Checks and limitations

GScan 6.6.1 passes with 100/100, no errors and no warnings. Contract tests inspect
the actual ZIP for excluded source, vendor bundles and unwanted consent code and
render the actual templates to verify native hooks, forms and page visibility.
Playwright tests exercise sliders, menu, dark mode, article links, image zoom
selection, reduced motion and horizontal overflow on desktop and mobile widths.
These tests use a template harness; they do not replace a staging Ghost check of
real member login, Stripe transactions, every editor card, native comments and
announcement bar integration. No production Ghost site is changed by this PR.

In the restricted development environment, public jsDelivr requests time out.
Local browser verification therefore maps the exact pinned npm packages to
**temporary test-only bundles outside the repository** via `CDN_FIXTURES`.
CI leaves that setting unset and loads the actual public CDN URLs. A passing local
test is not a claim that the public CDN endpoints were reachable from this sandbox.

### Known audit exception (reviewed 2026-10-26)

Latest GScan depends on `@tryghost/zip`, which depends on latest `extract-zip`
2.0.1. That package has no patched release for:

- https://github.com/advisories/GHSA-jmr9-qjv8-65gv
- https://github.com/advisories/GHSA-7pqw-9j4j-h8q3

npm reports three high-severity dependency-chain findings (extract-zip, its wrapper,
and GScan). Validation uses **directory scanning only**, never `checkZip()` on an
untrusted archive. No GScan/zip-extraction code is present in the theme ZIP.
`src/audit.mjs` explicitly permits only this advisory chain; other/new findings
fail CI. Remove the exception once a patched upstream package is available.
GScan's pinned Handlebars is overridden to 4.7.10 and source-map-js to 1.2.2,
which fixes the additional audit findings discovered during this update.

## Workflows

- **Test:** PRs and pushes to master; dependency audit, build, strict GScan,
  ZIP/contracts, real-CDN browser tests, installable ZIP artifact.
- **Deploy Ghost theme:** only a successful same-repository **push** test on master,
  or manual dispatch on master. Rebuilds the exact tested commit and checks it is
  still the branch head. Uses the `production` environment and secrets
  `GHOST_ADMIN_API_URL`, `GHOST_ADMIN_API_KEY`. PR runs cannot trigger deployment.
  Configure these secrets in the **new** repository; secrets are not copied from
  the renamed old repository.
- **Release Ghost theme:** version tags `vX.Y.Z` must match package.json; publishes
  a validated ZIP, SHA-256 checksum and generated notes with compare link.
- **Dependabot:** weekly build-tool and Actions updates.

Actions are pinned to verified release commit SHAs. Deploy/release do not run merely
because this feature branch or its pull request is created. No live deployment,
merge, release tag or repository-default-branch change is part of the refresh.

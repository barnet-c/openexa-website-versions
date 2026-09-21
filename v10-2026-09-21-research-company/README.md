# OpenEXA — website (v10 · research + company)

The public site for [openexa.com](https://www.openexa.com). This build is the CEO's cut (v9) plus a
Research section, a Company page and a new point-cloud figure engine. v9 started from the version
the CEO preferred (v1, *timely-quokka*, 3 Sep 2026) and keeps its identity — the dark WebGL
overture, the paper-and-ink "Ledger" chapters, the numbered sections, the full eight-layer story —
while removing what should never have been public, removing every exchange name, and giving the
whole thing the engineering it deserved.

Static HTML/CSS/JS. No build step, no framework, no tracking, no dependencies. Deploy the folder to
any static host (Netlify Drop, Vercel, S3/CloudFront, GitHub Pages).

```
openexa-v9/
├── index.html          Home — five-beat WebGL overture, then eight chapters: the work · the stack · Lifecycle 01 (with the live swarm) · proof · why agents · trust & governance (with the SHA-256 chain) · evolution · research
├── platform.html       The agentic stack: eight layers, one boundary, the swarm, execution pipeline, customer MCP servers, operating modes
├── lifecycles.html     The lifecycle test, six lifecycle classes, Lifecycle 01 in depth (with the desk simulator), next lifecycles
├── evidence.html       Proof: ten-session ledger, broker verification, cost/risk stack, interactive economics model
├── trust.html          Trust & governance: the Council gate, permissions, ledger, control plane, does/does-not, risk factors
├── company.html        Company: the sculpture (Specialize · Coordinate · Act), mission, the story in four moves, four constants, where the work is
├── research.html       Research: ten notes, one point-cloud figure that becomes the idea you point at
├── research/           01–10 articles, each with its own figure, sticky table of contents and prev/next pager
├── insights.html       Redirect stub → research.html (kept so old links resolve; noindex)
├── access.html         Request-access form: bring a lifecycle · manager platform · partnership · qualified investor
├── 404.html            "This page didn't pass." (noindex)
├── site.webmanifest · robots.txt · sitemap.xml (18 URLs) · _redirects (no custom rules)
└── assets/
    ├── css/site.css    The "Ledger" design system (paper + ink) + story stage, chapters, objects, forms, editorial layer
    ├── js/story.js     WebGL story engine — one 12k-point swarm morphing through five formations, two-pass glow
    ├── js/figure.js    WebGL figure engine — 8.4k-point cloud, twelve named formations, morphs on hover/click (research, company)
    ├── js/swarm.js     The swarm, live — agents through six gates, a council you can tighten, a halt switch (index.html)
    ├── js/chain.js     The chain — eight SHA-256-chained records you can edit and watch break (index.html)
    ├── js/gap.js       The desk — an illustrative model of one session of Lifecycle 01 (lifecycles.html)
    ├── js/site.js      Nav, clocks, chapter rail, loader, split text, reveals, counters, calculator, form, ledger stream, 2D fallback
    └── img/            globe.svg, favicon.svg, og.png (1200×630), icon-192/512.png, apple-touch-icon.png
```

## What changed from v1

**Removed.**
- The Company page (team biographies, photographs, office address, phone, personal email) and the
  Investors page (the deck in the open, the ask). Nothing personal remains anywhere on the site;
  the only location given is "Seattle, WA". The access form's inbox lives in one place, as
  `data-contact` on the body of `access.html`.
- The homepage team section, the contact block in the closing band, phone and address in every footer.
- Every mention of NASDAQ and NYSE, everywhere. "Live on NASDAQ and NYSE" became "live on real
  capital"; the hero sub-line is now exactly *"OpenEXA builds the end-to-end infrastructure on which
  swarms of domain-specific AI agents run the world's high-value lifecycles."* Broker names on the
  Proof page became "broker confirmations" and "reconciliation reports"; clearing-house names became
  "clearing & settlement". Third-party marks are no longer listed in the disclaimer.
- Investor-deck figures that read as a pitch: revenue capacity (ARR), AUM capacity, the BTC-yield
  "why now" section and the go-to-market section on the Lifecycles page, the "$15B managed" team line.
- The custom cursor and magnetic buttons. The pointer is the native one.

**Kept.** Everything the CEO liked: the headline, the dark overture into paper chapters, the eight
layers, the vertical execution diagram, the ten-session proof, the 90% economics table, the roadmap,
Reg D 506(c) disclosures, the loader, the numbered prospectus structure.

**Added.**
- The three interactive objects built after v1: the **live swarm** (chapter 03 — tighten the
  council, halt the lane), the **SHA-256 chain** (chapter 06 — edit a record, watch the chain break,
  restore it) and the **desk** (Lifecycles — one simulated session of Lifecycle 01).
- Story engine upgrades: two-pass additive glow, scroll inertia so the cloud flocks rather than
  snaps, a pause control, real buttons for the five chapter marks (keyboard-navigable, `aria-current`),
  inert inactive beats, a still frame painted before the engine is ready, rendering suspended
  off-screen and in hidden tabs, `prefers-reduced-motion` honoured at runtime.
- The hero figures moved out of the globe and under the copy, so nothing overlaps the mark at any width.
- Chapter rail (fixed, right edge) and giant faint chapter numerals on the homepage; legal disclosures
  behind a keyboard-operable disclosure in every footer (fully visible without JavaScript).
- Accessible mobile menu (Escape, focus return, contained tabbing); current page marked at runtime so
  clean URLs and `.html` both work.
- Access form: native validation, percent-encoded mail draft that explicitly says nothing has been
  sent, an edit action that preserves input, endpoint mode with real error handling, deep links
  (`#lifecycles`, `#managers`, `#partners`, `#investors`) preselecting the right path.
- Time-based loader (never stretched by a slow GPU; hard cap 1.8 s), `[hidden]` made authoritative,
  wide tables wrapped in scrollable regions for phones, canonical/OG/Twitter tags, JSON-LD, manifest,
  robots, sitemap, share card.

## Research and Company (added 21 Sep)

**Research** (`research.html` + `research/`). Ten notes from the OpenEXA research blog, published in
this order: the two research notes first (*Compounding Error and the Case for Decomposition*,
*Post-training and Audit*), then the eight-part series (*Not tasks — lifecycles* through *Master and
copy*). Each article has a hero figure drawn from its idea, a sticky table of contents generated from
its headings, a drop-cap lead, a prev/next pager and `TechArticle` JSON-LD. The index page carries
one figure that morphs into the idea of whichever note you point at or focus. The homepage gained
chapter 08 with the three featured notes; `insights.html` now redirects here. Two sentences that
named brokers were rewritten to "broker-confirmed", in line with the rule above.

**Company** (`company.html`). "Intelligence, put to work." A point-cloud sculpture that you can put
into its three modes — *Specialize* (thousands of narrow agents), *Coordinate* (the council),
*Act* (the deterministic boundary) — with a live caption; the mission as a manifesto that lights as
you read; the story in four moves; the four constants on a dark ground over a faint lifecycle
figure; where the work is. No names, no photographs, no address.

**Figure engine** (`assets/js/figure.js`). One compact WebGL renderer for every `[data-figure]`
stage: 8,400 points (4,200 on phones), twelve named formations (horizon, weights, lifecycle, swarm,
boundary, rulebook, council, ledger, sessions, mastercopy, library, company), spring morphs between
them, pointer tilt, two-pass glow, rendering suspended off-screen and in hidden tabs,
`prefers-reduced-motion` honoured, and a static SVG-mask fallback when WebGL is unavailable.
Wiring is declarative: `data-figure-target` on a list item or button names the formation to show,
`data-figure-stage` names the stage, `data-copy` swaps a caption.

## Verification

`verify_v9.py` (session tooling, Playwright + SwiftShader) passes: 11 pages (including Company, the
Research index and two articles) at 1440 and 390 with zero console errors, no horizontal overflow
and none of the forbidden strings (exchange names, broker names, people's names, phone, address,
ARR figures); five story beats navigable with the hero figures clear of the globe; swarm runs and
halts; chain breaks at record 03 and restores; the desk runs; the access form preselects from the
hash, prepares a draft and restores input on edit; every page is readable without JavaScript; the
homepage and every figure stage fall back without WebGL. `verify_editorial.py` covers the figure
morphs (hover on the research index, mode buttons on Company), all ten articles (figure ready, table
of contents matches the headings), the manifesto lighting, the timeline reveal and the insights
redirect. `linkcheck_tree.py`: 712 internal references across 20 pages, none broken.

## Local preview

```
cd openexa-v9
python -m http.server 8125
# open http://127.0.0.1:8125/
```

# OpenEXA — website

The public site for [openexa.com](https://www.openexa.com). OpenEXA is **an AI company**: it
builds swarms of 5,000 to 50,000 small, specialised agents that take on entire lifecycles of
high-stakes work, end to end, on the record. The first lifecycle, in financial markets, is in
production. Finance is the proving ground, not the identity: the site is written and designed
as an AI-infrastructure company, with the market detail kept to the Lifecycle 01 and Proof pages.

Static HTML/CSS/JS. No build step, no framework, no tracking. Deploy the folder to any
static host (Vercel, Netlify, Azure Static Web Apps, S3/CloudFront, GitHub Pages).

```
openexa-site/
├── index.html          Home — six-beat scroll story, then six chapters: thesis · lifecycle test · swarm · system · in production · on the record
├── platform.html       The stack: eight layers, one boundary, the swarm, execution pipeline, customer MCP servers, operating modes
├── lifecycles.html     What a lifecycle is, the six-trait test, six classes, Lifecycle 01 in depth (with the desk), what comes next
├── evidence.html       Proof: ten sessions above the floor, broker verification, where the 90% comes from
├── trust.html          Governance: the Council gate, the control plane, the ledger, plain-language does/does-not, risks
├── insights.html       Research index linking to the existing blog archive and the Forbes column
├── access.html         Request-access form (put the swarm on your assets / manager platform / bring a lifecycle / partner)
├── 404.html            "This page didn't pass." — branded not-found page with the 2D swarm (noindex)
├── site.webmanifest · robots.txt · sitemap.xml
└── assets/
    ├── css/site.css    Design system + story stage, HUD frame, chapters, manifesto, traits, system ladder, the desk, loader, transitions
    ├── js/story.js     WebGL story engine — one point cloud morphing through five formations over six beats, two-pass glow
    ├── js/swarm.js     The swarm, live — thousands of agents through six gates, a council you can tighten, a halt switch (index.html)
    ├── js/chain.js     The chain — eight SHA-256-chained records you can edit and watch break (index.html)
    ├── js/gap.js       The desk — an illustrative model of one session of Lifecycle 01 (lifecycles.html)
    ├── js/site.js      Nav, clocks, chapter rail, manifesto, loader, split text, reveals, counters, ledger stream, form, 2D fallback swarm
    └── img/            globe.svg (brand mark, currentColor), favicon.svg, og.png (1200×630), icon-192/512.png, apple-touch-icon.png
```

## What the site says

One idea — high-stakes work is becoming agents' work — told with as few words as possible.
The objects carry it; the copy stays short.

**The overture** (six scroll beats on one WebGL point cloud, framed by a thin HUD): the globe →
*the work* (a constellation: six lifecycle classes on one ring, each feeding one core, the first
lit) → *the workforce* (five to fifty thousand agents through six gates) → *the system* (eight
plates, agents decide, code executes) → *in production* (ten runs above the floor) → *next* (the
globe again, labelled with the lifecycles beyond the first).

**The chapters:**

1. **The thesis.** A manifesto that lights up word by word: software has always waited for a
   person to decide; it doesn't have to anymore; the first lifecycle is already in production.
2. **The lifecycle test.** Six traits — multi-party, regulated, structured, exception-heavy,
   gated, audit-bound — and the six industries that pass.
3. **The swarm.** Six gates between a signal and a record.
4. **The system.** The eight-layer ladder with the boundary drawn through it: agents decide
   above, code executes below.
5. **In production.** Lifecycle 01: ten runs, ten above the floor, independently confirmed.
   Ninety percent less cost and risk than the desk doing the same work.
6. **On the record.** Council, permissions, an append-only ledger, one halt switch; three
   operating modes.

Copy rules: short sentences, numbers carry the headlines, no jargon chains, no market marketing
on the homepage (no exchange names, no basis points, no yield). Performance is framed as
proof-of-concept results. Reg D 506(c) disclosures sit in every footer.

**Not on the site:** team names or photos, phone numbers, street addresses, personal email
addresses, fundraising figures, go-to-market or demand-side pitch material. The only location
given is "Seattle, WA". See *Wiring the form* for the one place an inbox address lives.

## Design

One palette, everywhere: ink and signal green.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0E1512` | Page background |
| `--ink-2` | `#151D19` | Lifted sections (`.is-lift`) |
| `--paper` | `#F5F2EC` | Type, primary buttons, brand mark |
| `--khaki` | `#ACA68E` | Secondary accents, NAV line |
| `--signal` / `--signal-bright` | `#1E7A5A` / `#4FCB93` | The single accent — agents, live, settled, verified |
| `--reject` | `#B4443C` | Rejected proposals only |

- **Type:** Instrument Serif (display), Inter (text), IBM Plex Mono (numerals, labels, tickers).
- **Structure:** numbered sections, hairline rules, tabular numerals. Reads like a prospectus
  for an infrastructure company, not a landing page.
- **Brand mark:** the dotted globe as a resolution-independent SVG (`assets/img/globe.svg`)
  that inherits `currentColor`.

## The story engine

`story.js` is a single raw-WebGL point cloud — 12,000 points on desktop, 5,500 on narrow
screens — that morphs between five formations over six beats as the homepage overture scrolls
(`FORM = [0, 1, 2, 3, 4, 0]`: the story ends where it began, on the globe):

| Beat | Formation | What you see |
|---|---|---|
| 0 | Globe | The mark, with agent orbits through Signal · Predict · Decide · Approve · Execute · Record |
| 1 | The work | A constellation: six lifecycle classes on one ring, faint spokes and green agents flowing from each into one core. Financial markets is lit; the rest are next |
| 2 | The workforce | Agents streaming down a vertical rail through six gates; a red reject spur; a green recorded ledger |
| 3 | The system | Eight plates seen from above, signals rising on three buses |
| 4 | In production | Ten runs, every bar above the floor |
| 5 | Next | The globe again, its orbit now labelled Markets · live, Trade finance, Securitization, Energy, Semiconductors, Pharma & aerospace |

Morphs are GPU-side, staggered and eased. Each frame draws twice: an additive halo pass (a soft
bloom that gathers around the green agents) and a crisp pass. Agents lift and brighten while in
flight; the beat fraction follows the scroll with a little inertia so the cloud flocks rather than
snaps. Labels are DOM nodes projected from 3D each frame. A thin HUD frame (corner brackets and a
mono readout that fades after the hero) sits over the stage.
On desktop the composition is tuned at 16:10 and shrinks proportionally on squarer viewports;
on narrow screens each formation sits above the copy with its own scale and offset. The hero
stats sit in the text column, so nothing overlaps the globe at any width. The stage pauses
off-screen and falls back to static beats (`.no-webgl`) without WebGL.

## The desk

`gap.js` runs an illustrative model of one session of Lifecycle 01, on `lifecycles.html`. The gap
(price minus NAV, in basis points) wanders as a mean-reverting process with occasional flow shocks.
Whenever it runs past the threshold an agent acts — create above NAV, redeem below — pulling the
gap back toward zero and writing a line to the log. Two sliders: the threshold (2–20 bps) and the
number of agents on the fund (500–50,000, which sets how quickly gaps get worked). Hover the chart
to scrub. A session takes about 45 seconds, then a new one starts. It is labelled "not market
data" on the panel and draws nothing from any feed.

## The swarm, live

`swarm.js` (homepage, chapter 03) is a particle model of the six gates. Every dot is an agent
carrying one proposal, flowing left to right through Signal → Predict → Decide → Approve →
Execute → Record. At gate 04 the council rejects a share of proposals against a strictness you
set (0–60%); rejected agents fall out of the lane in red. Recorded agents arc into a ledger
column on the right that fills one line per record. Two sliders (agents 500–6,000, council
strictness) and a real **Halt** button: no new proposals enter, open work drains, the lane dims.
Counters for in flight, recorded, rejected and records per second. Illustrative; nothing is
real work.

## The chain, for real

`chain.js` (homepage, chapter 06) is eight records from one proposal, each hashed with SHA-256
(WebCrypto) over its contents plus the previous record's hash. Every event and detail is
`contenteditable`: change anything and the chain re-verifies — the edited record and every record
after it turn red, with the stored hash struck through and the new, non-matching hash beside it.
"Restore the original records" heals it. The point lands without a paragraph: nothing on the
ledger can be changed quietly.

## Small things that are real

- **Clocks.** The footer carries live Seattle and New York clocks, computed client-side with
  `Intl`.
- **Chapters.** Every chapter has a giant faint numeral and an entry in a fixed rail on the
  right (numbers only; labels on hover) that lights as you scroll. Built from
  `section[data-chapter]`; hidden under 1240px.
- **Manifesto.** `[data-manifesto]` splits into words and lights them as the block travels
  through the viewport; `<em>` words light in signal green.
- **Nav** tucks away on the way down and returns on the way up. Section rules draw themselves in;
  grids reveal one cell at a time (`data-stagger`).
- **Cursor** is the native one. Buttons lift a pixel on hover and settle on press; nothing
  follows the mouse.
- **Share cards.** Every page has canonical, Open Graph and Twitter tags pointing at
  `assets/img/og.png`; the home page carries Organization JSON-LD. Web manifest and touch icons
  are in place. `sitemap.xml` and `robots.txt` reference `https://www.openexa.com/`.
- **404** reuses the header and footer and says what the system would say: rejected at the gate,
  nothing executed, logged.

Also: a preloader that counts to 100 while fonts load (hard cap 3.2 s), kinetic type
(`data-split`), a nav progress bar,
MPA view transitions in Chromium, and an illustrative hash-chained ledger stream on the
homepage. All motion respects `prefers-reduced-motion`.

## Wiring the form

`access.html` posts nowhere by default. On submit it shows a confirmation and offers a
pre-filled `mailto:`. The inbox is set once, as a data attribute on the page body:

```html
<body data-contact="access@openexa.com">
```

To send submissions to a backend instead, add `data-endpoint="https://…"` to the
`<form data-access>`; the JSON body contains
`interest, name, email, organization, role, assets, message, accredited`.

## Local preview

```
cd openexa-site
python -m http.server 8123
# open http://127.0.0.1:8123/
```

## Rights

The globe mark is OpenEXA's own. Third-party marks (TradeStation, Interactive Brokers, NASDAQ,
NYSE, DTCC) are referenced in text only and disclaimed in the footer.

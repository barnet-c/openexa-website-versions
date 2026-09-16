# OpenEXA — website

The public site for [openexa.com](https://www.openexa.com). OpenEXA is an AI agentic company:
a swarm of 5,000 to 50,000 small agents runs a whole financial lifecycle end to end. The first
lifecycle is ETF creation and redemption, live on NASDAQ and NYSE.

Static HTML/CSS/JS. No build step, no framework, no tracking. Deploy the folder to any
static host (Vercel, Netlify, Azure Static Web Apps, S3/CloudFront, GitHub Pages).

```
openexa-site/
├── index.html          Home — scroll story (globe → the gap → the swarm → the stack → proof), then seven short sections
├── platform.html       The stack: eight layers, one boundary, the swarm, execution pipeline, customer MCP servers, operating modes
├── lifecycles.html     What a lifecycle is, the six-trait test, Lifecycle 01 in depth, why now, what comes next
├── evidence.html       Proof: ten sessions above 10 bps, broker verification, where the 90% comes from
├── trust.html          Governance: the Council gate, the control plane, the ledger, plain-language does/does-not, risks
├── insights.html       Research index linking to the existing blog archive and the Forbes column
├── access.html         Request-access form (put the swarm on your assets / manager platform / bring a lifecycle / partner)
└── assets/
    ├── css/site.css    Design system + story stage, loader, cursor, transitions
    ├── js/story.js     WebGL story engine — one point cloud morphing through five formations
    ├── js/site.js      Nav, loader, split text, cursor, reveals, counters, ledger stream, form, 2D fallback swarm
    └── img/            globe.svg (brand mark, currentColor), favicon.svg
```

## What the site says

One message, in this order:

1. **The gap.** An ETF's price drifts from what it holds, all day, across 17,000 funds. Small
   gaps that a human desk cannot afford to chase.
2. **Create and redeem.** Price above NAV: deliver the basket, receive shares, sell at the
   premium. Price below NAV: buy shares, redeem for the basket. The agents do both.
3. **The swarm.** 5,000 to 50,000 narrow agents. Six gates between a signal and a settlement:
   Signal → Predict → Decide → Approve → Execute → Settle. Nothing reaches the market that
   did not pass all six.
4. **The stack.** Eight layers. Models and agents decide at the top; routing, execution,
   connectivity and permissions run underneath as deterministic code. Custody never moves.
5. **Proof.** Ten consecutive sessions above 10 bps on NASDAQ and NYSE, verified by broker
   confirmations. 90% of a traditional desk's cost and risk gone.
6. **On the record.** Every proposal, approval and fill in an append-only, hash-chained
   ledger. Three operating modes: automatic, with approval, manual.
7. **What's next.** One agent → many agents → an open platform; then the same rails for other
   lifecycles (trade finance, securitization, energy, industrial).

Copy rules: short sentences, numbers carry the headlines, no jargon chains. Yield language is
framed as targets and proof-of-concept results. Reg D 506(c) disclosures sit in every footer.

**Not on the site:** team names or photos, phone numbers, street addresses, personal email
addresses, fundraising figures. The only location given is "Seattle, WA". See *Wiring the form*
for the one place an inbox address lives.

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
screens — that morphs between five formations as the homepage overture scrolls:

| Beat | Formation | What you see |
|---|---|---|
| 0 | Globe | The mark, with agent orbits through Signal · Predict · Decide · Approve · Execute · Settle |
| 1 | The gap | A NAV line, a drifting price curve, and green agents falling from the price back to NAV — create at the premium, redeem at the discount |
| 2 | The swarm | Agents streaming down a vertical rail through six gates; a red reject spur; a green settled ledger |
| 3 | The stack | Eight plates seen from above, signals rising on three buses |
| 4 | Proof | Ten sessions, every bar above the 10 bps floor |

Morphs are GPU-side, staggered and eased. Labels are DOM nodes projected from 3D each frame.
On desktop the composition is tuned at 16:10 and shrinks proportionally on squarer viewports;
on narrow screens each formation sits above the copy with its own scale and offset. The hero
stats sit in the text column, so nothing overlaps the globe at any width. The stage pauses
off-screen and falls back to static beats (`.no-webgl`) without WebGL.

Also: a preloader that counts to 100 while fonts load (hard cap 3.2 s), kinetic type
(`data-split`), a nav progress bar, a custom cursor on fine pointers, magnetic buttons,
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

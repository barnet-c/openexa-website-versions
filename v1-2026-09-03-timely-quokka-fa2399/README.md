# OpenEXA — website redesign

A ground-up redesign of [openexa.com](https://www.openexa.com), repositioning OpenEXA from a
finance company into what the investor deck actually describes: **an AI agentic company —
end-to-end infrastructure for agentic lifecycles** — with ETF creation & redemption as
*Lifecycle 01*, the first proof, not the identity.

Static HTML/CSS/JS. No build step, no framework, no tracking. Deploy the folder to any
static host (Vercel, Netlify, Azure Static Web Apps, S3/CloudFront, GitHub Pages).

```
openexa-site/
├── index.html          Home — WebGL overture (5 beats), lifecycles, the stack, Lifecycle 01, proof, economics, governance, evolution, team
├── platform.html       The agentic stack: eight layers, one boundary, the swarm, execution pipeline, customer MCP servers, operating modes, marketplace
├── lifecycles.html     The lifecycle test (six traits), six lifecycle classes, Lifecycle 01 in depth, why now, GTM, next lifecycles
├── evidence.html       Proof — 10-session ledger, broker verification, cost/risk stack, interactive economics model, TAM
├── trust.html          Trust & governance — the Council gate, permissions, ledger, control plane, does/does-not, risk factors
├── investors.html      The deck in the open — thesis, traction, market, model, evolution, believe/not, the $10M ask
├── company.html        Mission, story, team, credentials wall, contact
├── insights.html       Curated research index linking to the existing blog archive
├── access.html         Request-access form (investor / manager / bring a lifecycle / partner)
└── assets/
    ├── css/site.css    The "Ledger" design system + the advanced layer (story stage, loader, cursor, transitions)
    ├── js/story.js     WebGL story engine — one 12k-point swarm morphing through five formations
    ├── js/site.js      Nav, loader, split text, cursor, magnetic buttons, reveals, counters, ledger stream, calculator, form, 2D fallback swarm
    └── img/            globe.svg (brand mark, currentColor), favicon.svg, team/*.png
```

## The motive

**Old site:** "AgenticOS · AI-Native Yield Infrastructure · Agentic Harness for Finance · Join Beta" —
three taglines, dark navy/purple template, crypto-startup register. Read as a yield product.

**New site:** one identity — **Infrastructure for agentic lifecycles** — told in the deck's own
order (deck p.2 → p.7 → p.8 → p.4 → p.15):

1. **The work.** The highest-value work in the economy is a *lifecycle*, not a task: multi-party
   orchestration, regulatory oversight, structured data exchange, exception management,
   settlement or approvals, audit-trail requirements. Six industries have them: financial
   markets & insurance, international trade / letters of credit, asset securitization (MBS/ABS),
   wholesale energy settlement, semiconductor manufacturing, pharmaceutical & aerospace.
2. **The stack.** Eight layers, read from perception to permission: Signal Intelligence →
   Model Layer (post-trained LLM) → Domain-Specific Agents → Execution Council → Routing Layer →
   Execution Layer → MCP Server → Authentication Layer.
3. **The swarm.** 5,000 – 50,000 narrow agents per lifecycle, streaming through Signal → Predict →
   Decide → Approve/Reject → Execute → Settle; every transition hash-chained into a ledger.
4. **Lifecycle 01.** ETF creation & redemption — $22T in 17,000 ETFs — live on NASDAQ & NYSE:
   >10 bps in ten consecutive sessions, broker-verified, three beta customers, $5M committed,
   90% of cost and risk eliminated.
5. **Evolution.** Single agent → master–copy multi-agent → a marketplace where third parties
   deploy agents on OpenEXA rails; then the next five lifecycle classes.

Every number on the site comes from the deck. Yield language is framed as *targets* and
*proof-of-concept results*; lifecycle classes beyond LC-01 are labelled roadmap intent; Reg D
506(c) disclosures sit in every footer.

## The "Ledger" design system

Paper and ink, taken from the deck's palette (`#F5F2EC` paper, `#4D4D4D` charcoal,
`#ACA68E` khaki) and sharpened for the screen.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F5F2EC` | Page background |
| `--ink` | `#0E1512` | Type, dark "cover" sections |
| `--khaki` | `#ACA68E` | Secondary accents |
| `--signal` / `--signal-bright` | `#1E7A5A` / `#4FCB93` | The single accent — live, settled, verified |
| `--reject` | `#B4443C` | Rejected proposals only |
| `--brand-blue` | `#4A5FC1` | The globe mark only |

- **Type:** Instrument Serif (display), Inter (text), IBM Plex Mono (numerals, labels, tickers).
- **Structure:** numbered sections (`01 — The work`), hairline rules, figure captions, ledger
  tables with tabular numerals — the site reads like a prospectus for an infrastructure company.
- **Brand mark:** the deck's dotted globe rebuilt as a resolution-independent SVG
  (`assets/img/globe.svg`) that inherits `currentColor`.

## The advanced layer

- **Story engine (`story.js`).** A single raw-WebGL particle system — 12,000 points on desktop,
  5,500 on narrow screens — morphs between five formations as the homepage overture scrolls:
  `0` the globe with agent orbits · `1` the lifecycle constellation (six classes wired to one
  core, LC-01 lit) · `2` the agentic stack (eight plates seen from above, signals rising on
  three buses) · `3` the vertical execution rail (the swarm streaming through six gates, a red
  reject spur, a green ledger) · `4` proof (ten sessions above the 10 bps floor). Every point is
  "an agent" — the count deliberately sits inside the deck's 5,000 – 50,000 swarm range.
  Morphs are GPU-side, staggered and eased with an arc lift; labels are DOM nodes projected from
  3D each frame with per-label anchors; each formation has its own offset, mobile scale and
  camera elevation. Pauses off-screen; falls back to static beats (`.no-webgl`) without WebGL.
- **Preloader** counts to 100 while fonts load (hard cap 3.2 s), then hands off to the stage.
- **Kinetic type** (`data-split`), **nav progress bar**, **custom cursor** with `data-cursor`
  labels (fine pointers only), **magnetic buttons**, **MPA view transitions** (Chromium).
- **Live ledger stream** — an illustrative, hash-chained agent log (PROPOSED → VALIDATED →
  APPROVED → SUBMITTED → PARTIAL → FILLED → RECONCILED, with Council rejects) on the homepage.
- All motion respects `prefers-reduced-motion`.

## Wiring the form

`access.html` posts nowhere by default: on submit it shows a confirmation and offers a
pre-filled `mailto:` to ajit@openexa.com. To send submissions to a backend, add
`data-endpoint="https://…"` to the `<form data-access>`; the JSON body will contain
`interest, name, email, organization, role, assets, message, accredited`.

## Local preview

```
cd openexa-site
python -m http.server 8123
# open http://127.0.0.1:8123/
```

## Assets and rights

Team photographs and the globe mark were extracted from OpenEXA's own deck. Company and
university names on the company page are set as plain text, not logos. Third-party marks
(TradeStation, Interactive Brokers, NASDAQ, NYSE, DTCC) are referenced in text only and
disclaimed in the footer.

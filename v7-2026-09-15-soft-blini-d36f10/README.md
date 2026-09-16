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
├── evidence.html       Proof: reported proof-of-concept results, evidence scope and limitations
├── trust.html          Governance: the Council gate, the control plane, the ledger, plain-language does/does-not, risks
├── company.html        Company: AI-infrastructure mission, interactive agent sculpture, three engineering principles, contact invitation
├── insights.html       Three product reading paths, earlier research on demand and links to working models
├── access.html         Short introduction form: lifecycle / platform / partnership / investor conversation
├── 404.html            "A small detour." — an original broken-orbit illustration and useful recovery links (noindex)
├── site.webmanifest · robots.txt · sitemap.xml
├── _redirects         Netlify /company clean URL; redirects the trailing slash before resolving relative assets
└── assets/
    ├── css/site.css    Design system + story stage, HUD frame, chapters, manifesto, traits, system ladder, the desk, loader, transitions
    ├── css/company.css Company-only editorial layout, static SVG artwork and responsive styles
    ├── css/interior.css Shared object-led interior layouts, technical figures, disclosures, reading cards and accessible form styles
    ├── js/story.js     WebGL story engine — one point cloud morphing through five formations over six beats, two-pass glow
    ├── js/swarm.js     The swarm, live — thousands of agents through six gates, a council you can tighten, a halt switch (index.html)
    ├── js/chain.js     The chain — eight SHA-256-chained records you can edit and watch break (index.html)
    ├── js/company.js   Procedural WebGL study: specialize / coordinate / act, with interactive SVG fallback
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

1. **The thesis.** A short manifesto: a swarm needs shared context, clear responsibilities and
   infrastructure that carries work between steps.
2. **The lifecycle test.** Six traits — multi-party, regulated, structured, exception-heavy,
   gated, audit-bound — and the six industries that pass.
3. **The swarm.** Six gates between a signal and a record.
4. **The system.** The eight-layer ladder with the boundary drawn through it: agents decide
   above, code executes below.
5. **In production.** Lifecycle 01: OpenEXA reports ten proof-of-concept sessions above its set
   floor. The summary is explicitly limited in scope; the Proof page carries the context.
6. **On the record.** Council, permissions, an append-only ledger, one halt switch; three
   operating modes.

Copy rules: short sentences, numbers carry the headlines, no jargon chains, no market marketing
on the homepage (no exchange names, no basis points, no yield). Performance is framed as
OpenEXA-reported proof-of-concept results. Reg D 506(c) disclosures sit in every footer,
inside a keyboard-operable disclosure when JavaScript is available and fully visible otherwise.

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
  for the infrastructure itself: editorial headings, dimensional system drawings and concise
  explanations, with technical detail available on demand.
- **Brand mark:** the dotted globe as a resolution-independent SVG (`assets/img/globe.svg`)
  that inherits `currentColor`.

Every interior page has an original geometric system illustration rather than a stock photo or
a repeated dashboard. Platform, Lifecycles, Proof, Trust, Insights, Access and 404 share
`interior.css`; the Company page has its own interactive trefoil. There is no color-theme switch
between sections. Content does not depend on reveal animations to become readable.

## The company page

`company.html` replaces the old biography-heavy company page with a short AI-infrastructure
story. The headline is "Intelligence, put to work." The page keeps the user's infrastructure
statement, explains the company's conviction and links three engineering principles to the
existing Platform and Trust pages. It does not restore team profiles, personal contact details,
fundraising figures, institutional logos or finance marketing.

The hero is a custom procedural sculpture: the same particles form individual specialists, a
continuous woven trefoil, or an ordered execution structure. Its three buttons change both the
formation and the plain-language explanation. This is explicitly an illustrative study, not live
agent activity. There are no new runtime dependencies.

The normal cursor is unchanged. Motion can be paused, honors reduced-motion preferences, and
stops outside the viewport or in a hidden tab. SVG versions of all three formations remain usable
without WebGL; without JavaScript the initial illustration and all page content remain visible.
Company links appear in desktop navigation, mobile menus and every footer. The approved homepage
headline and the original six-beat story are retained as the rest of the site is refined.
On a plain static preview server, open `company.html`;
Netlify additionally serves `/company` using `_redirects`.

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
stats sit in the text column, so nothing overlaps the globe at any width. A still frame is painted
at initialization and resize even if the tab starts in the background; continuous animation
still stops while hidden. The six desktop
chapter marks are real navigation buttons. A pause control stops ambient motion; reduced-motion
preferences update at runtime, and hidden/off-screen stages stop requesting frames. Inactive
beats are inert, so keyboard focus cannot land on invisible links. The stage falls back to
static beats (`.no-webgl`) without WebGL, and remains readable without JavaScript.

## The desk

`gap.js` runs an illustrative model of one session of Lifecycle 01, on `lifecycles.html`. The gap
(price minus NAV, in basis points) wanders as a mean-reverting process with occasional flow shocks.
Whenever it runs past the threshold an agent acts — create above NAV, redeem below — pulling the
gap back toward zero and writing a line to the log. Two sliders: the threshold (2–20 bps) and the
number of agents on the fund (500–50,000, which sets how quickly gaps get worked). Hover the chart
to scrub. A session takes about 45 seconds, then a new one starts. It is labelled "not market
data" on the panel and draws nothing from any feed. The model can be paused, suspends rendering
off-screen or in a hidden tab, and honors reduced-motion changes at runtime. In reduced-motion
mode the sliders recompute a finished static session.

## The swarm, live

`swarm.js` (homepage, chapter 03) is a particle model of the six gates. Every dot is an agent
carrying one proposal, flowing left to right through Signal → Predict → Decide → Approve →
Execute → Record. At gate 04 the council rejects a share of proposals against a strictness you
set (0–60%); rejected agents fall out of the lane in red. Recorded agents arc into a ledger
column on the right that fills one line per record. Two sliders (agents 500–6,000, council
strictness) and a real **Halt** button: no new proposals enter, open work drains, the lane dims.
Counters for in flight, recorded, rejected and records per second. Illustrative; nothing is
real work. Reduced-motion mode renders a static scenario; changing its sliders recomputes that
scenario without playing an animation. The halt control also works in this mode.

## The chain, for real

`chain.js` (homepage, chapter 06) is eight records from one proposal, each hashed with SHA-256
(WebCrypto) over its contents plus the previous record's full 256-bit hash. Only eight hex
characters are displayed, but the full hashes are used for verification. Every event and detail is
`contenteditable`: change anything and the chain re-verifies — the edited record and every record
after it turn red, with the stored hash struck through and the new, non-matching hash beside it.
"Restore the original records" heals it. The events are domain-neutral illustrations, not
financial transactions or production records. The implementation snapshots edits and verifies
again when input changes during an asynchronous digest; it does not silently drop later edits.
WebCrypto failures are surfaced rather than shown as an intact chain.

## Small things that are real

- **Clocks.** The footer carries live Seattle and New York clocks, computed client-side with
  `Intl`.
- **Chapters.** Every chapter has a giant faint numeral and an entry in a fixed rail on the
  right (numbers only; labels on hover) that lights as you scroll. Built from
  `section[data-chapter]`; hidden under 1240px.
- **Manifesto.** `[data-manifesto]` splits into words and lights them as the block travels
  through the viewport; `<em>` words light in signal green.
- **Nav** tucks away on the way down and returns on the way up. Mobile navigation supports
  Escape, focus return and contained keyboard navigation. Current-page indicators work with
  both `.html` and clean URLs. Deep links into expandable technical sections open the matching
  disclosure before scrolling to it.
- **Cursor** is the native one. Buttons lift a pixel on hover and settle on press; nothing
  follows the mouse.
- **Share cards.** Every page has canonical, Open Graph and Twitter tags pointing at
  `assets/img/og.png`, with a dedicated `company-og.png` for Company; the home page carries
  Organization JSON-LD. Web manifest and touch icons
  are in place. `sitemap.xml` and `robots.txt` reference `https://www.openexa.com/`.
- **404** gives a real recovery path. It does not falsely claim a missing-page request was
  recorded in an agent ledger. Its assets and destination links are root-relative so a nested
  missing URL still renders the branded page and leads back into the site.

The homepage no longer blocks visitors with a counting preloader. Kinetic type (`data-split`),
a nav progress bar and MPA view transitions in Chromium remain. The illustrative event stream
is available on demand, with domain-neutral events rather than simulated market marketing.

## Wiring the form

`access.html` posts nowhere by default. It validates the name and email, prepares a
percent-encoded `mailto:` draft, and explicitly explains that nothing has been submitted.
The visitor opens their mail application and chooses whether to send. An edit action preserves
their input. The existing destination inbox is configured once as `data-contact` on the body;
use a verified role address if replacing it:

```html
<body data-contact="access@openexa.com">
```

To send submissions to a backend instead, add `data-endpoint="https://…"` to the
`<form data-access>`; the JSON body contains
`interest, name, email, organization, message`. The button and outcome copy switch to actual
submission mode. The form handles non-2xx responses, network errors, timeouts and duplicate
submits without discarding input or displaying a success message. Verify the real endpoint and
its delivery separately when configuring it; local tests only exercise the integration contract.

Linked entry points (`#lifecycles`, `#managers`, `#partners`, `#investors`) select the corresponding
interest. Native validation and keyboard-focusable radio choices work on mobile and desktop.

## Local preview

```
cd openexa-site
python -m http.server 8123
# open http://127.0.0.1:8123/
```

There is no build step. Deploy the contents of `openexa-site` as the site's publish directory,
including `_redirects`. A local edit or preview does not update an existing Netlify deployment.
This directory is the source of truth; no legacy generation script needs to run before deploying.

## Rights

The globe mark is OpenEXA's own. The system illustrations are original SVG/procedural geometry.
Third-party names in the supporting evidence and research are referenced in context, not
presented as endorsements. No team photos or stock artwork are needed for the redesign.

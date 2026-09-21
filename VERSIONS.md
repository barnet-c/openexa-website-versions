# OpenEXA website - version archive

Every version of the OpenEXA site that was deployed to Netlify (Netlify Drop, team *ya-yuvinagrawal*), numbered
from the first deploy to the current one. Each `vN-...` folder is a complete, self-contained copy of that version:
open its `index.html` directly or serve the folder with any static server.

- **Current version: v10** (`v10-2026-09-21-research-company`) - v9 plus the Research section, the Company page
  and the figure engine. Built and verified 2026-09-21; **not yet deployed** - drop this folder (or
  `OpenEXA-v10-research-company.zip`) on Netlify and record the site name in `_manifests/v10.json`.
- **Latest deployed: v9** (`v9-2026-09-21-ceo-cut`) - built from the CEO's preferred v1 and live at
  <https://willowy-squirrel-0c1ad5.netlify.app/>; that folder is the exact uploaded source and was verified
  identical to the live site. v8 (`heartfelt-valkyrie`) remains online as the previous version.
- `_previews/` - homepage screenshot of every version (1440 x 900).
- `_manifests/` - per-version file lists with SHA-256 checksums, restored-link counts and any server 404s.
- `versions.json` - the same index in machine-readable form.

| # | Published | Netlify site | Headline | Pages | Files | What it is |
|---|---|---|---|---|---|---|
| **v1** | 2026-09-03 | [timely-quokka-fa2399](https://timely-quokka-fa2399.netlify.app) | Infrastructure for agentic lifecycles. | 10 | 22 | **First Netlify relaunch, finance-era copy.** 10 pages including the old Company page (team bios, office address, phone, personal email) and an Investors page. Hero mentions NASDAQ/NYSE and "Lifecycle 01 is live". Contact details are reproduced as they were deployed. |
| **v2** | 2026-09-10 | [relaxed-chebakia-962045](https://relaxed-chebakia-962045.netlify.app) | Thousands of agents. One lifecycle. | 8 | 14 | **Company and Investors pages removed.** Down to 8 pages. Team photos and personal details gone. Headline "Thousands of agents. One lifecycle." Still finance-first wording (ETF creation/redemption, NASDAQ/NYSE). |
| **v3** | 2026-09-10 | [zingy-valkyrie-475e73](https://zingy-valkyrie-475e73.netlify.app) | Thousands of agents. One lifecycle. | 8 | 22 | **The desk simulator, launch metadata.** Adds gap.js (the illustrative desk), sitemap.xml, robots.txt, web manifest, icons, og.png share card and the 404 page. |
| **v4** | 2026-09-11 | [rococo-pavlova-ea1cd2](https://rococo-pavlova-ea1cd2.netlify.app) | Agents that run the whole lifecycle. | 8 | 22 | **AI-company repositioning.** Headline "Agents that run the whole lifecycle." "An AI company" kicker, manifesto chapter, six-beat WebGL story. Exchange names removed from the homepage. |
| **v5** | 2026-09-14 | [cheery-nasturtium-0799d0](https://cheery-nasturtium-0799d0.netlify.app) | Infrastructure for agentic lifecycles. | 8 | 24 | **Headline saved as shown; live objects.** Headline "Infrastructure for agentic lifecycles." Adds the live swarm (swarm.js) and the editable SHA-256 chain (chain.js) to the homepage. |
| **v6** | 2026-09-15 | [celebrated-frangollo-b9d062](https://celebrated-frangollo-b9d062.netlify.app) | Infrastructure for agentic lifecycles. | 9 | 13 | **BROKEN DROP - HTML only.** Full-site redesign HTML (9 pages including the new Company page) but the assets/ folder was never uploaded: no CSS, JS or images, so the site renders unstyled (the white/blue Netlify thumbnail). Kept for the record; do not redeploy this one. |
| **v7** | 2026-09-15 | [soft-blini-d36f10](https://soft-blini-d36f10.netlify.app) | Infrastructure for agentic lifecycles. | 9 | 29 | **Full-site redesign, complete.** Same HTML as v6 with all assets: interior.css, company.css/js, company-og.png, restyled Platform, Lifecycles, Proof, Trust, Company, Insights, Access and 404. Its _redirects rule made /company loop back to itself (301), so only /company.html worked. |
| **v8** | 2026-09-15 (redeployed 2026-09-16) | [heartfelt-valkyrie-f9cbf6](https://heartfelt-valkyrie-f9cbf6.netlify.app) | Infrastructure for agentic lifecycles. | 9 | 30 | **Routing fix.** No redirect rules (Netlify's built-in clean URLs serve /company), root-relative asset paths on the Company page, README updated. Deployed to heartfelt-valkyrie; verified byte-identical to the live site. This folder is the exact uploaded source. |
| **v9** | 2026-09-21 | [willowy-squirrel-0c1ad5](https://willowy-squirrel-0c1ad5.netlify.app) | Infrastructure for agentic lifecycles. | 8 | 25 | **The CEO's cut.** Built from v1, the CEO's preferred version: same dark overture into paper chapters, eight layers, ten-session proof, economics and roadmap. Company and Investors pages removed along with team bios, photos, phone, address and personal email. Every NASDAQ/NYSE mention and broker/clearing-house name removed; hero sub-line trimmed to the infrastructure sentence; ARR/AUM pitch figures and the BTC-yield/GTM sections dropped. Adds the live swarm, the SHA-256 chain and the desk; story engine gets glow, inertia, pause, keyboard chapters; hero figures moved under the copy; native cursor; accessible menu, safer form, launch metadata. Deployed 2026-09-21 as willowy-squirrel; verified identical to this folder. |
| **v10** | 2026-09-21 | not yet deployed | Infrastructure for agentic lifecycles. | 20 | 38 | **CURRENT - research + company.** v9 plus a Research section (research.html and ten articles: the two research notes first, then the eight-part series), an award-quality Company page (point-cloud sculpture with Specialize / Coordinate / Act modes, mission manifesto, story timeline, four constants), chapter 08 Research on the homepage, and figure.js - a WebGL point-cloud engine with twelve named formations that morph on hover and click. insights.html redirects to research.html; nav and footers link Research and Company; sitemap has 18 URLs. Built 2026-09-21, verified (11 pages, 712 links); not yet deployed - drop OpenEXA-v10-research-company.zip on Netlify and record the site name. |

## How the copies were made

v1-v7 were downloaded from their live Netlify URLs on 2026-09-16 (every page, stylesheet, script, image, manifest,
sitemap and robots file that the deploy serves). Netlify rewrites internal links when it serves a page
(`href="platform.html"` becomes `href='/platform'`); those links were restored to their `.html` form so the folders
work offline and on any host. Netlify never serves `_redirects`, so only v8 (the uploaded source) contains one.
v8 was taken from the local source folder and verified against the live deploy: all 20 non-HTML files are
byte-identical and all 9 pages are identical apart from Netlify's link re-serialization.

v9 and v10 were built locally; v9 was verified identical to its live deploy after upload.

Each archived version was then opened in a browser from this folder: v1-v5 and v7-v10 load with zero console
errors and no missing files. v6 fails exactly as the live deploy does, because its assets were never uploaded.

## Notes

- v1 contains the old Company page with team biographies and contact details (office address, phone, a personal
  email). These were on the public site at the time and are reproduced here as deployed. This archive is public.
- The Netlify dashboard lists these as separate sites because each was a fresh Netlify Drop. Deploy dates come
  from that dashboard; the order within a day was confirmed from the content (v3 adds files to v2; v6, v7 and v8
  share the same homepage, differing only in assets and routing).

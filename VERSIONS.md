# OpenEXA website - version archive

Every version of the OpenEXA site that was deployed to Netlify (Netlify Drop, team *ya-yuvinagrawal*), numbered
from the first deploy to the current one. Each `vN-...` folder is a complete, self-contained copy of that version:
open its `index.html` directly or serve the folder with any static server.

- **Current version: v14** (`v14-2026-09-24-company-edits`) - live at <https://timely-quokka-fa2399.netlify.app/> (the
  CEO's original URL): v12 plus the v13 page edits (Lifecycles market strip, Proof 04-05 and Trust 05 removed) and the
  Company edits (white hero accent, 100+ research papers). This folder is the exact published source and was verified
  identical to the live site. Deploys go through the Netlify CLI: a draft first, then that same deploy is promoted.
- **timely-quokka no longer serves v1.** It served v1 from 2026-09-03, v10 briefly on 2026-09-21, v11 on
  2026-09-23, v12 on 2026-09-24 and v14 since later that day. `v1-2026-09-03-timely-quokka-fa2399/` here is now the only copy of the original.
- v10 (`silly-gelato`), v9 (`willowy-squirrel`) and v8 (`heartfelt-valkyrie`) remain online at their own URLs.
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
| **v10** | 2026-09-21 | [silly-gelato-17a75a](https://silly-gelato-17a75a.netlify.app) | Infrastructure for agentic lifecycles. | 20 | 38 | **Research + company.** v9 plus a Research section (research.html and ten articles: the two research notes first, then the eight-part series), an award-quality Company page (point-cloud sculpture with Specialize / Coordinate / Act modes, mission manifesto, story timeline, four constants), chapter 08 Research on the homepage, and figure.js - a WebGL point-cloud engine with twelve named formations that morph on hover and click. insights.html redirects to research.html; nav and footers link Research and Company; sitemap has 18 URLs. Built and verified 2026-09-21 (11 pages, 712 links); deployed the same day as silly-gelato; the live deploy was verified identical to this folder and smoke-tested in a browser. |
| **v11** | 2026-09-23 | [timely-quokka-fa2399](https://timely-quokka-fa2399.netlify.app) | Infrastructure for agentic lifecycles. | 20 | 44 | **The team, at full resolution.** v10 plus the team on the Company page (and nowhere else): the six people from the original site with roles, biographies and professional links; portraits framed and resampled to 560 px WebP masters, monochrome over a faint point grid, colour on hover. No address, phone or personal email. Every canvas now renders at full device resolution (up to 3x within a UHD pixel budget): story 20k points, figures 15k, finer lat/long grid on the brand mark, resolution-aware anti-aliased sprites, gaussian halo, highp fragments, hardware point-size clamp; 2D objects raised from 2x to 3x. Built and verified 2026-09-23 (11 pages, 718 links; team names on company.html and nowhere else); deployed 2026-09-23 to timely-quokka (the CEO's original URL, replacing v1 there); the live deploy was verified identical to this folder and smoke-tested in a browser. |
| **v12** | 2026-09-24 | [timely-quokka-fa2399](https://timely-quokka-fa2399.netlify.app) | Infrastructure for agentic lifecycles. | 20 | 44 | **Homepage edits.** v11 with three homepage edits: the Lifecycle 01 headline says Trillions instead of $22 trillion (the Lifecycles page too); the fourth proof stat is 5 runs / lifecycle executions instead of $5M committed assets; chapter 07 Agentic platform evolution (the three-phase roadmap) is removed, so Research becomes chapter 07. Deployed 2026-09-24 via the Netlify CLI as a draft on timely-quokka, verified, then published to production by promoting that same deploy; the production URL was verified identical to this folder and smoke-tested. |
| **v13** | 2026-09-24 | [timely-quokka-fa2399 (draft 6ab594520619c4288018bcf5)](https://6ab594520619c4288018bcf5--timely-quokka-fa2399.netlify.app) | Infrastructure for agentic lifecycles. | 20 | 44 | **Page edits (draft, superseded by v14).** v12 with page edits: Lifecycles drops the four-figure market strip ($22T in ETFs, 17k ETFs, the 4-8% band, $0.0002 per dollar per day); Proof drops 04 Platform economics (ARR slider and table) and 05 Addressable market (TAM); Trust drops 05 Risk factors. Research unchanged. Deployed 2026-09-24 via the Netlify CLI as a draft on timely-quokka and verified identical to this folder; production still serves v12 until the draft is published. |
| **v14** | 2026-09-24 | [timely-quokka-fa2399](https://timely-quokka-fa2399.netlify.app) | Infrastructure for agentic lifecycles. | 20 | 44 | **CURRENT - company edits.** v13 plus two Company-page edits: the hero's put to work. is white instead of green (hero only), and the team section's third stat is 100+ research papers instead of 90% of Microsoft's revenue. Includes the v13 page edits. Deployed 2026-09-24 via the Netlify CLI as a draft on timely-quokka, verified, then published by promoting that same deploy; production verified identical to this folder and smoke-tested. |

## How the copies were made

v1-v7 were downloaded from their live Netlify URLs on 2026-09-16 (every page, stylesheet, script, image, manifest,
sitemap and robots file that the deploy serves). Netlify rewrites internal links when it serves a page
(`href="platform.html"` becomes `href='/platform'`); those links were restored to their `.html` form so the folders
work offline and on any host. Netlify never serves `_redirects`, so only v8 (the uploaded source) contains one.
v8 was taken from the local source folder and verified against the live deploy: all 20 non-HTML files are
byte-identical and all 9 pages are identical apart from Netlify's link re-serialization.

v9 and v10 were built locally and each was verified identical to its live deploy after upload (assets byte-for-byte,
pages apart from Netlify's link rewriting); v11, v12 and v14 likewise, on timely-quokka.

Each archived version was then opened in a browser from this folder: v1-v5 and v7-v14 load with zero console
errors and no missing files. v6 fails exactly as the live deploy does, because its assets were never uploaded.

## Notes

- v1 contains the old Company page with team biographies and contact details (office address, phone, a personal
  email). These were on the public site at the time and are reproduced here as deployed. From v11 the team
  (biographies, portraits, professional links - no contact details) is back on the Company page. This archive is public.
- The Netlify dashboard lists these as separate sites because each was a fresh Netlify Drop. Deploy dates come
  from that dashboard; the order within a day was confirmed from the content (v3 adds files to v2; v6, v7 and v8
  share the same homepage, differing only in assets and routing).

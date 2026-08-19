# 57e Regiment Portal — Architecture

This doc explains how the site is built, where data lives, how it flows from
source to screen, and background on the regiment itself.

---

## 1. What this project is

A Next.js (App Router) website that presents the **57e Régiment d'Infanterie
de Ligne** — a unit in a Roblox Napoleonic Wars community, as a formal
"regimental portal": order of battle, officer roster, player lookup, and a
regimental history/info page transcribed from the unit's Fandom wiki.

Stack: Next.js + TypeScript + Tailwind, `lucide-react` icons, `shadcn/ui`
primitives in `components/ui/`.

**Current data strategy: static JSON snapshots, not live fetching.**
All Google Sheets data is downloaded once via a script and committed as
`.json` files in `data/`. The site imports those files directly at build
time — there is no `fetch()`, no API route, no runtime dependency on Google
Sheets being reachable. This is a deliberate choice for demo stability (see
§4). It means **the site can go stale**, someone has to re-run the sync
script and rebuild/redeploy whenever the sheets change.

---

## 2. Directory map

```
scripts/
  build_data.py       # THE pipeline: Sheets (CSV) -> data/*.json
  sync-sheets.mjs      # older/alternate Node CSV downloader (curl-based)

data/                  # generated JSON snapshots (see §3 for what's parsed vs raw)
  roster.json, grens.json, volts.json, depot.json, fusiliers.json,
  orbat.json, player_stats.json, activity.json (combined),
  recruitment.json, kill_log.json, grading_curve.json,
  colour_guard.json, daily_input.json, rally_summary.json

lib/
  csv-parser.ts        # SpreadsheetRow type + generic CSV parse helpers (client-side, legacy)
  roster-data.ts        # shapes grens/volts/depot/fusiliers JSON into BattalionRoster[]
  orbat-data.ts          # shapes orbat.json into regimental/battalion staff lists
  regiment-data.ts        # hand-maintained regiment facts, battle honours, wiki article stubs
  regimental-info.ts        # verbatim transcription of the Fandom wiki page
  utils.ts                    # `cn()` classnames helper

components/
  app-shell.tsx        # sidebar nav + page frame, uses regimentMeta + 57e_logo.png
  page-header.tsx       # shared page title/eyebrow/description block
  company-roster.tsx     # ACTIVE: roster page UI, tabs by battalion -> company tables
  org-chart.tsx            # ACTIVE: order-of-battle page UI, sourced from roster-data + orbat-data
  ranker-tracker.tsx        # player activity/attendance detail panel (used in Player Lookup)
  insignia.tsx                # decorative SVG icons (Bicorne, rank insignia, laurel, star)
  roster-table.tsx      # LEGACY/UNUSED: old roster UI built on hand-authored regiment-data.ts
  command-tree.tsx        # LEGACY/UNUSED: old org chart UI built on orbat-data.ts only (no roster-data companies)

app/
  page.tsx                          # Overview — hero, stats, history, battle honours
  roster/page.tsx                    # -> CompanyRosterView (company-roster.tsx)
  order-of-battle/page.tsx             # -> OrgChart (org-chart.tsx)
  lookup/page.tsx                        # Player Lookup, searches roster.json + activity via roster-data
  regimental-information/page.tsx          # Full wiki transcription, sourced from lib/regimental-info.ts
  archive/page.tsx + archive/[slug]/           # OLD "Archive" pages, built on regiment-data.ts wikiArticles;
                                                   # not linked in nav anymore (superseded by regimental-information)
```

**Note on dead code:** `components/roster-table.tsx` and
`components/command-tree.tsx` are earlier versions of the roster/org-chart
UI, built directly on the hand-written `lib/regiment-data.ts` instead of the
real sheet-derived data. No page currently imports them. `app/archive/`
is similarly orphaned — it's not in `components/app-shell.tsx`'s `NAV` array
anymore, having been replaced by `/regimental-information`. Safe to delete
once confirmed unnecessary, but left in place for now.

---

## 3. The data pipeline (Sheets -> JSON -> UI)

### Source spreadsheet
One Google Sheet, ID `1jDCXIWrkTjDgxRX-2zddojWoUnD3TKYTFWdQz2DD6zc`, with many
tabs. Each tab has a `gid` (visible in the sheet URL as `#gid=...`).

### Step 1 — Download: `scripts/build_data.py`
Run manually: `python scripts/build_data.py`.

- `SHEETS` (parsed into structured JSON) and `RAW_ONLY_SHEETS` (dumped as raw
  row arrays, not yet structured) are declared at the top of the file as
  `{name, gid, kind}` entries.
- `download_csv()` hits
  `https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={gid}`
  — no auth needed since the sheet is link-shared.

### Step 2 — Parse: one function per `kind`
The sheets are NOT simple flat tables — most repeat a block of columns
side-by-side once per company/battalion, with label rows above the header.
Each parser is written to that specific layout:

| kind | function | shape produced |
|---|---|---|
| `roster` | `parse_roster_csv` | flat list of officer rows (rank, company, position, name, discord, roblox link, points) |
| `activity` | `parse_activity_csv` | per-battalion list; finds every `"Points"` column as a company-block start, slices that block's own header, and reads `attendance` as a nested dict of date-column -> value. Run once per battalion (grens/volts/depot/fusiliers) |
| `orbat` | `parse_orbat_csv` | flat list of `{group, position, rank, name}` — `group` = the label sitting above a `Position/Rank/Name` column block (regimental staff, battalion staff blocks, etc.) |
| `player_stats` | `parse_player_stats_csv` | single dict `{username, entries:[{date,kills,deaths}]}` |
| `raw` | `parse_raw_csv` | just `list(csv.reader(...))` — no structure, used for sheets not yet wired into the UI (recruitment, kill_log, grading_curve, colour_guard, daily_input, rally_summary) |

`main()` writes each sheet to `data/{name}.json`, and additionally
concatenates all 4 battalion activity lists into `data/activity.json`.

### Step 3 — Structure for the frontend: `lib/*-data.ts`
Next.js imports `.json` files as plain JS objects (no `fetch`/`JSON.parse`
needed). The `lib/` files reshape the flat JSON into nested structures the
components actually render:

- **`lib/roster-data.ts`**: imports `grens/volts/depot/fusiliers.json`,
  groups each battalion's flat member list by `company` into
  `BattalionRoster[]` (`battalionRosters`), exposes `allActivityRows` (flat,
  for search) and `findActivityByName(name)` (used by Player Lookup to pull
  a player's attendance/KPE/points record).
- **`lib/orbat-data.ts`**: imports `orbat.json`, filters by known `group`
  labels to produce `regimentStaffFromSheet` (colonel, major, etc.) and
  `battalionCommandFromSheet` (per-battalion staff). Only groups with
  reliable unique labels are exposed — company-level ORBAT blocks are
  deliberately skipped because their group labels collapse/blank in the
  sheet.

### What's NOT wired into the UI yet
`recruitment.json`, `kill_log.json`, `grading_curve.json`,
`colour_guard.json`, `daily_input.json`, `rally_summary.json` are downloaded
as raw row arrays but have no `lib/*.ts` structuring layer or component
consuming them yet. They exist for future use.

---

## 4. Why static JSON instead of live fetch

Decided explicitly for demo/presentation stability: no network call can fail
or change mid-presentation, and restarting the dev server never re-fetches
anything — data is just always there. The tradeoff, accepted for now, is that
the site can drift out of date until someone re-runs
`python scripts/build_data.py` and redeploys. A live-fetch or scheduled-sync
version is the intended next step once this goes into regular
(non-demo) use — see `docs/plan.md` for that longer-term multi-sheet/player-
profile plan (BloxLink login, combined player profile object, etc.), which
predates the JSON-snapshot decision and is not fully implemented.

---

## 5. Regimental info content (`/regimental-information`, `/` overview)

`lib/regimental-info.ts` and the battle-honours/history arrays in
`lib/regiment-data.ts` are **verbatim transcriptions** of the unit's Fandom
wiki page:
`https://napoleonic-wars-rblx.fandom.com/wiki/57%C3%A8me_R%C3%A9giment_d%27Infanterie_de_Ligne`

This content is intentionally hand-maintained TypeScript, not sheet-derived —
it's treated as permanent/historical rather than a live roster field. If the
wiki page changes, these files must be manually updated to match. Key facts
currently encoded in `regimentMeta` (`lib/regiment-data.ts`): nickname/motto
"Les Terribles", formed 2020, garrison Antibes, part of 2e Division /
Deuxième Corps (formerly Troisième Corps), 3 battalions / 7 companies.
`battleHonours` covers real-world Napoleonic engagements (Austerlitz,
Peninsular War, Russian Campaign, German Campaign, La Suffel — explicitly
NOT Leipzig, per the wiki's own trivia note); `notableEngagements` covers
in-game Roblox NW battles (Smohain, Waterloo, Asian Grand Battle).

---

## 6. Branding

The regimental emblem is `public/57e_logo.png` (the real unit logo, supplied
by the user). It's used in `components/app-shell.tsx` (sidebar + mobile top
bar) and `app/page.tsx` (hero). Do not reintroduce the old placeholder eagle
asset if it resurfaces from a merge/revert.

---

## 7. Git / deployment notes

This repo is pushed to `https://github.com/TreeOperator/57e_website_portal.git`
using a **repo-local** git identity (not the machine's global config):
`user.name=TreeOperator`, `user.email=eeveesoupmaker@gmail.com`. Auth uses a
GitHub Personal Access Token (repo scope) — never commit the PAT itself.

---

## 8. Quick orientation for a new contributor/agent

1. To refresh data from the live sheet: run `python scripts/build_data.py`
   from the project root, then restart `pnpm dev`.
2. To change how a sheet is parsed: edit the matching function in
   `scripts/build_data.py`, re-run it, and check the resulting `data/*.json`.
3. To change how parsed data is grouped/labeled for the UI: edit
   `lib/roster-data.ts` or `lib/orbat-data.ts`, not the components.
4. To change wiki-sourced text: edit `lib/regimental-info.ts` /
   `lib/regiment-data.ts` directly — this is not sheet-driven.
5. Ignore `components/roster-table.tsx` and `components/command-tree.tsx`
   unless explicitly asked to revive them; they're superseded by
   `company-roster.tsx` and `org-chart.tsx`.
6. `docs/plan.md` describes an earlier/broader plan (multi-sheet player
   profiles, BloxLink login, admin bot) — treat it as future-facing notes,
   not a description of the current implementation.

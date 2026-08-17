# 57e Regimental Portal — Integration Plan

## Goal
Turn the website into a regimental portal where players can see all their information in one place. The portal reads from existing Google Sheets; it does not replace them.

## Core principles
- **Spreadsheets are the source of truth.** Admin staff keep working in Google Sheets.
- **Parse, do not meddle.** Each sheet is parsed individually, then the parsed data is organized into player profiles.
- **Fallbacks everywhere.** If a sheet fails to load, the site still shows the old hardcoded data or a clear error.
- **Build in layers.** Get all info visible first, then add login/personal progress later.

## Storage and sync

- **Google Sheets is the source of truth.** The site does not write back to the sheets.
- **The site stores local CSV snapshots** in `public/data/` (e.g., `roster.csv`).
- A **sync script** (`pnpm sync-sheets`) downloads the latest CSVs from the sheets before the site reads them.
- The **site reads the local CSVs** at build or on the server, so it is fast and does not depend on a live connection after the snapshot is taken.
- **When the sheet changes:** run `pnpm sync-sheets` again, then refresh the page.
- **Later:** the sync can be run by a bot or CI/CD so the site stays up to date automatically.
- **Long term:** if BloxLink requires login, we may add a database, but the spreadsheets stay as the canonical source.

## Data sources
Current known source:
- **Roster sheet** (`gid=1946443746`)
  - Active roster columns: `Rank`, `Company`, `Position`, `Name`, `Discord ID`, `Roblox Profile Link`, `Points`, `Missing?`
  - Returning ranker columns: `Username`, `Disc ID`
  - Far-right columns are admin notes / instructions

Future sources (need links/tab IDs):
- Medals
- Attendance
- Awards
- Any other player-related sheets

## Player key
- **Best:** Roblox user ID or profile link — never changes.
- **Fallback:** normalized Roblox username (lowercase, trimmed, spaces removed).
- **Avoid:** relying on Discord ID as the main key, because it may not be in every sheet.

## Multi-sheet flow
1. One parser per sheet (`parseRoster`, `parseMedals`, etc.).
2. Each parser normalizes the player identifier the same way.
3. A combiner merges everything into one `PlayerProfile` object:
   ```
   {
     id: string,
     name: string,
     robloxLink?: string,
     discordId?: string,
     roster?: { rank, company, position, points, missing },
     medals?: [...],
     attendance?: [...],
     ...
   }
   ```
4. Player Lookup / a new profile page displays the combined object.

## Pages
- **Officer Roster** (`/roster`): keeps the structured fallback roster and can also show raw spreadsheet rows.
- **Player Lookup** (`/lookup`): becomes the main portal view. Search a player and see their full combined profile.
- **Order of Battle** (`/order-of-battle`): keeps the battalion/company hierarchy; can later use parsed roster data.

## Future additions
- **BloxLink integration:** players log in with Discord/Roblox and view their own profile.
- **Admin bot:** writes to the sheets in the same format, keeping the existing workflow intact.

## Current status
- [x] Roster CSV downloaded into `public/data/roster.csv`
- [x] Roster parser built
- [x] Raw spreadsheet table added to `/roster`
- [x] Old structured roster kept as fallback
- [x] Structural recap shared
- [ ] Verify `/roster` renders correctly
- [ ] Map remaining sheets (medals, attendance, etc.)
- [ ] Choose stable player key and design combined profile
- [ ] Build parsers for each additional sheet
- [ ] Update Player Lookup to show combined data
- [ ] BloxLink integration
- [ ] Admin bot

## Next step
Wait for the user to provide the other sheet links or `gid` tab IDs and their headers. Once provided, map columns, pick the player key, and build the multi-sheet parser.

"""
One-time script to pull CSVs from Google Sheets and save as JSON files.
Run with: python scripts/build_data.py

The site imports these JSON files directly — no fetch, no network calls.
"""

import csv
import json
import os
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

SPREADSHEET_ID = "1HJXX_UW5XncWWQ3O6oo662d5-BXg9nVKz--ZA6Bhp1s"

# A second spreadsheet (medals/awards), separate from the main roster sheet above.
MEDALS_SPREADSHEET_ID = "1bwlwOFWKjZXIaXx5u53wPzUyUdWz0T10EJ7aPxWdmCk"

# A third spreadsheet (Nobility / Grand Battles / Venerations), Empire-wide —
# covers every regiment, so results are filtered down to our own roster below.
HONOURS_SPREADSHEET_ID = "1eagZsy-IcPyHwDddsWQRzqnZQPry4L_5ZpOEVBsx1XM"

# Sheets we actually parse into structured JSON. `gids` merges several tabs
# (one company per tab in the new sheet) into a single JSON output.
SHEETS = [
    {"name": "roster", "gids": ["1946443746"], "kind": "roster"},
    {"name": "grens", "gids": ["985019926"], "kind": "activity"},
    {"name": "volts", "gids": ["566353298", "1218211340"], "kind": "activity"},
    {"name": "depot", "gids": ["1515836200"], "kind": "activity"},
    {"name": "fusiliers", "gids": ["2105528580", "1014078763", "1353414292"], "kind": "activity"},
    {"name": "mercs", "gids": ["1769582000"], "kind": "activity"},
    {"name": "flag_guard", "gids": ["998697877"], "kind": "flag_guard"},
    {"name": "orbat", "gids": ["593271524"], "kind": "orbat"},
    # player_stats has no counterpart tab in the new spreadsheet — kept as stale JSON.
    {"name": "recruitment", "gids": ["786117151"], "kind": "recruitment"},
    {"name": "medals", "gids": ["1868836415"], "kind": "medals", "spreadsheet_id": MEDALS_SPREADSHEET_ID, "endpoint": "gviz"},
    {"name": "legion_honneur", "gids": ["0"], "kind": "legion_honneur", "spreadsheet_id": HONOURS_SPREADSHEET_ID},
    {"name": "nobility", "gids": ["477285371"], "kind": "nobility", "spreadsheet_id": HONOURS_SPREADSHEET_ID},
    {"name": "grandbattles", "gids": ["423540682"], "kind": "grandbattle", "spreadsheet_id": HONOURS_SPREADSHEET_ID},
    {"name": "venerations", "gids": ["236760628"], "kind": "veneration", "spreadsheet_id": HONOURS_SPREADSHEET_ID},
    {"name": "kill_log", "gids": ["1095406146"], "kind": "kill_log"},
]

# Reference/working sheets, downloaded as raw CSV only (not parsed for the site).
RAW_ONLY_SHEETS = [
    {"name": "grading_curve", "gid": "567217808"},
    # daily_input has no counterpart tab in the new spreadsheet — kept as stale JSON.
    {"name": "rally_summary", "gid": "429239458"},
]


def download_csv(name: str, gid: str, spreadsheet_id: str = SPREADSHEET_ID, endpoint: str = "export") -> str:
    """
    Download a sheet tab as CSV and return the content.

    `endpoint="export"` (default) hits /export?format=csv, which matches the
    exact column headers the parsers below expect. Some spreadsheets 401 on
    that endpoint (Workspace-restricted export), but still work via the
    gviz/tq visualization endpoint — pass endpoint="gviz" for those. Note
    gviz output adds a leading blank column and trailing spaces on headers,
    so it isn't a drop-in replacement for the other parsers.
    """
    if endpoint == "gviz":
        url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tqx=out:csv&gid={gid}"
    else:
        url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
    print(f"Downloading {name} from {url}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        return response.read().decode("utf-8")


def parse_roster_csv(content: str) -> list[dict]:
    """Parse the roster CSV into a list of dicts."""
    lines = content.splitlines()
    reader = csv.reader(lines)

    header_found = False
    column_map = {}
    rows = []

    for fields in reader:
        if not header_found:
            if "Rank" in fields:
                # New roster: main block uses "Username"/"Discord ID"; the
                # RETURNING RANKERS block re-uses "Name"/"Discord ID", so the
                # returning discord column is the Discord ID *after* "Name".
                name_idx = fields.index("Name") if "Name" in fields else -1
                returning_disc_idx = -1
                if name_idx != -1:
                    returning_disc_idx = next(
                        (i for i in range(name_idx, len(fields)) if fields[i] in ("Disc ID", "Discord ID")), -1
                    )
                column_map = {
                    "rank": fields.index("Rank"),
                    "company": fields.index("Company") if "Company" in fields else -1,
                    "position": fields.index("Position") if "Position" in fields else -1,
                    "name": fields.index("Username") if "Username" in fields else name_idx,
                    "discordId": fields.index("Discord ID") if "Discord ID" in fields else -1,
                    "robloxLink": fields.index("Roblox Profile Link") if "Roblox Profile Link" in fields else -1,
                    "points": fields.index("Points") if "Points" in fields else -1,
                    "missing": fields.index("Missing?") if "Missing?" in fields else -1,
                    "returningUsername": name_idx,
                    "returningDiscId": returning_disc_idx,
                }
                header_found = True
            continue

        def get(key: str) -> str:
            idx = column_map.get(key, -1)
            if idx < 0 or idx >= len(fields):
                return ""
            return fields[idx].strip()

        name = get("name")
        returning_username = get("returningUsername")

        if not name and not returning_username:
            continue

        # Collect notes from columns after the mapped ones
        max_idx = max(v for v in column_map.values() if v >= 0)
        notes_parts = [f.strip() for f in fields[max_idx + 1:] if f.strip()]

        rows.append({
            "rank": get("rank"),
            "company": get("company"),
            "position": get("position"),
            "name": name,
            "discordId": get("discordId"),
            "robloxLink": get("robloxLink"),
            "points": get("points"),
            "missing": get("missing"),
            "returningUsername": returning_username,
            "returningDiscId": get("returningDiscId"),
            "notes": " ".join(notes_parts),
        })

    return rows


ACTIVITY_FIELDS = [
    "Points", "Position", "Rank", "Name", "Disc ID",
    "K", "KPE", "KDR", "Activity", "Activity %", "LOA", "Grade",
]


def _find_header_row(rows: list[list[str]], required: list[str]) -> int:
    """Find the first row containing every string in `required`."""
    for i, row in enumerate(rows):
        cells = [c.strip() for c in row]
        if all(r in cells for r in required):
            return i
    return -1


def parse_activity_csv(content: str, battalion: str) -> list[dict]:
    """
    Parse a company activity sheet (new spreadsheet format: one company per
    tab — GRENS/VOLTS/DEPOT/FUSILIERS/MERCS). The header row carries
    Position, Rank, Username, Discord ID, Points, Grade; the row directly
    below it carries the stat sub-headers (Kills, KPE, KDR, Act., Act. %,
    LOA) followed by the daily attendance date columns.
    """
    rows = list(csv.reader(content.splitlines()))
    header_idx = _find_header_row(rows, ["Position", "Rank", "Username"])
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    sub_header = [c.strip() for c in rows[header_idx + 1]] if header_idx + 1 < len(rows) else []

    col_map = {}
    for label in ("Position", "Rank", "Username", "Discord ID", "Points", "Grade"):
        if label in header:
            col_map[label] = header.index(label)

    stat_labels = {
        "Kills": "kills", "KPE": "kpe", "KDR": "kdr",
        "Act.": "activity", "Act. %": "activityPct", "LOA": "loa",
    }
    stat_map = {}
    date_cols = []
    for i, label in enumerate(sub_header):
        if label in stat_labels:
            stat_map[stat_labels[label]] = i
        elif "/" in label and label.replace("/", "").isdigit():
            date_cols.append((label, i))

    # Company name lives directly above the "Position" cell, a few rows up.
    pos_col = col_map.get("Position", 0)
    company_name = ""
    for r in range(header_idx - 1, -1, -1):
        if pos_col < len(rows[r]) and rows[r][pos_col].strip():
            company_name = rows[r][pos_col].strip()
            break

    results = []
    for r in range(header_idx + 2, len(rows)):
        row = rows[r]

        def get(label: str) -> str:
            idx = col_map.get(label)
            if idx is None or idx >= len(row):
                return ""
            return row[idx].strip()

        name = get("Username")
        rank = get("Rank")

        # Skip section-label rows ("OFFICIERS DE COMPAGNIE", "SOLDAT DU
        # RANG", member counts) and vacant slots — nothing useful there.
        if not name and not rank:
            continue

        def stat(key: str) -> str:
            idx = stat_map.get(key)
            return row[idx].strip() if idx is not None and idx < len(row) else ""

        attendance = {
            label: (row[idx].strip() if idx < len(row) else "")
            for label, idx in date_cols
        }

        results.append({
            "battalion": battalion,
            "company": company_name,
            "points": get("Points"),
            "position": get("Position"),
            "rank": rank,
            "name": name,
            "discordId": get("Discord ID"),
            "kills": stat("kills"),
            "kpe": stat("kpe"),
            "kdr": stat("kdr"),
            "activity": stat("activity"),
            "activityPct": stat("activityPct"),
            "loa": stat("loa"),
            "grade": get("Grade"),
            "attendance": attendance,
        })

    return results


def parse_orbat_csv(content: str) -> list[dict]:
    """
    Parse the ORBAT sheet: repeated blocks of (Position, blank, Rank, Name)
    columns, one block per battalion/department, under a group-name row.
    """
    rows = list(csv.reader(content.splitlines()))
    results = []

    header_indices = [i for i, row in enumerate(rows) if "Position" in [c.strip() for c in row] and "Rank" in [c.strip() for c in row]]

    for h, header_idx in enumerate(header_indices):
        next_header_idx = header_indices[h + 1] if h + 1 < len(header_indices) else len(rows)
        header = [c.strip() for c in rows[header_idx]]
        block_starts = [i for i, v in enumerate(header) if v == "Position"]

        for b, start_col in enumerate(block_starts):
            end_col = block_starts[b + 1] if b + 1 < len(block_starts) else len(header)
            sub_header = header[start_col:end_col]

            col_map = {}
            for offset, label in enumerate(sub_header):
                if label in ("Position", "Rank", "Name"):
                    col_map.setdefault(label, start_col + offset)

            # Group label sits one column left of the block's "Position"
            # column, on the row directly above the header (e.g. "Quartier
            # Général des 1er Fusiliers" at col 3, block starting col 4).
            # Scanning at start_col itself would hit the previous block's
            # data rows, so check start_col - 1 first.
            group_name = ""
            for r in range(header_idx - 1, -1, -1):
                for c in (start_col - 1, start_col):
                    if 0 <= c < len(rows[r]) and rows[r][c].strip():
                        group_name = rows[r][c].strip()
                        break
                if group_name:
                    break

            for r in range(header_idx + 1, next_header_idx):
                row = rows[r]
                if start_col >= len(row):
                    continue

                def get(label: str) -> str:
                    idx = col_map.get(label)
                    if idx is None or idx >= len(row):
                        return ""
                    return row[idx].strip()

                position = get("Position")
                name = get("Name")
                rank = get("Rank")

                # Rows with only a "position" label and no rank/name are
                # group-name headers for the next block, not real entries.
                if not name and not rank:
                    continue

                results.append({
                    "group": group_name,
                    "position": position,
                    "rank": rank,
                    "name": name,
                })

    return results


def parse_player_stats_csv(content: str) -> dict:
    """Parse the single-player K/D history sheet."""
    rows = list(csv.reader(content.splitlines()))

    username = ""
    for i, row in enumerate(rows):
        cells = [c.strip() for c in row]
        if "USERNAME" in cells:
            for r in rows[i + 1:]:
                if len(r) > 1 and r[1].strip():
                    username = r[1].strip()
                    break
            break

    header_idx = _find_header_row(rows, ["DATE", "KILLS", "DEATHS"])
    entries = []
    if header_idx != -1:
        header = [c.strip() for c in rows[header_idx]]
        idx_date = header.index("DATE")
        idx_kills = header.index("KILLS")
        idx_deaths = header.index("DEATHS")

        for row in rows[header_idx + 1:]:
            if idx_date >= len(row) or not row[idx_date].strip():
                continue
            entries.append({
                "date": row[idx_date].strip(),
                "kills": row[idx_kills].strip() if idx_kills < len(row) else "",
                "deaths": row[idx_deaths].strip() if idx_deaths < len(row) else "",
            })

    return {"username": username, "entries": entries}


def parse_raw_csv(content: str) -> list[list[str]]:
    """Fallback: dump the sheet as raw rows for later manual formatting."""
    return list(csv.reader(content.splitlines()))


def parse_flag_guard_csv(content: str) -> list[dict]:
    """
    Parse the Flag Guard (Garde du Drapeau) sheet: one continuous roster of
    members drawn from every company, each holding a Flag Guard role (e.g.
    "Porte Drapeau", "FD Staff") rather than a military rank. The sheet's
    "Rank" column (after Username) is actually this role/specialization —
    it's a mislabeled header, not a military rank. Each member's home
    company is recorded separately in the "Company" column. Military rank
    is left blank here and backfilled in main() from the combat rosters.
    """
    rows = list(csv.reader(content.splitlines()))

    header_idx = -1
    for i, row in enumerate(rows):
        cells = [c.strip() for c in row]
        if "Username" in cells and "Company" in cells:
            header_idx = i
            break
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    idx_username = header.index("Username")
    idx_discord = header.index("Discord ID", idx_username)
    idx_role = header.index("Rank", idx_username)
    idx_company = header.index("Company", idx_username)
    idx_guarding = header.index("Guarding", idx_username)
    idx_bearing = header.index("Bearing", idx_username)
    idx_fg_points = header.index("Total FG Points", idx_username)
    idx_fb_points = header.index("Total FB Points", idx_username)
    idx_loa = header.index("LOA", idx_username)
    idx_activity = header.index("Activity", idx_username)

    date_cols = [
        (header[i], i)
        for i in range(idx_activity + 1, len(header))
        if "/" in header[i] and header[i].replace("/", "").isdigit()
    ]

    results = []
    for row in rows[header_idx + 1:]:
        def get(i: int) -> str:
            return row[i].strip() if i < len(row) else ""

        name = get(idx_username)
        if not name:
            continue

        attendance = {label: get(i) for label, i in date_cols}

        results.append({
            "battalion": "flag_guard",
            "company": get(idx_company),
            "points": get(idx_fg_points),
            "position": get(idx_role),
            "rank": "",
            "name": name,
            "discordId": get(idx_discord),
            "kills": "",
            "kpe": "",
            "kdr": "",
            "activity": "",
            "activityPct": get(idx_activity),
            "loa": get(idx_loa),
            "grade": "",
            "attendance": attendance,
            "guarding": get(idx_guarding),
            "bearing": get(idx_bearing),
            "totalFbPoints": get(idx_fb_points),
        })

    return results


def parse_recruitment_csv(content: str) -> list[dict]:
    """
    Parse the Département de Recrutement sheet (same department-roster style
    as Drapeu). Two blocks sit on one header row:
      - Left (Etat Major): Position / Rank / Username — the department staff.
      - Right (Les Recruteurs): # / Medal / LOA / Username / Company /
        Discord ID / weekly recruit counts / Activity — every recruiter's
        home company is in the "Company" column.
    Military rank is left blank for recruiters and backfilled in main() from
    the combat rosters (like flag_guard).
    """
    rows = list(csv.reader(content.splitlines()))

    header_idx = _find_header_row(rows, ["Username", "Company", "Discord ID"])
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    idx_company = header.index("Company")
    # The recruiter block's Username sits immediately left of Company — the
    # staff block also has a "Username" column further left, so anchor on
    # Company rather than a bare Username search.
    idx_username = idx_company - 1
    idx_discord = header.index("Discord ID", idx_username)
    idx_medal = header.index("Medal") if "Medal" in header else -1
    idx_loa = header.index("LOA") if "LOA" in header else -1
    idx_activity = header.index("Activity", idx_username) if "Activity" in header[idx_username:] else -1

    # Recruit-count stat columns between Discord ID and Activity
    # (AS / EU / MO / AS / EU / LT — the second AS/EU pair and LT are
    # longer-window totals). Duplicated labels get a _2 suffix.
    stat_cols = []
    stat_end = idx_activity if idx_activity != -1 else len(header)
    for i in range(idx_discord + 1, stat_end):
        if i < len(header) and header[i]:
            label = header[i]
            dupes = sum(1 for _, l in stat_cols if l == label)
            stat_cols.append((f"{label}_{dupes + 1}" if dupes else label, i))

    results = []

    # Left block: department staff (Position / Rank / Username columns to the
    # left of the recruiter block).
    idx_pos = header.index("Position") if "Position" in header else -1
    idx_rank = header.index("Rank") if "Rank" in header else -1
    idx_staff_name = header.index("Username", idx_rank) if idx_rank != -1 else -1
    if idx_pos != -1 and idx_staff_name != -1:
        for row in rows[header_idx + 1:]:
            def get(i: int) -> str:
                return row[i].strip() if 0 <= i < len(row) else ""

            name = get(idx_staff_name)
            position = get(idx_pos)
            # Skip stat-label rows leaking into the staff columns
            # ("Current BW Recruits" / weekly counts put numbers and
            # dates like "3" / "11/2" into the Username column).
            if not name or name in ("-", "#N/A") or not position:
                continue
            if all(ch.isdigit() or ch in "./-" for ch in name):
                continue
            results.append({
                "battalion": "recruitment",
                "company": "Etat Major du Recrutement",
                "points": "",
                "position": position,
                "rank": get(idx_rank),
                "name": name,
                "discordId": "",
                "kills": "", "kpe": "", "kdr": "", "activity": "",
                "activityPct": "", "loa": "", "grade": "",
                "attendance": {},
                "medal": "",
            })

    # Right block: every recruiter, with their home company + medal tier.
    for row in rows[header_idx + 1:]:
        def get(i: int) -> str:
            return row[i].strip() if 0 <= i < len(row) else ""

        name = get(idx_username)
        if not name or name in ("-", "#N/A"):
            continue

        company = get(idx_company)
        if company in ("not found", "#N/A", "-"):
            company = ""

        results.append({
            "battalion": "recruitment",
            "company": company,
            "points": "",
            "position": "Recruteur",
            "rank": "",
            "name": name,
            "discordId": get(idx_discord),
            "kills": "", "kpe": "", "kdr": "", "activity": "",
            "activityPct": get(idx_activity) if idx_activity != -1 else "",
            "loa": get(idx_loa) if idx_loa != -1 else "",
            "grade": "",
            "attendance": {},
            "medal": get(idx_medal) if idx_medal != -1 else "",
            "stats": {label: get(i) for label, i in stat_cols},
        })

    return results


def parse_medals_csv(content: str) -> list[dict]:
    """
    Parse the medals/awards sheet: one row per medal awarded, columns
    Username, Profile Link, Medal, Class. A player with multiple medals
    (or multiple classes of the same medal) has one row per award.
    """
    rows = list(csv.reader(content.splitlines()))
    if not rows:
        return []

    header = [c.strip() for c in rows[0]]
    idx_username = header.index("Username") if "Username" in header else 0
    idx_profile = header.index("Profile Link") if "Profile Link" in header else 1
    idx_medal = header.index("Medal") if "Medal" in header else 2
    idx_class = header.index("Class") if "Class" in header else 3

    results = []
    for row in rows[1:]:
        def get(idx: int) -> str:
            return row[idx].strip() if idx < len(row) else ""

        medal = get(idx_medal)
        if not medal:
            continue

        results.append({
            "username": get(idx_username),
            "profileLink": get(idx_profile),
            "medal": medal,
            "class": get(idx_class),
            "reason": "",
        })

    return results


def parse_legion_honneur_csv(content: str) -> list[dict]:
    """
    Parse the France-nationwide Légion d'Honneur sheet (gid=0 of the
    Empire-wide honours spreadsheet). Same conceptual shape as
    `parse_medals_csv` (username/medal/class), but Empire-wide, with extra
    columns (corps, regiment, recommender, reason) we don't need for the
    site except "Recommended Reason", which we keep so the UI can show why
    a player received the award. A few leading/trailing blank columns exist
    in the raw sheet, so columns are located by header name rather than
    fixed position.
    """
    rows = list(csv.reader(content.splitlines()))
    header_idx = _find_header_row(rows, ["Username", "Profile Link", "Medal", "Medal Class"])
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    idx_username = header.index("Username")
    idx_profile = header.index("Profile Link")
    idx_medal = header.index("Medal")
    idx_class = header.index("Medal Class")
    idx_reason = header.index("Recommended Reason") if "Recommended Reason" in header else -1
    idx_awarded = header.index("Awarded Date") if "Awarded Date" in header else -1

    results = []
    for row in rows[header_idx + 1:]:
        def get(i: int) -> str:
            return row[i].strip() if 0 <= i < len(row) else ""

        username = get(idx_username)
        medal = get(idx_medal)
        if not username or not medal:
            continue

        results.append({
            "username": username,
            "profileLink": get(idx_profile),
            "medal": medal,
            "class": get(idx_class),
            "reason": get(idx_reason) if idx_reason != -1 else "",
            "awardedDate": get(idx_awarded) if idx_awarded != -1 else "",
        })

    return results


def parse_nobility_csv(content: str) -> list[dict]:
    """
    Parse the Nobility sheet: one row per title. "Nobility Class" (e.g.
    "Noblesse Impériale") is the order; the badge-worthy title itself
    ("Baron", "Comte", "Duc", "Chevalier") sits in the next, unlabeled
    column, followed by "Stage" (actually the approval status).
    """
    rows = list(csv.reader(content.splitlines()))
    header_idx = _find_header_row(rows, ["Username", "Profile Link", "Nobility Class"])
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    idx_username = header.index("Username")
    idx_profile = header.index("Profile Link")
    idx_order = header.index("Nobility Class")
    idx_title = idx_order + 1
    idx_status = header.index("Stage") if "Stage" in header else -1
    idx_date = header.index("Recommended Date") if "Recommended Date" in header else -1

    results = []
    for row in rows[header_idx + 1:]:
        def get(i: int) -> str:
            return row[i].strip() if 0 <= i < len(row) else ""

        username = get(idx_username)
        title = get(idx_title)
        if not username or not title:
            continue

        results.append({
            "username": username,
            "profileLink": get(idx_profile),
            "order": get(idx_order),
            "label": title,
            "status": get(idx_status),
            "date": get(idx_date),
        })

    return results


def parse_honour_csv(content: str, honour_type: str, date_label: str) -> list[dict]:
    """
    Parse the Grand Battles / Venerations sheets: both share the same
    Username/Profile Link/Type/Rank/Status/.../Date shape, differing only
    in the label of the date column.
    """
    rows = list(csv.reader(content.splitlines()))
    header_idx = _find_header_row(rows, ["Username", "Profile Link", "Rank"])
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    idx_username = header.index("Username")
    idx_profile = header.index("Profile Link")
    idx_rank = header.index("Rank")
    idx_status = header.index("Status") if "Status" in header else -1
    idx_date = header.index(date_label) if date_label in header else -1

    results = []
    for row in rows[header_idx + 1:]:
        def get(i: int) -> str:
            return row[i].strip() if 0 <= i < len(row) else ""

        username = get(idx_username)
        rank = get(idx_rank)
        if not username or not rank:
            continue

        results.append({
            "username": username,
            "profileLink": get(idx_profile),
            "type": honour_type,
            "label": f"Rank {rank}",
            "status": get(idx_status) if idx_status != -1 else "",
            "date": get(idx_date) if idx_date != -1 else "",
        })

    return results


def parse_kill_log_csv(content: str) -> dict:
    """
    Parse the kill log sheet (DATE / USERNAME / KILLS / DEATHS / ASSISTS /
    COMPANY / POINTS) into a per-player battle history:
    {username: [{date, kills, deaths, assists, company, points}]}.

    Rows that carry actual stats (any of KILLS/DEATHS/ASSISTS filled) are
    kept as individual battle records — a player can have several battles
    on the same date. Rows with no stats at all are point-award ticks
    (POINTS is nearly always "1"; the 22/12/2025 block is a bulk backfill
    of thousands of these), so they are merged into one entry per
    (username, date, company) with `points` summed and `battles` set to
    the merged row count.
    """
    rows = list(csv.reader(content.splitlines()))
    header_idx = _find_header_row(rows, ["DATE", "USERNAME", "KILLS"])
    if header_idx == -1:
        return {}

    header = [c.strip() for c in rows[header_idx]]
    idx = {label: header.index(label) for label in ("DATE", "USERNAME", "KILLS", "DEATHS", "ASSISTS", "COMPANY", "POINTS") if label in header}

    history: dict[str, list[dict]] = {}
    point_buckets: dict[tuple, dict] = {}
    seen_stats: set[tuple] = set()

    for row in rows[header_idx + 1:]:
        def get(label: str) -> str:
            i = idx.get(label, -1)
            return row[i].strip() if 0 <= i < len(row) else ""

        username = get("USERNAME")
        if not username:
            continue

        kills, deaths, assists = get("KILLS"), get("DEATHS"), get("ASSISTS")
        date, company, points = get("DATE"), get("COMPANY"), get("POINTS")

        if kills or deaths or assists:
            # The sheet frequently double-logs a battle (identical stats on
            # identical date) — skip exact repeats so kills aren't inflated.
            stat_key = (username, date, kills, deaths, assists, company)
            if stat_key in seen_stats:
                continue
            seen_stats.add(stat_key)
            history.setdefault(username, []).append({
                "date": date, "kills": kills, "deaths": deaths,
                "assists": assists, "company": company, "points": points,
            })
            continue

        bucket_key = (username, date, company)
        bucket = point_buckets.get(bucket_key)
        if bucket is None:
            bucket = {"date": date, "kills": "", "deaths": "", "assists": "",
                      "company": company, "points": 0, "battles": 0}
            point_buckets[bucket_key] = bucket
            history.setdefault(username, []).append(bucket)
        bucket["battles"] += 1
        if points.isdigit():
            bucket["points"] += int(points)

    for bucket in point_buckets.values():
        bucket["points"] = str(bucket["points"])

    return history


def main():
    DATA_DIR.mkdir(exist_ok=True)

    activity_all = []
    roster_usernames: set[str] = set()
    medals_data: list[dict] = []
    legion_honneur_data: list[dict] = []

    for sheet in SHEETS:
        name = sheet["name"]
        gids = sheet["gids"]
        kind = sheet["kind"]
        spreadsheet_id = sheet.get("spreadsheet_id", SPREADSHEET_ID)
        endpoint = sheet.get("endpoint", "export")

        csv_contents = [download_csv(name, gid, spreadsheet_id, endpoint) for gid in gids]

        if kind == "roster":
            data = [r for c in csv_contents for r in parse_roster_csv(c)]
            # Every username our players are known by, for filtering the
            # Empire-wide Nobility/Grand Battles/Venerations sheets down to
            # just our own roster below.
            for r in data:
                for key in ("name", "returningUsername"):
                    if r.get(key):
                        roster_usernames.add(r[key].strip().lower())
        elif kind == "activity":
            data = [r for c in csv_contents for r in parse_activity_csv(c, battalion=name)]
            activity_all.extend(data)
        elif kind == "orbat":
            data = [r for c in csv_contents for r in parse_orbat_csv(c)]
        elif kind == "player_stats":
            data = parse_player_stats_csv(csv_contents[0])
        elif kind == "medals":
            data = [r for c in csv_contents for r in parse_medals_csv(c)]
            medals_data = data
        elif kind == "legion_honneur":
            data = [r for c in csv_contents for r in parse_legion_honneur_csv(c)]
            data = [r for r in data if r["username"].strip().lower() in roster_usernames]
            legion_honneur_data = data
        elif kind == "nobility":
            data = [r for c in csv_contents for r in parse_nobility_csv(c)]
            data = [r for r in data if r["username"].strip().lower() in roster_usernames]
        elif kind == "kill_log":
            data = {}
            for c in csv_contents:
                for username, entries in parse_kill_log_csv(c).items():
                    if username.strip().lower() in roster_usernames:
                        data.setdefault(username, []).extend(entries)
        elif kind in ("grandbattle", "veneration"):
            date_label = "Date Awarded" if kind == "grandbattle" else "Date Changed"
            data = [r for c in csv_contents for r in parse_honour_csv(c, kind, date_label)]
            data = [r for r in data if r["username"].strip().lower() in roster_usernames]
        elif kind == "flag_guard":
            data = [r for c in csv_contents for r in parse_flag_guard_csv(c)]
            # Backfill real military rank from the combat rosters (this sheet's
            # own "Rank" column is actually the Flag Guard role, not a rank).
            rank_by_name = {r["name"].lower(): r["rank"] for r in activity_all if r.get("name")}
            for row in data:
                row["rank"] = rank_by_name.get(row["name"].lower(), "")
        elif kind == "recruitment":
            data = [r for c in csv_contents for r in parse_recruitment_csv(c)]
            # Backfill military rank from the combat rosters for recruiters
            # (staff rows already carry their own rank).
            rank_by_name = {r["name"].lower(): r["rank"] for r in activity_all if r.get("name")}
            for row in data:
                if not row["rank"]:
                    row["rank"] = rank_by_name.get(row["name"].lower(), "")
        else:
            data = [row for c in csv_contents for row in parse_raw_csv(c)]

        out_path = DATA_DIR / f"{name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        count = len(data) if isinstance(data, list) else 1
        print(f"Saved {count} rows to {out_path}")

    # Merge the France-nationwide Légion d'Honneur list into medals.json,
    # skipping any award a player already has from the primary medals sheet
    # (same username + medal + class, case-insensitive).
    existing_keys = {
        (m["username"].strip().lower(), m["medal"].strip().lower(), m["class"].strip().lower())
        for m in medals_data
    }
    merged_medals = list(medals_data)
    for m in legion_honneur_data:
        key = (m["username"].strip().lower(), m["medal"].strip().lower(), m["class"].strip().lower())
        if key in existing_keys:
            continue
        existing_keys.add(key)
        merged_medals.append(m)

    # Backfill "Recommended Reason" + "Awarded Date" from the France-wide
    # medal list onto awards that came from the primary medals sheet (which
    # has neither column). Match on username + medal + class, same as the
    # merge key.
    extra_by_key = {
        (m["username"].strip().lower(), m["medal"].strip().lower(), m["class"].strip().lower()): m
        for m in legion_honneur_data
    }
    backfilled = 0
    for m in merged_medals:
        key = (m["username"].strip().lower(), m["medal"].strip().lower(), m["class"].strip().lower())
        extra = extra_by_key.get(key)
        if not extra:
            continue
        if not m.get("reason") and extra.get("reason"):
            m["reason"] = extra["reason"]
            backfilled += 1
        if not m.get("awardedDate") and extra.get("awardedDate"):
            m["awardedDate"] = extra["awardedDate"]
    print(f"Backfilled reasons onto {backfilled} medals from the France-wide list")

    medals_path = DATA_DIR / "medals.json"
    with open(medals_path, "w", encoding="utf-8") as f:
        json.dump(merged_medals, f, indent=2, ensure_ascii=False)
    print(f"Merged {len(legion_honneur_data)} Legion d'Honneur rows into medals.json ({len(merged_medals)} total, {len(medals_data)} were original)")

    # Combined activity file across all battalions.
    activity_path = DATA_DIR / "activity.json"
    with open(activity_path, "w", encoding="utf-8") as f:
        json.dump(activity_all, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(activity_all)} rows to {activity_path}")

    for sheet in RAW_ONLY_SHEETS:
        name = sheet["name"]
        gid = sheet["gid"]
        csv_content = download_csv(name, gid)
        data = parse_raw_csv(csv_content)

        out_path = DATA_DIR / f"{name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {len(data)} raw rows to {out_path}")

    print("Done.")


if __name__ == "__main__":
    main()

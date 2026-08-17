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

SPREADSHEET_ID = "1jDCXIWrkTjDgxRX-2zddojWoUnD3TKYTFWdQz2DD6zc"

# Sheets we actually parse into structured JSON.
SHEETS = [
    {"name": "roster", "gid": "1946443746", "kind": "roster"},
    {"name": "grens", "gid": "725308317", "kind": "activity"},
    {"name": "volts", "gid": "1207657529", "kind": "activity"},
    {"name": "depot", "gid": "1247444176", "kind": "activity"},
    {"name": "fusiliers", "gid": "1586669991", "kind": "activity"},
    {"name": "orbat", "gid": "2141834013", "kind": "orbat"},
    {"name": "player_stats", "gid": "931290841", "kind": "player_stats"},
    {"name": "recruitment", "gid": "2031020815", "kind": "raw"},
]

# Reference/working sheets, downloaded as raw CSV only (not parsed for the site).
RAW_ONLY_SHEETS = [
    {"name": "kill_log", "gid": "1095406146"},
    {"name": "grading_curve", "gid": "567217808"},
    {"name": "colour_guard", "gid": "367345434"},
    {"name": "daily_input", "gid": "1662116744"},
    {"name": "rally_summary", "gid": "429239458"},
]


def download_csv(name: str, gid: str) -> str:
    """Download a sheet tab as CSV and return the content."""
    url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv&gid={gid}"
    print(f"Downloading {name} from {url}...")
    with urllib.request.urlopen(url) as response:
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
                column_map = {
                    "rank": fields.index("Rank"),
                    "company": fields.index("Company") if "Company" in fields else -1,
                    "position": fields.index("Position") if "Position" in fields else -1,
                    "name": fields.index("Name") if "Name" in fields else -1,
                    "discordId": fields.index("Discord ID") if "Discord ID" in fields else -1,
                    "robloxLink": fields.index("Roblox Profile Link") if "Roblox Profile Link" in fields else -1,
                    "points": fields.index("Points") if "Points" in fields else -1,
                    "missing": fields.index("Missing?") if "Missing?" in fields else -1,
                    "returningUsername": fields.index("Username") if "Username" in fields else -1,
                    "returningDiscId": fields.index("Disc ID") if "Disc ID" in fields else -1,
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
    Parse a battalion activity sheet (GRENS/VOLTS/DEPOT/FUSILIERS).
    These sheets repeat the same block of columns (Points, Position, Rank,
    Name, Disc ID, K, KPE, KDR, Activity, Activity %, LOA, Grade, then daily
    attendance columns) once per company, side by side.
    """
    rows = list(csv.reader(content.splitlines()))
    header_idx = _find_header_row(rows, ["Points", "Position", "Rank", "Name"])
    if header_idx == -1:
        return []

    header = [c.strip() for c in rows[header_idx]]
    block_starts = [i for i, v in enumerate(header) if v == "Points"]

    # Leaderboard columns ("#", Rank, Name, Discord ID, -) sit after all the
    # company blocks and reuse the "Rank"/"Name" labels, so the last block
    # must stop before them.
    leaderboard_col = next((i for i, v in enumerate(header) if v == "#"), len(header))

    results = []
    for b, start_col in enumerate(block_starts):
        end_col = block_starts[b + 1] if b + 1 < len(block_starts) else min(len(header), leaderboard_col)
        sub_header = header[start_col:end_col]

        col_map = {}
        date_cols = []
        for offset, label in enumerate(sub_header):
            if label in ACTIVITY_FIELDS:
                col_map.setdefault(label, start_col + offset)
            elif "/" in label and label.replace("/", "").isdigit():
                date_cols.append((label, start_col + offset))

        # Company name lives directly above the "Points" cell, a couple rows up.
        company_name = ""
        for r in range(header_idx - 1, -1, -1):
            if start_col < len(rows[r]) and rows[r][start_col].strip():
                company_name = rows[r][start_col].strip()
                break

        for r in range(header_idx + 1, len(rows)):
            row = rows[r]
            if start_col >= len(row):
                continue

            def get(label: str) -> str:
                idx = col_map.get(label)
                if idx is None or idx >= len(row):
                    return ""
                return row[idx].strip()

            points = get("Points")
            name = get("Name")
            rank = get("Rank")

            # Skip section-label rows like "Quartier General" / "Soldats du Rang"
            # and empty/vacant slots (no name, no rank assigned).
            if not name and not rank:
                continue

            attendance = {label: (row[idx].strip() if idx < len(row) else "") for label, idx in date_cols}

            results.append({
                "battalion": battalion,
                "company": company_name,
                "points": points,
                "position": get("Position"),
                "rank": rank,
                "name": name,
                "discordId": get("Disc ID"),
                "kills": get("K"),
                "kpe": get("KPE"),
                "kdr": get("KDR"),
                "activity": get("Activity"),
                "activityPct": get("Activity %"),
                "loa": get("LOA"),
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

            group_name = ""
            for r in range(header_idx - 1, -1, -1):
                if start_col < len(rows[r]) and rows[r][start_col].strip():
                    group_name = rows[r][start_col].strip()
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


def main():
    DATA_DIR.mkdir(exist_ok=True)

    activity_all = []

    for sheet in SHEETS:
        name = sheet["name"]
        gid = sheet["gid"]
        kind = sheet["kind"]

        csv_content = download_csv(name, gid)

        if kind == "roster":
            data = parse_roster_csv(csv_content)
        elif kind == "activity":
            data = parse_activity_csv(csv_content, battalion=name)
            activity_all.extend(data)
        elif kind == "orbat":
            data = parse_orbat_csv(csv_content)
        elif kind == "player_stats":
            data = parse_player_stats_csv(csv_content)
        else:
            data = parse_raw_csv(csv_content)

        out_path = DATA_DIR / f"{name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        count = len(data) if isinstance(data, list) else 1
        print(f"Saved {count} rows to {out_path}")

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

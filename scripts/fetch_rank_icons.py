"""
Downloads rank insignia icons from the French Empire Fandom wiki
(napoleonic-wars-rblx.fandom.com) into public/ranks/, replacing the
lower-quality PNGs previously in public/. Source: "Ranks" table on the
French_Empire wiki page.

Uses the MediaWiki imageinfo API to resolve File: titles to real image
URLs (see scripts/fetch_medal_icons2.py for the same pattern).

Run with: python scripts/fetch_rank_icons.py
"""

import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "ranks"
API = "https://napoleonic-wars-rblx.fandom.com/api.php"

# rank tier code (matches lib/rank-icons.ts) -> wiki File: title (no "File:" prefix)
FILES = {
    "A0": "Conscrit.png",
    "A1": "Soldat_France.webp",
    "A2": "Soldat_de_Premier_France.png",
    "A3": "Caporal_France_Rank.png",
    "A4": "Caporal_de_Premier_France.png",
    "A5": "Caporal_Fourrier_France.webp",
    "A6": "Sergeant_France.png",
    "B1": "Sergeant_France.png",
    "B2": "Sergent_Major_France.png",
    "B3": "Adjudant_France.png",
    "B4": "Adjudant_Sous-Officier_France.png",
    "C1": "Sous_Lieutenant.png",
    "C2": "Lieutenant_France.png",
    "C3": "Capitaine_Adjutant-Major.png",
    "C4": "Chef de Battalion.webp",
    "C5": "Major_France.png",
    "C6": "Colonel_France.png",
    "D1": "General_Of_Brigade_France.png",
}


def chunked(items, size):
    items = list(items)
    for i in range(0, len(items), size):
        yield items[i : i + size]


def norm(title: str) -> str:
    """MediaWiki normalizes underscores to spaces in titles — normalize both
    sides the same way before matching so lookups don't silently miss."""
    return title.replace("_", " ")


def resolve_urls(titles: list[str]) -> dict[str, str]:
    """Returns {normalized_title: image_url} for a list of File: titles (no 'File:' prefix)."""
    result = {}
    for batch in chunked(titles, 25):
        full_titles = "|".join(f"File:{t}" for t in batch)
        qs = urllib.parse.urlencode(
            {
                "action": "query",
                "titles": full_titles,
                "prop": "imageinfo",
                "iiprop": "url",
                "format": "json",
            }
        )
        url = f"{API}?{qs}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode("utf-8"))
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            title = norm(page.get("title", "").replace("File:", ""))
            info = page.get("imageinfo")
            if info:
                result[title] = info[0]["url"]
    return result


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    # De-duplicate titles (A6 and B1 share the same Sergent icon) while
    # still resolving once per unique title.
    unique_titles = sorted(set(FILES.values()))
    resolved = resolve_urls(unique_titles)

    ok = 0
    for code, title in FILES.items():
        url = resolved.get(norm(title))
        if not url:
            print("MISSING URL", code, title)
            continue
        ext = Path(urllib.parse.urlparse(url).path).suffix or ".png"
        out_path = OUT_DIR / f"{code}{ext}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req) as response:
                data = response.read()
            with open(out_path, "wb") as f:
                f.write(data)
            ok += 1
            print("OK", code, "->", out_path.name)
        except Exception as e:
            print("FAIL", code, repr(e))
    print(f"Done. {ok}/{len(FILES)} downloaded.")


if __name__ == "__main__":
    main()

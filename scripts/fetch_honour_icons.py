"""
Downloads Veneration stripe, Nobility title, and Grand Battle stripe icons
from the French Empire Fandom wiki (napoleonic-wars-rblx.fandom.com) into
public/honours/, for use in the medal display case on the Player Lookup
page. Source: "Honours & Medals" -> "Galons d'Ancienneté" (Veneration) and
"Les Médailles de Campagne" (Grand Battle), and the "Nobility Titles" table,
on the French_Empire wiki page.

Uses the MediaWiki imageinfo API to resolve File: titles to real image URLs
(see scripts/fetch_medal_icons2.py for the same pattern).

Run with: python scripts/fetch_honour_icons.py
"""

import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "honours"
API = "https://napoleonic-wars-rblx.fandom.com/api.php"

# slug -> wiki File: title (without the "File:" prefix)
FILES = {
    # Veneration stripes — slug matches the "Rank N" label used in venerations.json
    "veneration-1": "1er Veneration.png",
    "veneration-2": "2ème Veneration.png",
    "veneration-3": "3ème Veneration.png",
    "veneration-4": "4ème Veneration.png",
    "veneration-5": "5ème Veneration.png",
    "veneration-6": "6ème Veneration.png",
    "veneration-7": "7ème Veneration.png",
    "veneration-8": "8ème Veneration.png",
    "veneration-9": "9ème Veneration.png",
    "veneration-10": "10ème Veneration.png",
    "veneration-11": "11ème Veneration.png",
    "veneration-12": "12ème Veneration.png",
    # Nobility titles — slug matches the "label" used in nobility.json (lowercased)
    "nobility-duc": "Duc_d'Empire France.png",
    "nobility-comte": "Comte_d'Empire France.png",
    "nobility-baron": "Baron_d'Empire France.png",
    "nobility-chevalier": "Chevalier_d'Empire France.png",
    # Grand Battle stripes — slug matches the "Rank N" label used in grandbattles.json
    "grandbattle-1": "Grand Battle Stripe 1.webp",
    "grandbattle-2": "Grand Battle Stripe 2.webp",
    "grandbattle-3": "Grand Battle Stripe 3.webp",
    "grandbattle-4": "Grand Battle Stripe 4.webp",
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
    unique_titles = sorted(set(FILES.values()))
    resolved = resolve_urls(unique_titles)

    ok = 0
    for slug, title in FILES.items():
        url = resolved.get(norm(title))
        if not url:
            print("MISSING URL", slug, title)
            continue
        ext = Path(urllib.parse.urlparse(url).path).suffix or ".png"
        out_path = OUT_DIR / f"{slug}{ext}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req) as response:
                data = response.read()
            with open(out_path, "wb") as f:
                f.write(data)
            ok += 1
            print("OK", slug, "->", out_path.name)
        except Exception as e:
            print("FAIL", slug, repr(e))
    print(f"Done. {ok}/{len(FILES)} downloaded.")


if __name__ == "__main__":
    main()

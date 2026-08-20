"""
Second pass: resolve remaining medal badge icons (campaign medals, corps
merit orders, pendants, marine merit medals) from the French Empire Fandom
wiki via the MediaWiki imageinfo API (titles -> real image URLs), then
download them into public/medals/.

Run with: python scripts/fetch_medal_icons2.py
"""

import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "medals"
API = "https://napoleonic-wars-rblx.fandom.com/api.php"

# slug -> wiki File: title (without the "File:" prefix)
FILES = {
    "merite-developpement-argent": "D'Argent Médaille du Mérite Developpement.png",
    "haut-bord-or": "D'Or Médaille de le Mérite de Haut Bord.png",
    "haut-bord-argent": "D'Argent Médaille de le Mérite de Haut Bord.png",
    "haut-bord-bronze": "De Bronze Médaille de le Mérite de Haut Bord.png",
    "timonier-or": "D'Or Médaille du Mérite du Timonier.png",
    "timonier-argent": "D'Argent Médaille du Mérite du Timonier.png",
    "timonier-bronze": "De Bronze Médaille du Mérite du Timonier.png",
    "pendantif-benevole-or": "D'Or_Pendentif_Benevole.png",
    "pendantif-benevole-argent": "D'Argent_Pendentif_Benevole.png",
    "pendantif-benevole-bronze": "De_Bronze_Pendentif_Benevole.png",
    "pendantif-elite-bronze": "De_Bronze_Pendantif_d'Elite.png",
    "outre-mer-or": "D'Or Pendentif de l'Outre-Mer.png",
    "outre-mer-argent": "D'Argent Pendentif de l'Outre-Mer.png",
    "outre-mer-bronze": "De Bronze Pendentif de l'Outre-Mer.png",
    "campagne-egypte-legionnaire": "D'Argent Médaille Campagne d'Egypte.png",
    "campagne-autriche-or": "D'Or Médaille Campagne d'Autriche.png",
    "campagne-autriche-argent": "D'Argent Médaille Campagne d'Autriche.png",
    "campagne-autriche-bronze": "De Bronze Médaille Campagne d'Autriche.png",
    "campagne-italie-or": "D'Oro Médaille Campagne d'Italie.png",
    "campagne-italie-argent": "D'Argent Médaille Campagne d'Italie.png",
    "campagne-italie-bronze": "De Bronze Médaille Campagne d'Italie.png",
    "campagne-allemagne-or": "D'Or Médaille de la Campagne d'Allemagne.webp",
    "campagne-allemagne-argent": "D'Argent Médaille de la Campagne d'Allemagne.webp",
    "campagne-allemagne-bronze": "De Bronze Médaille de la Campagne d'Allemagne.webp",
    "campagne-saint-nicolas-or": "D'Or Médaille de la Campagne de Saint-Nicolas.webp",
    "campagne-saint-nicolas-argent": "D'Argent Médaille de la Campagne de Saint-Nicolas.webp",
    "campagne-saint-nicolas-bronze": "De Bronze Médaille de la Campagne de Saint-Nicolas.webp",
    "aigle-imperiale-grand-aigle": "Grand Aigle de l'Ordre de l'Aigle Impériale.png",
    "aigle-imperiale-commandeur": "Commandeur de l'Ordre de l'Aigle Impériale.png",
    "aigle-imperiale-officier": "Officier de l'Ordre de l'Aigle Impériale.png",
    "aigle-imperiale-legionnaire": "Légionnaire de l'Ordre de l'Aigle Impériale.png",
    "premier-merite-commandeur": "Commandeur du Premier Ordre du Mérite.png",
    "premier-merite-officier": "Officier du Premier Ordre du Mérite.png",
    "premier-merite-legionnaire": "Légionnaire du Premier Ordre du Mérite.png",
    "deuxieme-merite-commandeur": "Commandeur Ordre du Merite du Deuxième.png",
    "deuxieme-merite-officier": "Officier Ordre du Merite du Deuxième.png",
    "deuxieme-merite-legionnaire": "Légionnaire Ordre du Merite du Deuxième.png",
    "troisieme-valliance-commandeur": "Commandeur de la Troisième Valliance.png",
    "troisieme-valliance-officier": "Officier de la Troisième Valliance.png",
    "troisieme-valliance-legionnaire": "Légionnaire de la Troisième Valliance.png",
    "athenmatique-commandeur": "Commandeur du Ordre du Mérite de l'Athenmatique.png",
    "athenmatique-officier": "Officier du Ordre du Mérite de l'Athenmatique.png",
    "athenmatique-legionnaire": "Légionnaire du Ordre du Mérite de l'Athenmatique.png",
}


def chunked(items, size):
    items = list(items)
    for i in range(0, len(items), size):
        yield items[i : i + size]


def resolve_urls(titles: list[str]) -> dict[str, str]:
    """Returns {title: image_url} for a list of File: titles (no 'File:' prefix)."""
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
            title = page.get("title", "").replace("File:", "")
            info = page.get("imageinfo")
            if info:
                result[title] = info[0]["url"]
    return result


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    titles = list(FILES.values())
    resolved = resolve_urls(titles)

    ok = 0
    for slug, title in FILES.items():
        url = resolved.get(title)
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

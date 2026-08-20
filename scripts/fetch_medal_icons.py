"""
One-time script to download medal badge icons from the French Empire Fandom
wiki (napoleonic-wars-rblx.fandom.com) into public/medals/ for use in the
Player Lookup medal badges. Source: "Honours & Medals" table on the
French_Empire wiki page (Empire-wide honors, not regiment-specific).

Run with: python scripts/fetch_medal_icons.py
"""

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "medals"

ICONS = {
    "legion-honneur-grand-aigle": "https://static.wikia.nocookie.net/empire-francais/images/a/a9/Grand_Aigle_L%C3%A9gion_d%27Honneur_V2.png",
    "legion-honneur-grand-officier": "https://static.wikia.nocookie.net/empire-francais/images/a/af/Grand_Officier_L%C3%A9gion_d%27Honneur_V2.png",
    "legion-honneur-commandeur": "https://static.wikia.nocookie.net/empire-francais/images/d/d2/Commandeur_L%C3%A9gion_D%27Honneur.png",
    "legion-honneur-officier": "https://static.wikia.nocookie.net/empire-francais/images/e/ed/Officier_L%C3%A9gion_D%27Honneur.png",
    "legion-honneur-legionnaire": "https://static.wikia.nocookie.net/empire-francais/images/9/9f/L%C3%A9gionnaire_L%C3%A9gion_D%27Honneur.png",
    "fidele-commandeur": "https://static.wikia.nocookie.net/empire-francais/images/4/45/Commandeur_Ordre_de_la_Fid%C3%A9le.png",
    "fidele-officier": "https://static.wikia.nocookie.net/empire-francais/images/4/46/Officier_Ordre_de_la_Fid%C3%A9le.png",
    "fidele-legionnaire": "https://static.wikia.nocookie.net/empire-francais/images/8/80/L%C3%A9gionnaire_Ordre_de_la_Fid%C3%A9le.png",
    "merite-initiatif-or": "https://static.wikia.nocookie.net/empire-francais/images/a/ab/D%27Or_M%C3%A9daille_du_M%C3%A9rite_Initiatif.png",
    "merite-initiatif-argent": "https://static.wikia.nocookie.net/empire-francais/images/d/de/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_Initiatif.png",
    "merite-initiatif-bronze": "https://static.wikia.nocookie.net/empire-francais/images/d/d5/De_Bronze_M%C3%A9daille_du_M%C3%A9rite_Initiatif.png",
    "merite-commandant-or": "https://static.wikia.nocookie.net/empire-francais/images/b/b2/D%27Or_M%C3%A9daille_du_M%C3%A9rite_Commandant.png",
    "merite-commandant-argent": "https://static.wikia.nocookie.net/empire-francais/images/e/e8/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_Commandant.png",
    "merite-commandant-bronze": "https://static.wikia.nocookie.net/empire-francais/images/b/b5/De_Bronze_M%C3%A9daille_du_M%C3%A9rite_Commandant.png",
    "croix-bataille-or": "https://static.wikia.nocookie.net/empire-francais/images/2/2c/D%27Or_M%C3%A9daille_du_Croix_de_Battaile.png",
    "croix-bataille-argent": "https://static.wikia.nocookie.net/empire-francais/images/f/fd/D%27Argent_M%C3%A9daille_du_Croix_de_Battaile.png",
    "croix-bataille-bronze": "https://static.wikia.nocookie.net/empire-francais/images/c/c2/De_Bronze_M%C3%A9daille_du_Croix_de_Battaile.png",
    "merite-militaire-or": "https://static.wikia.nocookie.net/empire-francais/images/f/fa/D%27Or_M%C3%A9daille_du_M%C3%A9rite_Militaire.png",
    "merite-militaire-argent": "https://static.wikia.nocookie.net/empire-francais/images/7/71/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_Militaire.png",
    "merite-militaire-bronze": "https://static.wikia.nocookie.net/empire-francais/images/9/9e/De_Bronze_M%C3%A9daille_du_M%C3%A9rite_Militaire.png",
    "merite-porte-aigle-or": "https://static.wikia.nocookie.net/empire-francais/images/f/f1/D%27Or_M%C3%A9daille_du_M%C3%A9rite_Porte-Aigle.png",
    "merite-porte-aigle-argent": "https://static.wikia.nocookie.net/empire-francais/images/c/c4/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_Porte-Aigle.png",
    "merite-porte-aigle-bronze": "https://static.wikia.nocookie.net/empire-francais/images/2/23/De_Bronze_M%C3%A9daille_du_M%C3%A9rite_Porte-Aigle.png",
    "merite-recrutement-or": "https://static.wikia.nocookie.net/empire-francais/images/5/56/D%27Or_M%C3%A9daille_du_M%C3%A9rite_en_Recrutement.png",
    "merite-recrutement-argent": "https://static.wikia.nocookie.net/empire-francais/images/1/10/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_en_Recrutement.png",
    "merite-recrutement-bronze": "https://static.wikia.nocookie.net/empire-francais/images/8/8b/De_Bronze_M%C3%A9daille_du_M%C3%A9rite_en_Recrutement.png",
    "merite-sociaux-argent": "https://static.wikia.nocookie.net/empire-francais/images/c/ca/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_Sociaux.png",
    "merite-artistique-or": "https://static.wikia.nocookie.net/empire-francais/images/5/5b/D%27Or_M%C3%A9daille_du_M%C3%A9rite_Artistique.png",
    "merite-artistique-argent": "https://static.wikia.nocookie.net/empire-francais/images/e/ef/D%27Argent_M%C3%A9daille_du_M%C3%A9rite_Artistique.png",
    "merite-artistique-bronze": "https://static.wikia.nocookie.net/empire-francais/images/7/7d/De_Bronze_M%C3%A9daille_du_M%C3%A9rite_Artistique.png",
    "indefectible": "https://static.wikia.nocookie.net/empire-francais/images/7/7f/M%C3%A9daille_de_l%27Ind%C3%A9fectible.png",
    "neuvieme-merite-commandeur": "https://static.wikia.nocookie.net/empire-francais/images/9/93/Commandeur%2C_Ordre_du_M%C3%A9rite_de_la_N%D0%B5uvi%C3%A8me.png",
    "neuvieme-merite-officier": "https://static.wikia.nocookie.net/empire-francais/images/a/a4/Officier%2C_Ordre_du_M%C3%A9rite_de_la_N%D0%B5uvi%C3%A8me.png",
    "neuvieme-merite-legionnaire": "https://static.wikia.nocookie.net/empire-francais/images/5/50/L%C3%A9gionnaire%2C_Ordre_du_M%C3%A9rite_de_la_N%D0%B5uvi%C3%A8me.png",
    "cinquieme-merite-commandeur": "https://static.wikia.nocookie.net/empire-francais/images/e/eb/Commandeur_de_Cinqui%C3%A8me_M%C3%A9rite.png",
    "cinquieme-merite-officier": "https://static.wikia.nocookie.net/empire-francais/images/1/1c/Officier_de_Cinqui%C3%A8me_M%C3%A9rite.png",
    "cinquieme-merite-legionnaire": "https://static.wikia.nocookie.net/empire-francais/images/9/90/L%C3%A9gionnaire_de_Cinqui%C3%A8me_M%C3%A9rite.png",
}


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = 0
    for slug, url in ICONS.items():
        out_path = OUT_DIR / f"{slug}.png"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req) as response:
                data = response.read()
            with open(out_path, "wb") as f:
                f.write(data)
            ok += 1
            print("OK", slug)
        except Exception as e:
            print("FAIL", slug, repr(e))
    print(f"Done. {ok}/{len(ICONS)} downloaded.")


if __name__ == "__main__":
    main()

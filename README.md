# 🍫 Marathon Éclair MTL

Site mobile-only pour tournée dégustation d'éclairs à Montréal, samedi 23 mai 2026.

## Features

- 📍 6 arrêts ordonnés (Ahuntsic → Plateau), ~4h
- 🗺️ Boutons Google Maps par stop (trajet depuis précédent + emplacement)
- 🚲 3 modes transport: transit / vélo BIXI / marche
- ⭐ Note 1-5 étoiles par pâtisserie (tap to rate, tap same = annule)
- 🏆 Classement local + agrégation manuelle via partage de string
- 💾 localStorage (cache navigateur, zéro backend, zéro tracking)
- ⏰ Countdown J-X jusqu'à l'event

## Comment marche le classement ?

**Architecture:** tout en local (localStorage). Chaque téléphone garde SES propres votes. Pas de serveur.

**Calcul:** moyenne des étoiles par pâtisserie, tri décroissant.

**Agrégation du classement de groupe (option manuelle):**

1. Chaque participant note sur son téléphone
2. Sur l'écran principal, bouton **"📋 Copier mes votes"** → copie une string compacte (ex: `v1:4,5,3,4,5,4`)
3. Chacun colle sa string dans le groupe chat
4. Un "aggregator" (une seule personne) va sur la page **🏆 Classement** de son téléphone et utilise **"📥 Importer des votes"** pour coller chaque string + le nom de l'ami
5. Le classement se met à jour avec la moyenne globale

**Format string:** `v1:a,b,c,d,e,f` où chaque nombre (0-5) correspond à la note de la pâtisserie dans l'ordre de l'itinéraire. `0` = pas noté.

Exemple:
- Stop 1 (La Bête à Pain): 4/5
- Stop 2 (De Froment): 5/5
- Stop 3 (Alex Platel): pas noté
- Stop 4 (Mamie Clafoutis): 3/5
- Stop 5 (Mont Éclair): 5/5
- Stop 6 (Fous Desserts): 4/5

→ String: `v1:4,5,0,3,5,4`

## Stack

- HTML + Tailwind CDN (pas de build step)
- Vanilla JS ES6+
- localStorage pour persistence
- Hosted: GitHub Pages

## Deploy (GitHub Pages)

```bash
cd eclairs-mtl/
git init
git add .
git commit -m "initial: marathon éclair MTL site"
git branch -M main
git remote add origin https://github.com/<TON_USER>/eclairs-mtl.git
git push -u origin main

# Settings → Pages → Source: main / (root) → Save
# URL finale: https://<TON_USER>.github.io/eclairs-mtl/
```

## Structure

```
eclairs-mtl/
├── .nojekyll           # empêche Jekyll sur GH Pages
├── index.html          # page principale (stops + étoiles + share)
├── classement.html     # podium + ranking + import votes amis
├── assets/
│   ├── app.js          # data + stars UI + share
│   └── classement.js   # agrégation + import
└── README.md
```

## localStorage keys

- `eclairs_mtl_my_votes` — `{ stopId: rating }` (mes votes)
- `eclairs_mtl_imported` — `[ { name, votes, importedAt } ]` (votes amis importés)

## Tester localement

```bash
cd eclairs-mtl && python3 -m http.server 8000
```

Ouvrir sur mobile (même réseau WiFi): `http://<ton-ip-locale>:8000`

## Jour J checklist

- [ ] Tester site sur ton téléphone (WiFi + 4G)
- [ ] Partager URL GitHub Pages au groupe
- [ ] Chacun note pendant la tournée
- [ ] Fin de journée: chacun copie ses votes → groupe chat
- [ ] 1 personne importe tout sur son téléphone → présente le classement

## License

MIT — bon appétit 🍫
# bakery-trail

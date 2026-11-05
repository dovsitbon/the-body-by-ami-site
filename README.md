# The Body by Ami : site vitrine et réservation

Institut visage, corps et longévité, 58 rue des Jacobins (1er étage), 80000 Amiens. Next.js 16, Tailwind 4, Motion (Framer Motion). Français par défaut (`/fr`) et anglais (`/en`).

## Lancer

```bash
npm install
npm run dev
```

## Où modifier quoi

| Quoi | Fichier |
|---|---|
| Textes FR / EN | `locales/fr.json`, `locales/en.json` |
| Soins, durées, prix | `data/soins.json` |
| Programmes, offres mariée | `data/programmes.json` |
| Offres datées (bandeau + section) | `data/offres.json` : disparaissent seules après `to` |
| Horaires, fermetures | `data/horaires.json` : statut « Ouvert / Fermé » en direct |
| Équipe | `data/equipe.json` |
| Presse, récompenses | `data/presse.json` |
| Avant / après (avec accord) | `data/avant-apres.json` |
| Téléphone, WhatsApp, Planity, Instagram, notes | `data/site.json` |
| Photos | `assets/raw` → `npm run media` (classe dans `assets/*` et prépare `public/media`) |
| Logo | `components/Logo.tsx`, `public/logo.svg`, `app/icon.svg` |

## Réservation

- Les boutons « Réserver » ouvrent la fiche Planity de l'institut (Planity ne permet pas de lien direct vers une prestation : la barre de réservation suggère le soin à choisir).
- Programmes, mariée, Academy et cartes cadeaux : formulaire `/fr/demande`, qui ouvre WhatsApp (33623081054) avec un récapitulatif dans la langue choisie. Rien n'est stocké.

## Scripts

- `npm run media` : photos
- `npm run contenu` : régénère `CONTENU.md`
- `npm run affichette` : `public/affichette-the-body-by-ami-a5.pdf` (A5, QR code)

Voir aussi `INFOS-A-DEMANDER.md` et `NOTE-FICHE-GOOGLE.md`.

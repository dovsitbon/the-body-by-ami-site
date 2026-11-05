# Infos à demander à Ami

Tout ce qui manque ou reste à confirmer avant de présenter le site comme définitif. Chaque point renvoie au fichier à modifier.

## Équipe (`data/equipe.json`)

- Les prénoms et rôles exacts de l'équipe. Planity affiche **Ami, Anaïs, Janna, Océane** : Océane fait les bilans bien-être et nutrition ; les rôles d'Anaïs et Janna sont écrits « praticienne visage et corps », **à confirmer**.
- Une photo de chaque praticienne (portrait lumineux, même fond si possible).
- Un vrai portrait d'Ami : celui du site est détouré d'un visuel « Elles, ils sont Amiens ».
- Le nom de famille à afficher (le visuel « Résonance » est signé « Ami Sene » ; le site n'affiche que « Ami »).

## Prestations (`data/soins.json`, `data/programmes.json`)

Tous les prix du brief ont été retrouvés sur Planity le 5 novembre 2026. À confirmer :

- **Bilan bien-être et nutrition** avec Océane : 1 h, prix non affiché sur Planity.
- **Head spa** : Signature (1 h 30, 160 €), Duo (170 €), Duo Signature (320 €), Mon premier head spa 4-10 ans (49 €) : bien tous proposés ?
- **Massages** : Rituel Décompression (110 €), Résonance (130 €).
- **Hydra Bronze** : 25, 35 et 49 € selon les zones.
- **Mariée** : Bridal Glow J-7 (135 €), Bridal Reset 30 jours (360 €), Bridal Longevity 90 jours (890 €) : contenu détaillé de chaque offre ?
- **Épilation définitive** : le site renvoie vers Planity pour le détail des forfaits (plus de 60 lignes). Faut-il en afficher certains ?
- **Programmes** : Face Longevity et Body Sculpt : combien de séances ? (le site écrit « fixées au bilan »).
- **Offres de Noël 2026** : date de fin ? Le site les retire seul après le **24 décembre 2026**.

## Academy (`locales/*.json` → `academy`)

- Les formations réellement proposées (intitulés, durée, prix, dates, certification, nombre de places).
- Pour qui : esthéticiennes diplômées seulement, ou débutantes aussi ?
- Le site présente pour l'instant trois pistes (Face Pilates Signature, techniques manuelles du visage, formation sur mesure), avec la mention « contenus en cours de finalisation ».

## Preuves des récompenses et de la presse (`data/presse.json`)

À fournir pour chaque ligne (lien, capture, article) ; sinon on la retire :

- « **Meilleur concept esthétique 2026** » (bio Instagram) : décerné par qui ?
- **Petit Futé 2024** (story à la une).
- **Forbes**, émission « Entreprises à succès » : lien vers la vidéo ou l'article.
- **Vogue**, article Facepilates d'avril 2026 : l'institut ou Ami sont-ils cités dans l'article ?
- **Elles, ils sont Amiens** : lien vers le portrait.
- Les autres articles de la story « Presse ».

## Liens et coordonnées (`data/site.json`)

- Le bon lien Planity : le site utilise `the-body-by-ami-80000-amiens` (fiche active, 575 avis). L'ancien `drainage-by-ami-80000-amiens` de la bio Instagram est à remplacer.
- Un visuel de la Fête des mères cite le **06 18 32 73 63** : est-ce un deuxième numéro de l'institut ? Le site n'affiche que le 06 23 08 10 54.
- Une adresse e-mail de contact, si elle souhaite en afficher une.
- Accès : interphone, code, ascenseur, stationnement conseillé (texte actuel volontairement simple).
- Jours fériés et congés à venir (`data/horaires.json` → `closures`).

## Cartes cadeaux

- Les cartes cadeaux s'achètent sur Planity (bouton « Offrir ») : y a-t-il aussi des cartes papier à l'institut ? Montants libres ?

## Photos

- Des photos **du lieu** (cabines, accueil, sauna dôme, bac du head spa, en lumière du jour) : il n'y en a aucune exploitable dans le lot Instagram.
- **Avant / après** : le site n'affiche que le ventre (sans visage). Les nombreux avant/après de visages publiés sur Instagram ne seront ajoutés qu'avec l'**accord écrit** de chaque cliente (`data/avant-apres.json`, `consent: true`).

## Logo

- Le fichier d'origine du logo (vectoriel si possible). Le site utilise une version redessinée d'après la photo de profil, sans le ruban d'Octobre rose.

## Mentions légales

- Raison sociale, forme juridique, **SIRET**, adresse du siège si différente.

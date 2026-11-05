// Classe les photos Instagram de The Body by Ami (assets/raw/) dans assets/<catégorie>/ avec des noms lisibles,
// puis les prépare pour le web dans public/media/<catégorie>/. next/image sert ensuite AVIF/WebP à la bonne taille.
//   npm run media
//
// 46 images regardées, 11 gardées. Écartées :
// - les avant / après de visages (05, 06, 08, 09, 15, 20, 23, 24, 26, 27, 28, 31, 36, 39) : pas d'accord écrit des
//   clientes pour le site ; prêtes à être ajoutées dans data/avant-apres.json dès l'accord obtenu ;
// - les visuels avec texte incrusté ou témoignages (13, 17, 22, 25, 40, 41, 42, 45) ;
// - les photos d'enfants (04, 11, 12) ;
// - les visuels qui ressemblent à de l'image de banque ou retouchée (19, 30, 33) ; 30 cite d'ailleurs un autre
//   numéro (06 18 32 73 63), à vérifier ;
// - les ambiances néon rose / rouge, peu lisibles (07, 32 gardée seule pour le sauna dôme, 43, 44), 03, 14, 18.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const raw = (n) => path.join(ROOT, "assets/raw", `body-by-ami_${n}.jpg`);

// [n° source, catégorie, nom, recadrage { top, bottom, left, right } en pixels retirés]
const PICKS = [
  // Photo en deux bandes : en bas, la peau qui brille juste après le soin
  ["10_Dc_qBh2xCHr", "hero", "soin-visage-peau-lumineuse", { top: 2120 }],
  // … et en haut, le visage pendant le soin
  ["10_Dc_qBh2xCHr", "visage", "face-pilates-pendant-le-soin", { bottom: 2080, top: 0 }],
  ["35_DXBUu_QiN_r", "visage", "soin-visage-allongee", {}],

  ["37_DWYbqEniFgz_video-cover", "corps", "drainage-lymphatique-mains", {}],
  ["32_DXr3_yUiLDn_video-cover", "corps", "sauna-dome-lumiere", {}],

  ["38_DWTLARnCIEO_video-cover", "head-spa", "rituel-head-spa-eau", {}],

  // Portrait d'Ami détouré sur le visuel « Elles, ils sont Amiens » (sans le texte ni les logos)
  ["29_DYU5oHsIZBi", "equipe", "ami-fondatrice", { top: 930, left: 0, right: 1330 }],

  ["02_C9aJKzDKeH4_video-cover", "presse", "ami-plateau-forbes", {}],
  ["01_DXletILCGLe", "presse", "vogue-article-facepilates", {}],

  // Avant / après sans visage (ventre), photo en deux bandes : haut = avant, bas = après.
  // La 21 (même principe) est écartée : la peau est rougie juste après la séance, ce n'est pas parlant.
  ["16_Dbq3quzxjjN", "avant-apres", "silhouette-avant", { bottom: 2048 }],
  ["16_Dbq3quzxjjN", "avant-apres", "silhouette-apres", { top: 2048 }],

  ["logo", "presse", "logo-instagram-octobre-rose", {}],
];

const sizes = {};
for (const [n, cat, name, c] of PICKS) {
  const file = raw(n);
  const meta = await sharp(file).metadata();
  const box = {
    left: c.left ?? 0,
    top: c.top ?? 0,
    width: meta.width - (c.left ?? 0) - (c.right ?? 0),
    height: meta.height - (c.top ?? 0) - (c.bottom ?? 0),
  };
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  const cropped = sharp(file).rotate().extract(box);
  await cropped.clone().jpeg({ quality: 92 }).toFile(path.join(ROOT, "assets", cat, `${name}.jpg`));
  if (name.startsWith("logo-")) continue; // gardé pour référence, pas publié
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  const max = cat === "hero" ? 2400 : 1600;
  const info = await cropped
    .clone()
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
}

// Dossiers prévus pour les photos à venir (lieu, équipe)
for (const dir of ["lieu", "equipe", "head-spa", "visage", "corps"]) await mkdir(path.join(ROOT, "assets", dir), { recursive: true });

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 2) + "\n");

// Image de partage (Open Graph) 1200 × 630
await sharp(path.join(ROOT, "public/media/hero/soin-visage-peau-lumineuse.jpg"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${Object.keys(sizes).length} photos prêtes`);

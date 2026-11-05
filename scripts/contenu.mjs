// Génère CONTENU.md : tous les textes du site en français et en anglais, la carte des soins, les programmes,
// les offres datées, pour relecture et validation par l'institut.   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const json = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));
const fr = await json("locales/fr.json");
const en = await json("locales/en.json");
const soins = await json("data/soins.json");
const progs = await json("data/programmes.json");
const offres = await json("data/offres.json");
const horaires = await json("data/horaires.json");
const equipe = await json("data/equipe.json");
const presse = await json("data/presse.json");
const site = await json("data/site.json");

const out = [];
const w = (s = "") => out.push(s);
const dur = (m) => (m == null ? "" : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${String(m % 60).padStart(2, "0")}` : ""}`);
const eur = (n) => (n == null ? "sur Planity" : `${n} €`);

w("# The Body by Ami : contenu du site");
w();
w("Tous les textes du site, en français et en anglais, pour relecture. Les corrections se font dans `locales/fr.json` et `locales/en.json` ; soins, prix, programmes, offres, horaires, équipe et presse dans `data/*.json`. Ce fichier se régénère avec `npm run contenu`.");
w();
w(`Prix et durées relevés sur Planity le 5 novembre 2026. Notes : ${site.ratings.google.value}/5 sur Google (${site.ratings.google.count} avis) et ${site.ratings.planity.value}/5 sur Planity (${site.ratings.planity.count} avis), relevées le ${site.ratings.google.asOf}. Les avis ne sont pas cités mot pour mot : le site reprend leurs thèmes.`);
w();
w("Voir aussi : [INFOS-A-DEMANDER.md](INFOS-A-DEMANDER.md) et [NOTE-FICHE-GOOGLE.md](NOTE-FICHE-GOOGLE.md).");
w();

w("## Soins et prix (`data/soins.json`)");
w();
for (const c of soins.categories) {
  w(`### ${c.name.fr} / ${c.name.en}`);
  w();
  w("| Soin | Durée | Prix |");
  w("|---|---|---|");
  for (const s of c.items) w(`| **${s.name.fr}**<br>*${s.name.en}*${s.note ? `<br>${s.note.fr}` : ""} | ${dur(s.duration) || "—"} | ${eur(s.price)} |`);
  w();
}

w("## Programmes (`data/programmes.json`)");
w();
w("| Programme | Durée | Séances | Inclus | Pour qui | Prix |");
w("|---|---|---|---|---|---|");
for (const p of progs.items) w(`| **${p.name.fr}**${p.compare ? "" : " (hors comparateur)"} | ${p.length.fr} | ${p.sessions ?? "fixées au bilan"} | ${p.includes.fr.join(" ; ")} | ${p.for.fr} | ${p.price} € |`);
w();
w("### Mariée");
w();
for (const b of progs.bridal) w(`- **${b.name.fr}** : ${b.length.fr}, ${b.price} €`);
w();

w("## Offres datées (`data/offres.json`)");
w();
for (const o of offres.items) {
  w(`**${o.title.fr}**, du ${o.from} au ${o.to} (bandeau : « ${o.text.fr} »)`);
  w();
  for (const it of o.list) w(`- ${it.name.fr} : ${it.price} €${it.was ? ` au lieu de ${it.was} €` : ""} (${dur(it.duration)})`);
  w();
}
w("La date de fin du 24 décembre 2026 est une hypothèse : **à confirmer**.");
w();

w("## Horaires (`data/horaires.json`)");
w();
const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
for (const d of [1, 2, 3, 4, 5, 6, 0]) {
  const r = horaires.week[String(d)];
  w(`- ${days[d]} : ${r ? r.map(([a, b]) => `${a} – ${b}`).join(", ") : "fermé"}`);
}
w();
w(horaires.closures.length ? `Fermetures exceptionnelles : ${horaires.closures.map((c) => `${c.label.fr} (${c.from} → ${c.to})`).join(", ")}.` : "Aucune fermeture exceptionnelle saisie (jours fériés, congés : à indiquer).");
w();

w("## Équipe (`data/equipe.json`)");
w();
w(`- **${equipe.founder.name}** : fondatrice`);
for (const m of equipe.members) w(`- **${m.name}** : ${m.role.fr}${m.confirmed ? "" : " (**rôle à confirmer**)"}`);
w();

w("## Presse et récompenses (`data/presse.json`)");
w();
for (const p of presse.items) w(`- **${p.name}**${p.year ? ` (${p.year})` : ""} : ${p.detail.fr}${p.verified ? "" : " (**preuve à fournir**)"}`);
w();

w("## Textes du site");
w();
w("Chaque ligne : clé, français, anglais. Les textes marqués **à valider** demandent une confirmation de l'institut.");
w();
const flags = {
  "team.founder.text": "à valider (parcours d'Ami, Face Pilates « développé par Ami »)",
  "academy": "à valider (contenu des formations)",
  "infos.accessText": "à valider (accès, interphone, stationnement)",
  "faq.items.1": "à valider (soins pendant la grossesse)",
  "faq.items.4": "à valider (cartes cadeaux)",
  "faq.items.5": "à valider (conditions d'annulation)",
  "reviews.themes": "à valider (thèmes repris des avis)",
  "rating.award": "à valider (« Meilleur concept esthétique 2026 » : organisateur ?)",
};
const flagOf = (key) => Object.entries(flags).find(([k]) => key === k || key.startsWith(`${k}.`))?.[1];

const SKIP = new Set(["alt", "days"]);
function walk(a, b, key = "") {
  if (typeof a === "string") {
    const f = flagOf(key);
    w(`| \`${key}\` | ${a.replace(/\n/g, "<br>").replace(/\|/g, "\\|")} | ${(b ?? "").replace(/\n/g, "<br>").replace(/\|/g, "\\|")} |${f ? ` **${f}** |` : " |"}`);
    return;
  }
  if (Array.isArray(a)) return a.forEach((x, i) => walk(x, b?.[i], `${key}.${i}`));
  for (const k of Object.keys(a)) walk(a[k], b?.[k], key ? `${key}.${k}` : k);
}
for (const section of Object.keys(fr)) {
  if (SKIP.has(section)) continue;
  w(`### ${section}`);
  w();
  w("| Clé | Français | English | |");
  w("|---|---|---|---|");
  walk(fr[section], en[section], section);
  w();
}

w("## Textes alternatifs des photos");
w();
w("| Photo | Français | English |");
w("|---|---|---|");
for (const k of Object.keys(fr.alt)) w(`| ${k} | ${fr.alt[k]} | ${en.alt[k]} |`);
w();

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n"));
console.log("CONTENU.md écrit");

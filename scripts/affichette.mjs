// Affichette A5 imprimable (PDF) avec QR code vers le site, à poser au salon ou en vitrine.
//   npm run affichette   →   public/affichette-the-body-by-ami-a5.pdf
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const url = `${site.url}/fr`;

const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const PAPER = hex("#FBF8F4");
const INK = hex("#2B2420");
const GOLD = hex("#85683A");
const MUTED = hex("#6F625A");
const LINE = hex("#E7DDD1");

const pdf = await PDFDocument.create();
pdf.setTitle("The Body by Ami : affichette A5");
pdf.setAuthor("The Body by Ami");
const W = 419.53;
const H = 595.28;
const page = pdf.addPage([W, H]);
const serif = await pdf.embedFont(StandardFonts.TimesRoman);
const serifI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
const sans = await pdf.embedFont(StandardFonts.Helvetica);

page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: PAPER });

// Photo du haut : le soin du visage, en bandeau
const photo = await sharp(path.join(ROOT, "public/media/visage/soin-visage-allongee.jpg")).resize(1200, 640, { fit: "cover", position: "centre" }).jpeg({ quality: 88 }).toBuffer();
const img = await pdf.embedJpg(photo);
const photoH = 232;
page.drawImage(img, { x: 0, y: H - photoH, width: W, height: photoH });

const center = (text, font, size, y, color = INK, spacing = 0) => {
  const width = font.widthOfTextAtSize(text, size) + spacing * (text.length - 1);
  if (!spacing) return page.drawText(text, { x: (W - width) / 2, y, size, font, color });
  let x = (W - width) / 2;
  for (const ch of text) {
    page.drawText(ch, { x, y, size, font, color });
    x += font.widthOfTextAtSize(ch, size) + spacing;
  }
};

// Logo : « THE BODY BY » / « AMI », la courbe dorée, « FACE · BODY · LONGEVITY »
let y = H - photoH - 34;
center("THE BODY BY", serif, 9.5, y, INK, 3.4);
y -= 30;
center("AMI", serif, 34, y, INK, 5.5);
page.drawSvgPath("M62 71C86 80 132 80 158 70", { x: W / 2 - 110 * 0.55, y: y + 33, scale: 0.55, borderColor: hex("#BFA06A"), borderWidth: 0.9 });
y -= 22;
center("FACE · BODY · LONGEVITY", sans, 6.4, y, MUTED, 1.9);

y -= 30;
center("Réservez votre soin en ligne", serif, 20, y);
y -= 18;
center("visage, drainage Renata França, head spa, programmes, Academy", serifI, 11.5, y, MUTED);

// QR code
const qrPng = await QRCode.toBuffer(url, { margin: 0, width: 600, color: { dark: "#2B2420", light: "#FBF8F4" }, errorCorrectionLevel: "M" });
const qr = await pdf.embedPng(qrPng);
const qrS = 96;
y -= 16 + qrS;
page.drawImage(qr, { x: (W - qrS) / 2, y, width: qrS, height: qrS });
y -= 15;
center(url.replace(/^https?:\/\//, ""), sans, 8.5, y, GOLD);

// Pied : infos pratiques
y -= 16;
page.drawLine({ start: { x: 60, y }, end: { x: W - 60, y }, thickness: 0.5, color: LINE });
y -= 16;
center(`${site.address.street}, 1er étage, ${site.address.postalCode} ${site.address.city}  ·  ${site.phone}`, sans, 8.2, y);
y -= 12.5;
center("Du lundi au vendredi 9 h – 19 h  ·  le samedi 10 h – 18 h", sans, 8.2, y);
y -= 12.5;
center(`${site.instagramHandle}  ·  4,9/5 sur Google  ·  5/5 sur Planity`, sans, 8.2, y, MUTED);

const file = path.join(ROOT, "public/affichette-the-body-by-ami-a5.pdf");
await writeFile(file, await pdf.save());
console.log("affichette prête :", url);

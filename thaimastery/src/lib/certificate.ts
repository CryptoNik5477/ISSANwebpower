// Printable PDF certificates generated with pdf-lib (pure JS, serverless-safe).

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  serial: string;
  issuedAt: Date;
  locale: string;
}

const STRINGS: Record<string, { heading: string; body: string; date: string; id: string; signed: string }> = {
  en: {
    heading: "Certificate of Achievement",
    body: "has successfully completed the course",
    date: "Date of issue",
    id: "Certificate ID",
    signed: "Director of Studies, ThaiMastery",
  },
  fr: {
    heading: "Certificat de Réussite",
    body: "a terminé avec succès le cours",
    date: "Date d'émission",
    id: "Identifiant du certificat",
    signed: "Directeur des études, ThaiMastery",
  },
  de: {
    heading: "Erfolgszertifikat",
    body: "hat den Kurs erfolgreich abgeschlossen",
    date: "Ausstellungsdatum",
    id: "Zertifikats-ID",
    signed: "Studienleitung, ThaiMastery",
  },
};

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const t = STRINGS[data.locale] ?? STRINGS.en;
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);

  const navy = rgb(0.08, 0.1, 0.18);
  const gold = rgb(0.96, 0.77, 0.19);

  // Background + double border
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.985, 0.975, 0.95) });
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: gold, borderWidth: 3 });
  page.drawRectangle({ x: 34, y: 34, width: width - 68, height: height - 68, borderColor: navy, borderWidth: 1 });

  const center = (text: string, font = serif, size = 16, y = 0, color = navy) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  center("ThaiMastery", serif, 26, height - 100, gold);
  center(t.heading, serif, 40, height - 165);
  center("· · ·", sans, 16, height - 195, gold);
  center(data.studentName, serifItalic, 34, height - 255);
  center(t.body, sans, 14, height - 295, rgb(0.35, 0.38, 0.45));
  center(data.courseTitle, serif, 24, height - 335);

  const dateStr = new Intl.DateTimeFormat(data.locale, { dateStyle: "long" }).format(data.issuedAt);
  center(`${t.date}: ${dateStr}`, sans, 12, 140, rgb(0.35, 0.38, 0.45));
  center(`${t.id}: ${data.serial}`, sans, 10, 120, rgb(0.55, 0.58, 0.65));

  // Signature line
  page.drawLine({ start: { x: width / 2 - 110, y: 90 }, end: { x: width / 2 + 110, y: 90 }, thickness: 1, color: navy });
  center(t.signed, sans, 10, 74, rgb(0.35, 0.38, 0.45));

  return doc.save();
}

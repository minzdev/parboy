import { jsPDF } from "jspdf";
import { profile, experience, education, certifications, techGroups, socials } from "./data";

/* CV format ATS: satu kolom, teks hitam semua, font standar, tanpa grafik. */
export function downloadCV(lang, t) {
  const id = lang !== "en";
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 15;
  const maxW = W - M * 2;
  const BLACK = [0, 0, 0];
  let y = M;

  const need = (h) => {
    if (y + h > 297 - M) {
      doc.addPage();
      y = M;
    }
  };
  const wrapped = (text, size) => {
    doc.setFontSize(size);
    return doc.splitTextToSize(text, maxW);
  };

  /* ---------- kepala ---------- */
  doc.setTextColor(...BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(profile.name.toUpperCase(), M, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(id ? "Web Developer & Analis Program" : "Web Developer & Program Analyst", M, y);
  y += 6;

  const wa = socials.find((s) => s.key === "wa")?.handle || "";
  const contact = [profile.email, wa, "github.com/minzdev", "linkedin.com/in/suparman0921", profile.location]
    .filter(Boolean)
    .join(" | ");
  doc.setFontSize(9);
  const contactLines = wrapped(contact, 9);
  doc.text(contactLines, M, y);
  y += contactLines.length * 4 + 3;

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 6;

  /* ---------- bagian ---------- */
  const section = (title) => {
    need(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), M, y);
    y += 2;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.line(M, y, W - M, y);
    y += 5;
  };
  const para = (text) => {
    const ls = wrapped(text, 10);
    need(ls.length * 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(ls, M, y);
    y += ls.length * 5 + 3;
  };

  section(t("cv.summary"));
  para(t("tentang.desc"));

  section(t("cv.exp"));
  experience.forEach((e, i) => {
    const bullets = id ? e.bullets : [0, 1, 2, 3].map((j) => t(`exp.${i}.b${j}`));
    need(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const titleLines = wrapped(e.title, 10.5);
    doc.text(titleLines, M, y);
    y += titleLines.length * 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const orgLines = wrapped(`${e.org} | ${e.date}`, 10);
    doc.text(orgLines, M, y);
    y += orgLines.length * 5 + 1;
    bullets.forEach((b) => {
      const ls = wrapped(`- ${b}`, 10);
      need(ls.length * 5);
      doc.text(ls, M, y);
      y += ls.length * 5;
    });
    y += 3;
  });

  section(t("cv.edu"));
  education.forEach((e) => {
    need(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(t("edu.0.title"), M, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const orgLines = wrapped(`${t("edu.0.org")} | ${e.date}`, 10);
    doc.text(orgLines, M, y);
    y += orgLines.length * 5 + 4;
  });

  section(t("cv.skills"));
  techGroups.forEach((g) => {
    const ls = wrapped(`${g.title}: ${g.items.join(", ")}`, 10);
    need(ls.length * 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(ls, M, y);
    y += ls.length * 5;
  });
  y += 2;

  section(t("cv.certs"));
  certifications.forEach((c) => {
    const ls = wrapped(`- ${c.title}, ${c.org}, ${c.year}`, 10);
    need(ls.length * 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(ls, M, y);
    y += ls.length * 5;
  });

  doc.save(id ? "CV-Suparman.pdf" : "CV-Suparman-EN.pdf");
}

import { jsPDF } from "jspdf";
import { profile, experience, education, certifications, techGroups, socials } from "./data";

/* Generator CV satu klik — isi selalu ikut data web + bahasa aktif. */
export function downloadCV(lang, t) {
  const id = lang !== "en";
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 15;
  const maxW = W - M * 2;
  const INK = [20, 20, 20];
  const MUTED = [110, 110, 110];
  const GOLD = [138, 109, 47];
  let y = M;

  const need = (h) => {
    if (y + h > 297 - M) {
      doc.addPage();
      y = M;
    }
  };
  const lines = (text, size) => {
    doc.setFontSize(size);
    return doc.splitTextToSize(text, maxW);
  };

  /* ---------- kepala ---------- */
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(profile.name, M, y);
  y += 7;
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(id ? "Web Developer & Analis Program" : "Web Developer & Program Analyst", M, y);
  y += 6;

  const wa = socials.find((s) => s.key === "wa")?.handle || "";
  const contact = [profile.email, wa, "github.com/minzdev", "linkedin.com/in/suparman0921", profile.location]
    .filter(Boolean)
    .join("  |  ");
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(lines(contact, 9), M, y);
  y += lines(contact, 9).length * 4 + 2;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 6;

  /* ---------- bagian ---------- */
  const section = (title) => {
    need(14);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, M, y);
    y += 2;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.line(M, y, M + 34, y);
    y += 5;
  };
  const para = (text) => {
    const ls = lines(text, 10);
    need(ls.length * 5);
    doc.setTextColor(...INK);
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
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(lines(e.title, 10.5), M, y);
    y += lines(e.title, 10.5).length * 5;
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(lines(`${e.org} - ${e.date}`, 9.5), M, y);
    y += lines(`${e.org} - ${e.date}`, 9.5).length * 4.5 + 1;
    doc.setTextColor(...INK);
    doc.setFontSize(10);
    bullets.forEach((b) => {
      const ls = lines(`- ${b}`, 10);
      need(ls.length * 5);
      doc.text(ls, M, y);
      y += ls.length * 5;
    });
    y += 3;
  });

  section(t("cv.edu"));
  education.forEach((e) => {
    need(12);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(t("edu.0.title"), M, y);
    y += 5;
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(lines(`${t("edu.0.org")} - ${e.date}`, 9.5), M, y);
    y += lines(`${t("edu.0.org")} - ${e.date}`, 9.5).length * 4.5 + 4;
  });

  section(t("cv.skills"));
  techGroups.forEach((g) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const head = `${g.title}: `;
    const headW = doc.getTextWidth(head);
    doc.setFont("helvetica", "normal");
    const rest = doc.splitTextToSize(g.items.join(", "), maxW - headW);
    need(rest.length * 5);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.text(head, M, y);
    doc.setFont("helvetica", "normal");
    doc.text(rest, M + headW, y);
    y += rest.length * 5;
  });
  y += 2;

  section(t("cv.certs"));
  certifications.forEach((c) => {
    const ls = lines(`- ${c.title} - ${c.org} (${c.year})`, 10);
    need(ls.length * 5);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(ls, M, y);
    y += ls.length * 5;
  });

  doc.save(id ? "CV-Suparman.pdf" : "CV-Suparman-EN.pdf");
}

/* Otak chatbot: cocokkan kata kunci -> jawaban. Tanpa API, tanpa biaya. */

const RULES = [
  {
    keywords: ["halo", "hai", " hi", "hello", "pagi", "siang", "sore", "malam", "assalamu", "hey", "hei", "tes", "test", "p ", "bang"],
    id: "Halo juga! Mau tahu apa soal Suparman? Coba tanya soal pengalaman, proyek, jasa, atau kontak.",
    en: "Hi there! What do you want to know about Suparman? Try asking about experience, projects, services, or contact.",
  },
  {
    keywords: ["siapa", "tentang", "suparman", "profil", "profile", "who", "about", "kenal", "bio", "biodata"],
    id: "Suparman itu Web Developer & Analis Program dari Jakarta. Lulusan S1 TI, dulunya pegang finance, pajak, dan IT support. Lengkapnya ada di menu Tentang.",
    en: "Suparman is a Web Developer & Program Analyst from Jakarta. An IT graduate who used to handle finance, tax, and IT support. More on the About page.",
  },
  {
    keywords: ["skill", "keahlian", "bisa apa", "tech", "teknologi", "stack", "kuasai", "mampu", "bahasa pemrogram", "framework", "pakai apa"],
    id: "Dia biasa pakai JavaScript, React, Node.js, Laravel, MySQL, Firebase, sama Tailwind. Daftar lengkapnya di menu Keahlian.",
    en: "He usually works with JavaScript, React, Node.js, Laravel, MySQL, Firebase, and Tailwind. Full list on the Skills page.",
  },
  {
    keywords: ["pengalaman", "kerja", "experience", "pernah kerja", "riwayat", "career", "karir", "kantor", "bpsdm", "magang", "job"],
    id: "Terakhir di Sekretariat BPSDM Perhubungan (bidang perencanaan), sebelumnya ikut Coding Camp Dicoding x DBS, staff finance + IT di PT Magati Unggul, dan hardware engineer. Cek menu Pengalaman.",
    en: "Latest at the BPSDM Perhubungan Secretariat (planning division), previously a Dicoding x DBS Coding Camp, finance + IT staff at PT Magati Unggul, and hardware engineer. See the Experience page.",
  },
  {
    keywords: ["pendidikan", "kuliah", "sekolah", "universitas", "kampus", " ipk", "gpa", "education", "degree", "lulus", "sarjana"],
    id: "S1 Teknologi Informasi, Universitas Bina Sarana Informatika, IPK 3.83. Ada di menu Pengalaman bagian Pendidikan.",
    en: "B.Sc. in Information Technology, Bina Sarana Informatika University, GPA 3.83. On the Experience page under Education.",
  },
  {
    keywords: ["proyek", "project", "portfolio", "portofolio", "karya", "hasil", "pernah buat", "bikin apa", "aplikasi", "website", "web apa"],
    id: "Ada 6 yang live, misalnya MyEkonomi (catat keuangan), 7KCOM (database game), dan Moco Mochi (web UMKM). Lihat semua di menu Proyek.",
    en: "6 live ones, e.g. MyEkonomi (finance tracker), 7KCOM (game database), and Moco Mochi (SME site). See them all on the Projects page.",
  },
  {
    keywords: ["jasa", "layanan", "service", "bikin web", "buat web", "harga", "biaya", "rate", "order", "pesan", "hire", "rekrut", "freelance", "gaji"],
    id: "Dia bisa bikin company profile, sistem informasi, web UMKM, sampai maintenance. Estimasi dibahas di awal. Langsung isi form di menu Kontak aja.",
    en: "He builds company profiles, information systems, SME sites, and maintenance. Estimates are agreed up front. Just fill the form on the Contact page.",
  },
  {
    keywords: ["kontak", "hubungi", "contact", "email", " wa", "whatsapp", "linkedin", "telepon", "phone", "nomor", "number", "call"],
    id: "Bisa lewat WhatsApp 0857-9752-2591 atau email suparman0921@gmail.com. Atau isi form di menu Kontak, dibalas maksimal 1x24 jam.",
    en: "Reach him on WhatsApp 0857-9752-2591 or email suparman0921@gmail.com. Or fill the Contact form, replies within 24 hours.",
  },
  {
    keywords: ["cv", "resume", "unduh", "download", "curriculum"],
    id: "CV-nya bisa diunduh di halaman Tentang, tombol Unduh CV. Isinya ikut bahasa yang aktif.",
    en: "His CV is downloadable on the About page, Download CV button. Content follows the active language.",
  },
  {
    keywords: ["github", "aktivitas", "activity", "kontribusi", "contribution", "minzdev", "ngoding", "coding"],
    id: "Akun GitHub-nya @minzdev. Kalender kontribusinya ada di menu Aktivitas.",
    en: "His GitHub is @minzdev. The contribution calendar is on the Activity page.",
  },
  {
    keywords: ["sertifikat", "sertifikasi", "certificate", "certification", "bnsp"],
    id: "Punya beberapa, misalnya BNSP Analis Program dan Junior Web Developer. Semua bisa dicek di menu Sertifikasi.",
    en: "He holds several, e.g. BNSP Program Analyst and Junior Web Developer. All verifiable on the Certifications page.",
  },
  {
    keywords: ["makasih", "terima kasih", "thanks", "thank you", "oke", " ok", "sip", "mantap", "keren", "bagus"],
    id: "Sama-sama! Kalau masih ada yang mau ditanya, silakan.",
    en: "You're welcome! If there's anything else, just ask.",
  },
  {
    keywords: ["dadah", "bye", "sampai jumpa", "see you", "selamat tinggal"],
    id: "Dadah! Sukses buat harimu.",
    en: "Bye! Have a great day.",
  },
];

const FALLBACK = {
  id: "Hmm, saya cuma tahu soal Suparman: keahlian, pengalaman, proyek, jasa, atau kontak. Coba tanya salah satunya?",
  en: "Hmm, I only know about Suparman: skills, experience, projects, services, or contact. Try asking one of those?",
};

export function getReply(input, lang) {
  const text = ` ${String(input || "").toLowerCase()} `;
  let best = null;
  let bestScore = 0;
  for (const r of RULES) {
    let s = 0;
    for (const k of r.keywords) {
      if (text.includes(k)) s += k.trim().length > 4 ? 2 : 1;
    }
    if (s > bestScore) {
      bestScore = s;
      best = r;
    }
  }
  if (!best) return FALLBACK[lang === "en" ? "en" : "id"];
  return best[lang === "en" ? "en" : "id"];
}

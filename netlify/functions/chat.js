/* Netlify Function: proxy aman ke Gemini. Kunci API hanya hidup di server. */

const STATIC_MODELS = [process.env.GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash"].filter(Boolean);

/* tanya ke Google: model apa saja yang masih hidup untuk kunci ini */
async function pickModel(key) {
  for (const ver of ["v1beta", "v1"]) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/${ver}/models`, {
        headers: { "x-goog-api-key": key },
      });
      if (!r.ok) {
        console.log(`chat: daftar model ${ver} gagal (${r.status})`);
        continue;
      }
      const j = await r.json();
      const ms = (j.models || []).filter((m) =>
        (m.supportedGenerationMethods || []).includes("generateContent")
      );
      const pick = ms.find((m) => /flash/i.test(m.name)) || ms[0];
      const name = (pick?.name || "").replace(/^models\//, "");
      if (name) {
        console.log(`chat: pakai model ${name}`);
        return name;
      }
      return null;
    } catch {
      continue;
    }
  }
  return null;
}

const SYSTEM = `Kamu Asisten Parboy, asisten virtual di website portfolio Suparman (parboy.my.id). Jawab SELALU dalam bahasa Indonesia kecuali user jelas memakai bahasa Inggris.

FAKTA (jangan ngarang di luar ini):
- Suparman: Web Developer & Analis Program, Jakarta, Indonesia.
- Kontak: WhatsApp 0857-9752-2591, email suparman0921@gmail.com, GitHub @minzdev (github.com/minzdev), LinkedIn linkedin.com/in/suparman0921.
- Pendidikan: S1 Teknologi Informasi, Universitas Bina Sarana Informatika, IPK 3.83/4.0.
- Pengalaman: (1) Penata Kelola Sistem dan TI, Bidang Perencanaan, Sekretariat BPSDM Perhubungan - Kementerian Perhubungan, Agu 2026-Feb 2027. (2) Back End & Front End Developer, Dicoding x DBS Foundation, Feb-Jul 2025. (3) Staff Finance & IT Support, PT Magati Unggul, 2021-Agu 2024. (4) Hardware & System Engineer, CV Salafindo, 2018.
- Proyek live: MyEkonomi - Personal Money Tracker (myekonomi.netlify.app/login); 7KCOM - database counter game Seven Knights (7kcom.netlify.app); Moco Mochi Bread Solo - web UMKM roti (mocomochi.netlify.app); Giarva E-Commerce susu etawa (Midtrans); Company Profile PT Gedhong Kencono Mulyo; Company Profile PT Magati Unggul.
- Keahlian: JavaScript, React, Node.js, Laravel, MySQL, Firebase, Tailwind CSS, Framer Motion, REST API; juga pajak (e-Faktur, PPh 21/23, PPN), administrasi, hardware.
- Jasa: company profile, sistem informasi, web UMKM, maintenance. Estimasi dibahas di awal.
- Sertifikasi: BNSP Analis Program, BNSP Junior Web Developer, Coding Camp Dicoding x DBS 2025, selengkapnya di halaman Sertifikasi.
- CV bisa diunduh di halaman Tentang.
- Form kontak di web dibalas maksimal 1x24 jam.

ATURAN:
- Maksimal 4 kalimat pendek per jawaban. Santai, seperti orang Indonesia ngobrol. Tanpa tanda —.
- Kalau ditanya yang TIDAK ada di fakta (misal usia, alamat rumah, gaji, resep masakan, tugas sekolah): JUJUR bilang tidak tahu / bukan tugasmu, lalu arahkan balik ke topik portfolio atau kontak langsung.
- Jangan pernah mengarang angka, tanggal, atau fakta.
- Jangan sebut kamu AI buatan siapa pun selain "asisten virtual di web ini".`;

const cors = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return cors(200, "{}");
  if (event.httpMethod !== "POST") return cors(405, { error: "method" });

  const key = (process.env.GEMINI_API_KEY || "").trim();
  if (!key) return cors(500, { error: "no-key" });

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return cors(400, { error: "bad-request" });
  }
  const history = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const contents = history
    .filter((m) => m && (m.role === "user" || m.role === "bot") && String(m.text || "").trim())
    .map((m) => ({
      role: m.role === "bot" ? "model" : "user",
      parts: [{ text: String(m.text).slice(0, 1000) }],
    }));
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    return cors(400, { error: "bad-request" });
  }

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM }] },
    contents,
    generationConfig: { maxOutputTokens: 350, temperature: 0.7 },
  };

  let lastErr = "ai-fail";
  const discovered = await pickModel(key);
  const MODELS = [...new Set([discovered, ...STATIC_MODELS].filter(Boolean))];
  const VERSIONS = ["v1beta", "v1"];
  let stop = false;
  for (const model of MODELS) {
    if (stop) break;
    for (const ver of VERSIONS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": key },
            body: JSON.stringify(payload),
          }
        );
        const j = await res.json().catch(() => ({}));
        if (res.status === 404) {
          console.log(`chat: ${ver}/${model} tidak ada (404)`);
          continue; // coba versi / model berikutnya
        }
        if (!res.ok) {
          const detail = JSON.stringify(j).slice(0, 300);
          console.log(`chat: Google menolak (${res.status}): ${detail}`);
          if (res.status === 429) {
            lastErr = "quota";
          } else if (res.status === 400 || res.status === 403 || /API_KEY_INVALID|API key not valid/i.test(detail)) {
            lastErr = "bad-key";
          } else {
            lastErr = "ai-fail";
          }
          stop = true;
          break;
        }
        const reply = j.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
        if (reply) {
          console.log("chat: OK");
          return cors(200, { reply });
        }
        lastErr = "ai-fail";
        stop = true;
        break;
      } catch {
        lastErr = "ai-fail";
        stop = true;
        break;
      }
    }
  }
  return cors(502, { error: lastErr });
}

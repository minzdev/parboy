import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home, User, FlaskConical, GraduationCap, Briefcase, Mail,
  ArrowUpRight, Braces, CalendarDays, Code2, BadgeCheck, Award,
  Palette, Clapperboard, FileSpreadsheet, ReceiptText, Landmark,
  Wallet, ShieldCheck, Cpu, Wrench, Network, FileText,
  Activity,
} from "lucide-react";
import {
  SiJavascript, SiReact, SiNodedotjs, SiLaravel, SiMysql, SiFirebase,
  SiTailwindcss, SiFramer, SiAndroid, SiExpo, SiGooglesheets,
  SiGithub, SiWhatsapp, SiGmail,
} from "react-icons/si";
import { LinkedinBrand } from "./components/Shell";
import {
  profile, stats, techGroups, services, works,
  experience, education, certifications, socials,
} from "./data";
import { useLang } from "./i18n";

const ease = [0.22, 1, 0.36, 1];

function Page({ children }) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.18, ease: "easeIn" } }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}

function useMenu() {
  const { t } = useLang();
  return [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.about"), href: "/tentang", icon: User },
    { label: t("nav.exp"), href: "/pengalaman", icon: Briefcase },
    { label: t("nav.skills"), href: "/keahlian", icon: Code2 },
    { label: t("nav.projects"), href: "/proyek", icon: FlaskConical },
    { label: t("nav.activity"), href: "/aktivitas", icon: Activity },
    { label: t("nav.certs"), href: "/sertifikasi", icon: BadgeCheck },
    { label: t("nav.contact"), href: "/kontak", icon: Mail },
  ];
}

const socialIcons = {
  github: { Icon: SiGithub },
  linkedin: { Icon: LinkedinBrand, color: "#0A66C2" },
  wa: { Icon: SiWhatsapp, color: "#25D366" },
  mail: { Icon: SiGmail, color: "#EA4335" },
};

/* ikon brand tiap teknologi — warna asli, nama muncul saat hover.
   Logo yang aslinya hitam dibiarkan adaptif agar tidak hilang. */
const TECH_ICONS = {
  "JavaScript (ES6+)": { Icon: SiJavascript, color: "#F7DF1E" },
  "React.js": { Icon: SiReact, color: "#61DAFB" },
  "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  "Laravel": { Icon: SiLaravel, color: "#FF2D20" },
  "MySQL": { Icon: SiMysql, color: "#4479A1" },
  "Firebase": { Icon: SiFirebase, color: "#DD2C00" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },
  "Framer Motion": { Icon: SiFramer, color: "#0055FF" },
  "RESTful API": { Icon: Braces, gold: true },
  "Android Development (React Native)": { Icon: SiAndroid, color: "#3DDC84" },
  "Expo": { Icon: SiExpo },
  "Accounting": { Icon: SiGooglesheets, color: "#34A853" },
  "Manajemen e-Faktur": { Icon: ReceiptText, color: "#16A34A" },
  "e-Bupot": { Icon: ReceiptText, color: "#16A34A" },
  "Coretax": { Icon: Landmark, color: "#2563EB" },
  "Pelaporan PPh 21": { Icon: FileText, color: "#D97706" },
  "Pelaporan PPh 23": { Icon: FileText, color: "#D97706" },
  "Pelaporan PPN": { Icon: FileText, color: "#D97706" },
  "Pelaporan PPh Badan": { Icon: FileText, color: "#D97706" },
  "Cash Management (Internet Banking)": { Icon: Wallet, color: "#2563EB" },
  "Administrasi BPJS Kesehatan": { Icon: ShieldCheck, color: "#7C3AED" },
  "Administrasi BPJS Ketenagakerjaan": { Icon: ShieldCheck, color: "#7C3AED" },
  "Microsoft Office (Excel, Word, Power Point)": { Icon: FileSpreadsheet, color: "#D83B01" },
  "Creative Design (Canva)": { Icon: Palette, color: "#00C4CC" },
  "Video Editing (CapCut)": { Icon: Clapperboard, color: "#F43F5E" },
  "Perakitan Komputer (PC Assembling)": { Icon: Cpu, color: "#64748B" },
  "Troubleshooting Perangkat Keras": { Icon: Wrench, color: "#78716C" },
  "Konfigurasi Jaringan/OS": { Icon: Network, color: "#0EA5E9" },
};

/* ================= BERANDA ================= */
export function HomePage() {
  const { pathname } = useLocation();
  const { t } = useLang();
  const items = useMenu().filter((m) => m.href !== "/sertifikasi" && m.href !== "/kontak");
  const rowRef = useRef(null);
  const [edge, setEdge] = useState({ l: false, r: false });

  /* pil aktif selalu terlihat + fade tepi hanya saat bisa digeser */
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const upd = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdge({ l: el.scrollLeft > 4, r: el.scrollLeft < max - 4 });
    };
    upd();
    el.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
    el.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => { el.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, [pathname]);
  return (
    <Page>
      {/* status */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
        <p className="mb-3 inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted dark:text-[#a3a3a3]">
          <span className="h-[6px] w-[6px] flex-none animate-pulse rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          {t("ui.status")}
        </p>
        <h1 className="mb-3 text-[22px] font-bold leading-[1.5] text-ink md:text-[30px] dark:text-white">
          {profile.role} &amp; {t("home.role2")}
        </h1>
        <p className="text-[15px] leading-7 text-muted sm:text-base sm:leading-8 dark:text-[#b5b5b5]">
          {t("home.hello")} {profile.name}. {t("home.bio")}
        </p>
      </motion.div>

      {/* sosial */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="mt-4 flex gap-4"
      >
        {socials.map((s) => {
          const entry = socialIcons[s.key] ?? {};
          const Icon = entry.Icon ?? ArrowUpRight;
          return (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                style={entry.color ? { color: entry.color } : undefined}
                className={`inline-flex p-1.5 text-[20px] transition-all duration-150 hover:-translate-y-0.5 active:scale-95 ${
                  entry.color ? "" : "text-muted hover:text-primary dark:text-[#8a8a8a]"
                }`}
              >
                <Icon size={21} />
              </a>
            </li>
          );
        })}
      </motion.ul>

      <hr className="my-6 max-w-[70px] border-line dark:border-[#262626]" />

      {/* menu pil — satu baris kompak, geser halus bila overflow */}
      <nav aria-label="Menu utama" className="relative">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#f4f6f9] to-transparent transition-opacity dark:from-[#0b0b0b] ${edge.l ? "opacity-100" : "opacity-0"}`}
        />
        <ul ref={rowRef} className="no-scrollbar flex flex-nowrap gap-1.5 overflow-x-auto px-0.5 pb-1 pt-0.5">
          {items.map((m, i) => {
            const active = pathname === m.href;
            const Icon = m.icon;
            const inner = (
              <>
                <Icon size={14} className="flex-none" />
                <span className="whitespace-nowrap">{m.label}</span>
              </>
            );
            const cls = `flex items-center gap-1.5 rounded-lg border px-2.5 py-[7px] text-[12px] font-medium transition-all duration-150 hover:-translate-y-0.5 ${
              active
                ? "border-primary bg-primary text-[#1c1508] shadow-lg shadow-primary/25"
                : "border-line bg-surface text-muted hover:border-primary/50 hover:text-ink dark:border-[#262626] dark:bg-[#151515] dark:text-[#b5b5b5] dark:hover:text-white"
            }`;
            return (
              <motion.li
                key={m.href}
                className="flex-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + i * 0.04, ease }}
              >
                {active ? (
                  <span className={cls} aria-current="page">{inner}</span>
                ) : (
                  <Link to={m.href} className={cls}>{inner}</Link>
                )}
              </motion.li>
            );
          })}
        </ul>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#f4f6f9] to-transparent transition-opacity dark:from-[#0b0b0b] ${edge.r ? "opacity-100" : "opacity-0"}`}
        />
      </nav>
    </Page>
  );
}

/* ================= KEPALA SUB-HALAMAN ================= */
function SubHead({ no, title, desc }) {
  return (
    <div className="mb-7">
      <p className="font-fira text-[11px] uppercase tracking-[0.18em] text-primary">{no}</p>
      <h1 className="mt-2 text-[24px] font-bold leading-tight text-ink md:text-[28px] dark:text-white">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-[14.5px] leading-7 text-muted dark:text-[#b5b5b5]">{desc}</p>}
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const card = "rounded-2xl border border-line bg-surface p-5 sm:p-6 dark:border-[#262626] dark:bg-[#151515]";

/* kartu riwayat: ikon + judul + org + tanggal + bullet/deskripsi */
function TimelineCard({ icon: Icon, date, title, org, desc, bullets, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className={card}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-line bg-background text-muted dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-[#b5b5b5]">
              <Icon size={19} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[16.5px] font-bold leading-snug text-ink dark:text-white">{title}</h3>
              <p className="text-[13.5px] font-medium text-primary">{org}</p>
            </div>
          </div>
          <p className="flex flex-none items-center gap-1.5 pt-1 font-fira text-[11.5px] text-muted dark:text-[#8a8a8a]">
            <CalendarDays size={14} /> {date}
          </p>
        </div>
        {bullets ? (
          <ul className="mt-4 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-[14px] leading-7 text-muted dark:text-[#b5b5b5]">
                <span className="mt-[11px] h-1 w-1 flex-none rounded-full bg-primary" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
              ) : desc ? (
                <p className="mt-2 text-[14px] leading-7 text-muted dark:text-[#b5b5b5]">{desc}</p>
              ) : null}
      </div>
    </Reveal>
  );
}

/* ================= TENTANG ================= */
export function TentangPage() {
  const { t } = useLang();
  return (
    <Page>
      <SubHead no={t("tentang.no")} title={t("tentang.title")} desc={t("tentang.desc")} />
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <div className={`${card} p-3 text-center sm:p-5`}>
              <p className="text-[22px] font-extrabold tracking-tight text-ink sm:text-[26px] dark:text-white">{s.value}</p>
              <p className="mx-auto mt-1 whitespace-pre-line text-[10px] font-semibold uppercase tracking-[0.06em] text-muted sm:max-w-[120px] sm:text-[11px] sm:tracking-[0.08em] dark:text-[#8a8a8a]">{t(`stats.${i}`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.05}>
        <div className={`${card} mt-4`}>
          <p className="font-fira text-[11px] uppercase tracking-[0.18em] text-primary">{t("daily.title")}</p>
          <ul className="mt-3 space-y-2.5 text-[14.5px] leading-7 text-ink dark:text-[#d4d4d4]">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex gap-3"><span className="text-primary">—</span>{t(`daily.${i}`)}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Page>
  );
}

/* ================= PENGALAMAN & PENDIDIKAN ================= */
export function PengalamanPage() {
  const { t, lang } = useLang();
  return (
    <Page>
      <SubHead no={t("kred.no")} title={t("kred.title")} desc={t("kred.desc")} />
      {/* grup: pengalaman kerja */}
      <Reveal>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-primary dark:border-[#2c2c2c] dark:bg-[#151515]">
            <Briefcase size={15} />
          </span>
          <h2 className="text-[15px] font-bold tracking-tight text-ink dark:text-white">{t("kred.expTitle")}</h2>
          <span className="rounded-full bg-tint px-2 py-0.5 font-fira text-[11px] text-hover dark:bg-[#241c10] dark:text-[#d8bc7f]">
            {experience.length}
          </span>
          <span className="ml-1 h-px flex-1 bg-line dark:bg-[#232323]" aria-hidden="true" />
        </div>
      </Reveal>
      <div className="space-y-4">
        {experience.map((e, i) => (
          <TimelineCard
            key={e.title}
            icon={Briefcase}
            date={e.date}
            title={e.title}
            org={e.org}
            bullets={lang === "en" ? [0, 1, 2, 3].map((j) => t(`exp.${i}.b${j}`)) : e.bullets}
            delay={i * 0.05}
          />
        ))}
      </div>

      {/* grup: pendidikan — digabung agar tidak ada halaman sepi satu kartu */}
      <Reveal>
        <div className="mb-3 mt-10 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-primary dark:border-[#2c2c2c] dark:bg-[#151515]">
            <GraduationCap size={16} />
          </span>
          <h2 className="text-[15px] font-bold tracking-tight text-ink dark:text-white">{t("kred.eduTitle")}</h2>
          <span className="rounded-full bg-tint px-2 py-0.5 font-fira text-[11px] text-hover dark:bg-[#241c10] dark:text-[#d8bc7f]">
            {education.length}
          </span>
          <span className="ml-1 h-px flex-1 bg-line dark:bg-[#232323]" aria-hidden="true" />
        </div>
      </Reveal>
      <div className="space-y-4">
        {education.map((e, i) => (
          <TimelineCard
            key={e.title}
            icon={GraduationCap}
            date={e.date}
            title={t("edu.0.title")}
            org={t("edu.0.org")}
            delay={i * 0.05}
          />
        ))}
      </div>
    </Page>
  );
}

/* ================= SERTIFIKASI ================= */
export function SertifikasiPage() {
  const { t } = useLang();
  return (
    <Page>
      <SubHead no={t("certs.no")} title={t("certs.title")} desc={t("certs.desc")} />
      <Reveal>
        <div className="overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_24px_50px_-40px_rgba(28,21,8,0.45)] dark:border-[#262626] dark:bg-[#151515]">
          {certifications.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3), ease }}
              className="group flex items-center gap-3 border-b border-line px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 transition-colors last:border-b-0 hover:bg-background dark:border-[#232323] dark:hover:bg-[#101010]"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl border sm:h-12 sm:w-12 sm:rounded-2xl border-line bg-background text-muted transition-colors group-hover:border-primary/50 group-hover:text-primary dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-[#b5b5b5]">
                <Award size={18} className="sm:hidden" aria-hidden="true" />
                <Award size={20} className="hidden sm:block" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold leading-snug tracking-tight text-ink sm:text-[16px] dark:text-white">{c.title}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted dark:text-[#8a8a8a]">
                  <span>@ {c.org}</span>
                  <span className="inline-flex flex-none items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-px font-fira text-[11px] text-primary">
                    <CalendarDays size={11} /> {c.year}
                  </span>
                </span>
              </span>
              <ArrowUpRight size={18} className="flex-none text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary dark:text-[#5a5a5a]" />
            </motion.a>
          ))}
        </div>
      </Reveal>
    </Page>
  );
}

/* ================= KEAHLIAN ================= */
export function KeahlianPage() {
  const { t } = useLang();
  return (
    <Page>
      <SubHead no={t("skills.no")} title={t("skills.title")} desc={t("skills.desc")} />
      <div className="space-y-7">
        {techGroups.map((g, i) => (
          <Reveal key={g.title} delay={Math.min(i * 0.04, 0.2)}>
            <p className="font-fira text-[11px] font-medium uppercase tracking-[0.18em] text-muted dark:text-[#8a8a8a]">{g.title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((item) => {
                const entry = TECH_ICONS[item] ?? { Icon: Braces };
                const Icon = entry.Icon;
                return (
                  <span
                    key={item}
                    style={entry.color ? { color: entry.color } : undefined}
                    className={`inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-tint dark:border-[#262626] dark:bg-[#151515] dark:hover:bg-[#1a1611] ${
                      entry.color ? "text-ink dark:text-white" : entry.gold ? "text-primary" : "text-ink/70 dark:text-white/70"
                    }`}
                  >
                    <Icon size={16} className="flex-none" />
                    {item}
                  </span>
                );
              })}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-[19px] font-bold text-ink dark:text-white">{t("layanan.title")}</h2>
        <p className="mt-1.5 text-[14px] leading-7 text-muted dark:text-[#b5b5b5]">{t("layanan.desc")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 0.05, 0.15)}>
              <div className={`${card} h-full transition-transform duration-150 hover:-translate-y-0.5`}>
                <p className="font-fira text-[11px] text-primary">0{i + 1}</p>
                <h3 className="mt-1.5 text-[17px] font-bold text-ink dark:text-white">{t(`svc.${i}.title`)}</h3>
                <p className="mt-1.5 text-[14px] leading-7 text-muted dark:text-[#b5b5b5]">{t(`svc.${i}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* ================= PROYEK ================= */
export function ProyekPage() {
  const { t } = useLang();
  return (
    <Page>
      <SubHead no={t("karya.no")} title={t("karya.title")} desc={t("karya.desc")} />
      <div className="grid gap-4 sm:grid-cols-2">
        {works.map((w, i) => (
          <Reveal key={w.title} delay={Math.min(i * 0.05, 0.15)}>
            <article className={`${card} group flex h-full flex-col transition-transform duration-150 hover:-translate-y-0.5`}>
              <p className="font-fira text-[11px] uppercase tracking-[0.14em] text-primary">{w.year} · {t(`works.${i}.cat`)}</p>
              <h3 className="mt-2 text-[18px] font-bold text-ink dark:text-white">{w.title}</h3>
              <p className="mt-1.5 flex-1 text-[14px] leading-7 text-muted dark:text-[#b5b5b5]">{t(`works.${i}.desc`)}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {w.stack.map((s) => (
                  <span key={s} className="rounded-full bg-tint px-2.5 py-1 font-fira text-[11px] text-hover dark:bg-[#241c10] dark:text-[#d8bc7f]">{s}</span>
                ))}
              </div>
              <a
                href={w.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-[13.5px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-[#1c1508] dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-[#1c1508]"
              >
                {t("works.visit")} <ArrowUpRight size={16} />
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </Page>
  );
}

/* ================= AKTIVITAS GITHUB (mirip profil GitHub) ================= */
const GH_LEVEL = [
  "bg-[#ebedf0] dark:bg-[#161b22]",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
];

function toWeeks(days) {
  if (!days?.length) return [];
  const firstDow = new Date(`${days[0].date}T00:00:00`).getDay(); // 0=Min
  const cells = [...Array(firstDow).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function monthLabels(weeks, lang) {
  const fmt = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "id-ID", { month: "short" });
  const labels = [];
  let prev = -1;
  weeks.forEach((w) => {
    const day = w.find(Boolean);
    const m = day ? new Date(`${day.date}T00:00:00`).getMonth() : prev;
    labels.push(m !== prev ? fmt.format(new Date(2026, m, 1)) : "");
    if (m !== prev) prev = m;
  });
  return labels;
}

export function ActivityPage() {
  const { t, lang } = useLang();
  const username = profile.github || "minzdev";
  const thisYear = new Date().getFullYear();
  const [user, setUser] = useState(null);
  const [year, setYear] = useState(thisYear);
  const [days, setDays] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calLoading, setCalLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /* profil ringkas untuk 3 stat */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`https://api.github.com/users/${username}`);
        if (!r.ok) throw new Error("gh");
        const u = await r.json();
        if (alive) {
          setUser(u);
          const since = new Date(u.created_at).getFullYear() || thisYear - 4;
          if (year < since || year > thisYear) setYear(thisYear);
        }
      } catch { /* stat tetap tampil strip */ }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  /* kalender kontribusi per tahun */
  useEffect(() => {
    let alive = true;
    setCalLoading(true);
    setFailed(false);
    (async () => {
      try {
        const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);
        if (!r.ok) throw new Error("cal");
        const j = await r.json();
        const list = j.contributions || [];
        const tot = j.total?.[String(year)] ?? list.reduce((a, d) => a + (d.count || 0), 0);
        if (alive) {
          setDays(list);
          setTotal(tot);
        }
      } catch {
        if (alive) { setFailed(true); setDays([]); }
      } finally {
        if (alive) setCalLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [username, year]);

  const sinceYear = user?.created_at ? new Date(user.created_at).getFullYear() : thisYear - 4;
  const years = Array.from({ length: thisYear - sinceYear + 1 }, (_, i) => thisYear - i);
  const weeks = toWeeks(days);
  const months = monthLabels(weeks, lang);

  const stats = [
    { label: t("act.repos"), value: loading ? "…" : (user?.public_repos ?? "—") },
    { label: t("act.followers"), value: loading ? "…" : (user?.followers ?? "—") },
    { label: t("act.following"), value: loading ? "…" : (user?.following ?? "—") },
  ];

  return (
    <Page>
      <SubHead no={t("act.no")} title={t("act.title")} desc={t("act.desc")} />

      {/* ringkasan akun */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <div className={`${card} p-3 text-center sm:p-5`}>
              <p className="text-[22px] font-extrabold tracking-tight text-ink sm:text-[26px] dark:text-white">{s.value}</p>
              <p className="mx-auto mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted sm:text-[11px] sm:tracking-[0.08em] dark:text-[#8a8a8a]">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* kalender ala GitHub */}
      <Reveal delay={0.05}>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className={`${card} min-w-0 flex-1 !p-4 sm:!p-5`}>
            <p className="text-[15px] text-ink dark:text-white">
              {calLoading ? "…" : (total ?? 0)} {t("act.contrib")} {year}
            </p>
            <div className="no-scrollbar mt-3 overflow-x-auto rounded-lg border border-line p-3 dark:border-[#30363d]">
              {calLoading ? (
                <div className="flex gap-[3px]" aria-hidden="true">
                  {Array.from({ length: 40 }, (_, i) => (
                    <div key={i} className="flex flex-col gap-[3px]">
                      {Array.from({ length: 7 }, (_, j) => (
                        <span key={j} className="h-[10px] w-[10px] animate-pulse rounded-[2px] bg-line dark:bg-[#21262d]" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : failed ? (
                <div className="py-6 text-center">
                  <p className="text-[13.5px] text-muted dark:text-[#8a8a8a]">{t("act.empty")}</p>
                  <a
                    href={`https://github.com/${username}?tab=overview`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-[#1c1508] dark:bg-white dark:text-black dark:hover:bg-primary"
                  >
                    <SiGithub size={15} /> {t("act.openGithub")} <ArrowUpRight size={14} />
                  </a>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    {/* label hari */}
                    <div className="flex flex-none flex-col">
                      <span className="h-[15px]" />
                      {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                        <span key={i} className="flex h-[10px] items-center pr-1 text-[9px] leading-none text-muted dark:text-[#7d8590] [&:not(:last-child)]:mb-[3px]">
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="min-w-0">
                      {/* label bulan */}
                      <div className="flex gap-[3px]">
                        {months.map((m, i) => (
                          <span key={i} className="w-[10px] flex-none overflow-visible whitespace-nowrap text-[9px] text-muted dark:text-[#7d8590]">
                            {m}
                          </span>
                        ))}
                      </div>
                      {/* grid kontribusi */}
                      <div className="mt-1 flex gap-[3px]">
                        {weeks.map((w, wi) => (
                          <div key={wi} className="flex flex-col gap-[3px]">
                            {Array.from({ length: 7 }, (_, di) => {
                              const d = w[di];
                              if (!d) return <span key={di} className="h-[10px] w-[10px]" />;
                              return (
                                <span
                                  key={di}
                                  title={`${d.count} contributions on ${d.date}`}
                                  className={`h-[10px] w-[10px] rounded-[2px] outline outline-1 -outline-offset-1 outline-black/[0.04] dark:outline-white/10 ${GH_LEVEL[Math.min(4, Math.max(0, d.level ?? 0))]}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* kaki ala GitHub */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11.5px] text-muted hover:text-primary hover:underline dark:text-[#7d8590]"
                    >
                      {t("act.learn")}
                    </a>
                    <span className="flex items-center gap-1 text-[11.5px] text-muted dark:text-[#7d8590]">
                      {t("act.less")}
                      {[0, 1, 2, 3, 4].map((l) => (
                        <span key={l} className={`h-[10px] w-[10px] rounded-[2px] outline outline-1 -outline-offset-1 outline-black/[0.04] dark:outline-white/10 ${GH_LEVEL[l]}`} />
                      ))}
                      {t("act.more")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* pemilih tahun ala GitHub */}
          <div className="flex flex-none gap-1.5 overflow-x-auto sm:w-[104px] sm:flex-col">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                aria-pressed={year === y}
                className={`flex-none rounded-lg px-4 py-2 text-[12.5px] font-medium transition-colors sm:w-full sm:text-left ${
                  year === y
                    ? "bg-[#0969da] text-white"
                    : "text-muted hover:bg-line/60 hover:text-ink dark:text-[#7d8590] dark:hover:bg-[#21262d] dark:hover:text-white"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* tombol profil */}
      <Reveal delay={0.05}>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-[13.5px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-[#1c1508] dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-[#1c1508]"
        >
          <SiGithub size={16} /> @{username} <ArrowUpRight size={15} />
        </a>
      </Reveal>
    </Page>
  );
}

/* ================= KONTAK ================= */
const WEB3_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

function ContactForm() {
  const { t } = useLang();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nama = (fd.get("nama") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const pesan = (fd.get("pesan") || "").toString().trim();

    /* belum pasang key → perilaku lama: buka aplikasi email */
    if (!WEB3_KEY) {
      const subject = encodeURIComponent(`${t("form.subject")} ${nama || "Halo"}`);
      const body = encodeURIComponent(`${pesan}\n\n— ${nama} (${email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3_KEY,
          name: nama,
          email,
          replyto: email,
          subject: `${t("form.subject")} ${nama || "Halo"}`,
          message: `${pesan}\n\n— ${nama} (${email})`,
          from_name: `Portfolio ${profile.name}`,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.success) throw new Error("send failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className={`${card} mt-4 grid gap-3.5`}
      onSubmit={onSubmit}
      onChange={() => { if (status === "sent" || status === "error") setStatus("idle"); }}
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[13px] font-semibold text-ink dark:text-white">
          {t("form.name")}
          <input name="nama" required placeholder={t("form.phName")} autoComplete="name" className="rounded-xl border border-line bg-background px-4 py-3 text-base font-normal text-ink outline-none placeholder:text-muted/60 focus:border-primary sm:text-[14px] dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-white" />
        </label>
        <label className="grid gap-1.5 text-[13px] font-semibold text-ink dark:text-white">
          {t("form.email")}
          <input name="email" type="email" required placeholder="email@contoh.com" autoComplete="email" className="rounded-xl border border-line bg-background px-4 py-3 text-base font-normal text-ink outline-none placeholder:text-muted/60 focus:border-primary sm:text-[14px] dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-white" />
        </label>
      </div>
      <label className="grid gap-1.5 text-[13px] font-semibold text-ink dark:text-white">
        {t("form.msg")}
        <textarea name="pesan" required rows={5} placeholder={t("form.phMsg")} className="resize-none rounded-xl border border-line bg-background px-4 py-3 text-base font-normal text-ink outline-none placeholder:text-muted/60 focus:border-primary sm:text-[14px] dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-white" />
      </label>
      {status === "sent" && (
        <p role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-[13.5px] font-medium leading-6 text-green-700 dark:text-green-400">
          {t("form.sent")}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13.5px] font-medium leading-6 text-red-700 dark:text-red-400">
          {t("form.error")}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-primary py-3.5 text-[14.5px] font-bold text-[#1c1508] transition-all hover:bg-hover hover:text-white disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? t("form.sending") : t("form.send")}
      </button>
    </form>
  );
}

export function KontakPage() {
  const { t } = useLang();
  return (
    <Page>
      <SubHead no={t("kontak.no")} title={t("kontak.title")} desc={t("kontak.desc")} />
      <Reveal>
        <div className={card}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {socials.map((s) => {
              const entry = socialIcons[s.key] ?? {};
              const Icon = entry.Icon ?? ArrowUpRight;
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-line bg-background px-4 py-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/60 dark:border-[#2c2c2c] dark:bg-[#0b0b0b]"
                >
                  <span style={entry.color ? { color: entry.color } : undefined} className={entry.color ? "grid h-9 w-9 flex-none place-items-center rounded-lg border border-line bg-surface dark:border-[#2c2c2c] dark:bg-[#151515]" : "grid h-9 w-9 flex-none place-items-center rounded-lg border border-line bg-surface text-primary dark:border-[#2c2c2c] dark:bg-[#151515]"}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-semibold text-ink transition-colors group-hover:text-primary dark:text-white">{s.label}</span>
                    {s.handle && <span className="block truncate font-fira text-[11.5px] text-muted dark:text-[#8a8a8a]">{s.handle}</span>}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <ContactForm />
      </Reveal>
    </Page>
  );
}

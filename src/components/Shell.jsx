import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Home, User, FlaskConical, Briefcase, Mail,
  Moon, Sun, Menu, X, Code2, BadgeCheck, Activity, Download,
} from "lucide-react";
import { SiGithub, SiWhatsapp, SiGmail } from "react-icons/si";
import { profile, socials } from "../data";
import { useLang } from "../i18n";

/* jsPDF dimuat malas — hanya diunduh browser saat tombol CV diklik */
async function saveCV(lang, t) {
  const { downloadCV } = await import("../cv");
  downloadCV(lang, t);
}

/* ikon brand LinkedIn (tidak tersedia di paket ikon) */
export function LinkedinBrand({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/* ---------- tema terang/gelap ala acuan ---------- */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      let t = localStorage.getItem("color-scheme");
      if (!t || t === "auto") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      return t;
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("color-scheme", next); } catch { /* abaikan */ }
  };
  return { theme, toggle };
}

/* ---------- progress bar atas saat pindah halaman ---------- */
export function ProgressBar() {
  const { pathname } = useLocation();
  const [state, setState] = useState("");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setState("loading");
    const t1 = setTimeout(() => setState("done"), 500);
    const t2 = setTimeout(() => setState(""), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname]);

  return <div id="progress-bar" className={state} aria-hidden="true" />;
}

/* ---------- latar premium: orbs emas + grain halus ---------- */
const ORBS = [
  { size: 560, x: "50%", y: "-190px", speed: 1.1, cls: "bg-[#e7d3a1]/50 dark:bg-[#c9a96a]/[0.08]" },
  { size: 440, x: "88%", y: "30%", speed: -1.5, cls: "bg-[#ddd5c1]/40 dark:bg-[#c9a96a]/[0.05]" },
  { size: 480, x: "-150px", y: "66%", speed: 1, cls: "bg-[#e3d3ae]/40 dark:bg-[#c9a96a]/[0.06]" },
];

export function ParallaxBg() {
  const ref = useRef(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    /* hanya bekerja saat mouse bergerak — tanpa loop 60fps nonstop */
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ref.current?.querySelectorAll("[data-speed]").forEach((el) => {
          const s = parseFloat(el.getAttribute("data-speed") || "0");
          const x = ((window.innerWidth / 2 - e.clientX) * s) / 14;
          const y = ((220 - e.clientY) * s) / 14;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {ORBS.map((b, i) => (
        <div
          key={i}
          data-speed={b.speed}
          className="absolute transition-transform duration-700 ease-out will-change-transform"
          style={{ left: b.x, top: b.y }}
        >
          <div
            className={`animate-drift rounded-full blur-[70px] sm:blur-[110px] ${b.cls}`}
            style={{ width: b.size, height: b.size, animationDuration: `${9 + i * 2}s`, animationDelay: `${-i * 2.5}s` }}
          />
        </div>
      ))}
      <div className="grain absolute inset-0 opacity-[0.05] dark:opacity-[0.07]" />
    </div>
  );
}

/* ---------- klaster kontrol: bahasa + tema, sejajar satu baris ---------- */
function LangButtons() {
  const { lang, setLang } = useLang();
  return (
    <>
      {["id", "en"].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`h-full flex-1 rounded-lg px-3 text-[12px] font-bold uppercase tracking-wide transition-colors ${
            lang === l
              ? "bg-ink text-white dark:bg-white dark:text-black"
              : "text-muted hover:text-ink dark:text-[#8a8a8a] dark:hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </>
  );
}

export function PrefsCluster({ theme, toggle, className = "" }) {
  const { t } = useLang();
  return (
    <div
      role="group"
      aria-label={t("aria.lang")}
      className={`flex h-11 items-center gap-1 rounded-xl border border-line bg-surface p-1 dark:border-[#232323] dark:bg-[#151515] ${className}`}
    >
      <LangButtons />
      <span className="h-5 w-px flex-none bg-line dark:bg-[#2c2c2c]" aria-hidden="true" />
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === "dark" ? t("aria.themeLight") : t("aria.themeDark")}
        className="grid h-full w-10 flex-none place-items-center rounded-lg text-muted transition-colors hover:text-ink dark:hover:text-white"
      >
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </div>
  );
}

/* ---------- daftar menu samping ---------- */
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

/* ---------- footer: hak cipta lembut ---------- */
export function Footer() {
  return (
    <footer className="px-8 pb-10 pt-14">
      <p className="text-center text-[12.5px] text-[#b3a992] dark:text-[#4d4d4d]">
        © 2026 <span className="font-medium">{profile.name}</span>
      </p>
    </footer>
  );
}

const socialIcons = {
  github: { Icon: SiGithub },
  linkedin: { Icon: LinkedinBrand, color: "#0A66C2" },
  wa: { Icon: SiWhatsapp, color: "#25D366" },
  mail: { Icon: SiGmail, color: "#EA4335" },
};

function MenuRows({ items, onNavigate }) {
  return (
    <ul>
      {items.map((m) => {
        const Icon = m.icon;
        return (
          <li key={m.href} className="border-b border-line last:border-b-0 dark:border-[#232323]">
            <NavLink
              to={m.href}
              end={m.href === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3.5 text-[14.5px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-ink hover:text-primary dark:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="side-active"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon size={19} className="flex-none" />
                  <span>{m.label}</span>
                </>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- sidebar desktop ---------- */
export function Sidebar({ theme, toggle }) {
  const { t, lang } = useLang();
  const items = useMenu();
  return (
    <aside className="no-scrollbar hidden w-[280px] flex-none lg:block lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:overflow-y-auto">
      <div className="flex flex-col gap-4 pb-6">
        {/* brand */}
        <Link to="/" className="px-1" aria-label={t("aria.home")}>
          <span className="block text-[19px] font-extrabold tracking-tight text-ink dark:text-white">
            {profile.name}<span className="text-primary">.</span>
          </span>
          <span className="mt-0.5 block text-[12px] text-muted dark:text-[#8a8a8a]">{profile.role}</span>
        </Link>

        {/* kartu menu */}
        <nav aria-label="Navigasi samping" className="rounded-2xl border border-line bg-surface dark:border-[#232323] dark:bg-[#151515]">
          <MenuRows items={items} />
        </nav>

        {/* aksi */}
        <Link
          to="/kontak"
          className="rounded-xl bg-ink py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-primary hover:text-[#1c1508] dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-[#1c1508]"
        >
          {t("ui.letsTalk")}
        </Link>
        <button
          type="button"
          onClick={() => saveCV(lang, t)}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-[14px] font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary dark:border-[#232323] dark:bg-[#151515] dark:text-white"
        >
          <Download size={16} /> {t("cv.download")}
        </button>
        <PrefsCluster theme={theme} toggle={toggle} className="w-full" />

        {/* status + sosial */}
        <div className="mt-auto rounded-2xl border border-line bg-surface p-4 dark:border-[#232323] dark:bg-[#151515]">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted dark:text-[#8a8a8a]">
            <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            {t("ui.status")}
          </p>
          <div className="mt-3 flex gap-3">
            {socials.map((s) => {
              const entry = socialIcons[s.key] ?? {};
              const Icon = entry.Icon ?? Mail;
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  style={entry.color ? { color: entry.color } : undefined}
                  className={`transition-all duration-150 hover:-translate-y-0.5 ${
                    entry.color ? "" : "text-muted hover:text-primary dark:text-[#8a8a8a]"
                  }`}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- topbar + drawer mobile ---------- */
export function MobileTopBar({ theme, toggle }) {
  const [open, setOpen] = useState(false);
  const { t, lang } = useLang();
  const items = useMenu();
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open ]);

  return (
    <>
      <div className="sticky top-0 z-40 -mx-8 border-b border-line bg-background/90 px-8 backdrop-blur-xl lg:hidden dark:border-[#232323] dark:bg-[#0b0b0b]/90">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex min-w-0 items-center" aria-label={t("aria.home")}>
            <span className="truncate text-[16px] font-extrabold tracking-tight text-ink dark:text-white">
              {profile.name}<span className="text-primary">.</span>
            </span>
          </Link>
          <div className="flex flex-none items-center gap-2">
            <PrefsCluster theme={theme} toggle={toggle} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? t("aria.closeMenu") : t("aria.openMenu")}
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-ink dark:border-[#262626] dark:text-white"
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="no-scrollbar fixed inset-x-8 top-[72px] z-40 max-h-[calc(100svh-88px)] overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl lg:hidden dark:border-[#232323] dark:bg-[#151515]"
            aria-label="Navigasi seluler"
          >
            <MenuRows items={items} onNavigate={close} />
            <div className="grid gap-2 p-3">
              <Link
                to="/kontak"
                onClick={close}
                className="block rounded-xl bg-ink py-3 text-center text-[14px] font-bold text-white dark:bg-white dark:text-black"
              >
                {t("ui.letsTalk")}
              </Link>
              <button
                type="button"
                onClick={() => { saveCV(lang, t); close(); }}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-background py-3 text-[14px] font-bold text-ink dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-white"
              >
                <Download size={16} /> {t("cv.download")}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, MobileTopBar, ParallaxBg, ProgressBar, Sidebar, useTheme } from "./components/Shell";
import { LangProvider } from "./i18n";
import {
  HomePage, TentangPage, PengalamanPage,
  KeahlianPage, ProyekPage, ActivityPage, SertifikasiPage, KontakPage,
} from "./pages";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/pengalaman" element={<PengalamanPage />} />
        <Route path="/keahlian" element={<KeahlianPage />} />
        <Route path="/proyek" element={<ProyekPage />} />
        <Route path="/aktivitas" element={<ActivityPage />} />
        <Route path="/sertifikasi" element={<SertifikasiPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        {/* rute lama */}
        <Route path="/pendidikan" element={<Navigate to="/pengalaman" replace />} />
        <Route path="/karya" element={<Navigate to="/proyek" replace />} />
        <Route path="/kredensial" element={<Navigate to="/pengalaman" replace />} />
        <Route path="/layanan" element={<Navigate to="/keahlian" replace />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <LangProvider>
    <div className="min-h-screen font-jakarta">
      <ScrollToTop />
      <ProgressBar />
      <ParallaxBg />
      <div className="mx-auto flex w-full max-w-6xl items-start gap-8 px-8">
        {!isHome && <Sidebar theme={theme} toggle={toggle} />}
        <div className="mx-auto flex min-h-svh w-full max-w-3xl min-w-0 flex-1 flex-col">
          <MobileTopBar theme={theme} toggle={toggle} />
          <main className="flex w-full flex-1 flex-col justify-center py-6">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </div>
    </LangProvider>
  );
}

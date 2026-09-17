import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useLang } from "../i18n";
import { getReply } from "../chatbot";

/* Chatbot asisten portfolio: tombol melayang + panel chat. */
export function Chatbot() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);
  const greeted = useRef(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      say(t("chat.greet"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const say = (text) => {
    setTyping(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text }]);
      setTyping(false);
    }, 650);
  };

  const send = (raw) => {
    const text = String(raw || "").trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    say(getReply(text, lang));
  };

  const quick = [t("chat.q0"), t("chat.q1"), t("chat.q2"), t("chat.q3")];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-32 right-4 z-50 flex max-h-[62svh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl sm:right-6 sm:w-[370px] dark:border-[#232323] dark:bg-[#151515]"
            role="dialog"
            aria-label={t("chat.title")}
          >
            {/* kepala */}
            <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 dark:border-[#232323] dark:bg-[#151515]">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-primary text-[#1c1508]">
                <Bot size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink dark:text-white">{t("chat.title")}</span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-muted dark:text-[#8a8a8a]">
                  <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-green-500" />
                  {t("chat.online")}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("aria.closeMenu")}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:text-ink dark:hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            {/* pesan */}
            <div ref={bodyRef} className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-3.5 py-4">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-6 ${
                    m.from === "user"
                      ? "ml-auto rounded-br-md bg-primary font-medium text-[#1c1508]"
                      : "rounded-bl-md border border-line bg-background text-ink dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-[#d4d4d4]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-background px-4 py-3 dark:border-[#2c2c2c] dark:bg-[#0b0b0b]">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted dark:bg-[#8a8a8a]"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* saran cepat */}
            <div className="flex flex-wrap gap-1.5 px-3.5 pb-2">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-muted transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary dark:border-[#2c2c2c] dark:text-[#b5b5b5]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              className="flex gap-2 border-t border-line p-3 dark:border-[#232323]"
              onSubmit={(e) => { e.preventDefault(); send(input); }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                aria-label={t("chat.placeholder")}
                className="min-w-0 flex-1 rounded-xl border border-line bg-background px-3.5 py-2.5 text-[13.5px] text-ink outline-none placeholder:text-muted/60 focus:border-primary dark:border-[#2c2c2c] dark:bg-[#0b0b0b] dark:text-white"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-[42px] w-[42px] flex-none place-items-center rounded-xl bg-primary text-[#1c1508] transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* tombol melayang */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("chat.title")}
        aria-expanded={open}
        className="fixed bottom-14 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-primary text-[#1c1508] shadow-xl shadow-primary/25 transition-all duration-150 hover:-translate-y-0.5 active:scale-95 sm:right-6"
      >
        {open ? <X size={21} /> : <MessageCircle size={21} />}
      </button>
    </>
  );
}

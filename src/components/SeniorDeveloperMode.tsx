"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code2 } from "lucide-react";
import { useI18n } from "@/i18n/context";

interface SeniorDeveloperModeProps {
  titleTr?: string;
  titleEn?: string;
  contentTr: React.ReactNode;
  contentEn: React.ReactNode;
}

export default function SeniorDeveloperMode({
  titleTr = "Senior Developer Modu: Gerçek Hayatta Neler Dönüyor?",
  titleEn = "Senior Developer Mode: Real-World Architecture",
  contentTr,
  contentEn,
}: SeniorDeveloperModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useI18n();

  const title = locale === "tr" ? titleTr : titleEn;
  const content = locale === "tr" ? contentTr : contentEn;

  return (
    <div className="mt-8 border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-mono text-base md:text-lg text-slate-300 hover:text-white hover:bg-slate-800/40 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500 shrink-0" />
          <span className="font-semibold tracking-wider uppercase">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-slate-400 shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/40 text-slate-200 text-base leading-relaxed space-y-4 font-sans">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

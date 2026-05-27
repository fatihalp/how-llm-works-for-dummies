"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain, Layers, Zap, Globe, Sun, Moon } from "lucide-react";
import { I18nProvider, useI18n } from "@/i18n/context";

import Overview from "@/components/sections/Overview";
import Tokenization from "@/components/sections/Tokenization";
import Embedding from "@/components/sections/Embedding";
import LayerNorm from "@/components/sections/LayerNorm";
import SelfAttention from "@/components/sections/SelfAttention";
import Projection from "@/components/sections/Projection";
import MLP from "@/components/sections/MLP";
import TransformerBlock from "@/components/sections/TransformerBlock";
import Softmax from "@/components/sections/Softmax";
import Output from "@/components/sections/Output";
import Training from "@/components/sections/Training";

const sections = [
  { id: "overview", titleKey: "nav.overview", icon: Brain },
  { id: "tokenization", titleKey: "nav.tokenization", icon: Zap },
  { id: "embedding", titleKey: "nav.embedding", icon: Layers },
  { id: "layernorm", titleKey: "nav.layernorm", icon: Layers },
  { id: "attention", titleKey: "nav.attention", icon: Zap },
  { id: "projection", titleKey: "nav.projection", icon: Layers },
  { id: "mlp", titleKey: "nav.mlp", icon: Zap },
  { id: "transformer", titleKey: "nav.transformer", icon: Brain },
  { id: "softmax", titleKey: "nav.softmax", icon: Zap },
  { id: "output", titleKey: "nav.output", icon: Layers },
  { id: "training", titleKey: "nav.training", icon: Brain },
];

const sectionComponents: Record<string, React.FC> = {
  overview: Overview,
  tokenization: Tokenization,
  embedding: Embedding,
  layernorm: LayerNorm,
  attention: SelfAttention,
  projection: Projection,
  mlp: MLP,
  transformer: TransformerBlock,
  softmax: Softmax,
  output: Output,
  training: Training,
};

export default function Home() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

function AppContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t, locale, setLocale } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const goTo = (idx: number) => {
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
  };

  const next = () => {
    if (currentStep < sections.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentSection = sectionComponents[sections[currentStep].id];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            {t("app.title")}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{t("app.subtitle")}</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-all ${
                i === currentStep
                  ? "bg-slate-800 text-slate-100 font-semibold border-r-2 border-blue-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i === currentStep ? "bg-blue-600 text-white" : i < currentStep ? "bg-slate-600 text-white" : "bg-slate-700 text-slate-400"
              }`}>
                {i < currentStep ? "✓" : i + 1}
              </span>
              <span className="truncate">{t(s.titleKey)}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700 text-xs text-slate-500 text-center">
          {t("app.step", { current: currentStep + 1, total: sections.length })}
        </div>
      </aside>
 
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-slate-900/50 backdrop-blur border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-semibold text-white">{t(sections[currentStep].titleKey)}</h2>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-blue-600" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setLocale("en")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  locale === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("tr")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  locale === "tr" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                TR
              </button>
            </div>

            <button
              onClick={prev}
              disabled={currentStep === 0}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={currentStep === sections.length - 1}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={sections[currentStep].id + locale}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="max-w-4xl mx-auto"
            >
              <CurrentSection />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

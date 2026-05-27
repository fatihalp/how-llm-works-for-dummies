"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain, Layers, Zap, Sun, Moon } from "lucide-react";
import { I18nProvider, useI18n } from "@/i18n/context";

import Overview from "@/components/sections/Overview";
import Tokenization from "@/components/sections/Tokenization";
import Embedding from "@/components/sections/Embedding";
import LayerNorm from "@/components/sections/LayerNorm";
import SelfAttention from "@/components/sections/SelfAttention";
import MLP from "@/components/sections/MLP";
import TransformerBlock from "@/components/sections/TransformerBlock";
import Softmax from "@/components/sections/Softmax";
import Output from "@/components/sections/Output";
import Training from "@/components/sections/Training";
import Inference from "@/components/sections/Inference";

const sections = [
  { id: "overview", titleKey: "nav.overview", icon: Brain, slidesCount: 3 },
  { id: "tokenization", titleKey: "nav.tokenization", icon: Zap, slidesCount: 3 },
  { id: "embedding", titleKey: "nav.embedding", icon: Layers, slidesCount: 3 },
  { id: "layernorm", titleKey: "nav.layernorm", icon: Layers, slidesCount: 3 },
  { id: "attention", titleKey: "nav.attention", icon: Zap, slidesCount: 3 },
  { id: "mlp", titleKey: "nav.mlp", icon: Zap, slidesCount: 3 },
  { id: "transformer", titleKey: "nav.transformer", icon: Brain, slidesCount: 3 },
  { id: "softmax", titleKey: "nav.softmax", icon: Zap, slidesCount: 3 },
  { id: "output", titleKey: "nav.output", icon: Layers, slidesCount: 3 },
  { id: "training", titleKey: "nav.training", icon: Brain, slidesCount: 3 },
  { id: "inference", titleKey: "nav.inference", icon: Zap, slidesCount: 2 },
];

const sectionComponents: Record<string, React.FC<{ slide: number }>> = {
  overview: Overview as any,
  tokenization: Tokenization as any,
  embedding: Embedding as any,
  layernorm: LayerNorm as any,
  attention: SelfAttention as any,
  mlp: MLP as any,
  transformer: TransformerBlock as any,
  softmax: Softmax as any,
  output: Output as any,
  training: Training as any,
  inference: Inference as any,
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t, locale, setLocale } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    const applyTheme = (t: "light" | "dark") => {
      setTheme(t);
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");
      
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
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
    setCurrentSlide(0);
  };

  const next = () => {
    const currentChapterObj = sections[currentStep];
    if (currentSlide < currentChapterObj.slidesCount - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentStep < sections.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
      setCurrentSlide(0);
    }
  };

  const prev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentStep > 0) {
      setDirection(-1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setCurrentSlide(sections[prevStep].slidesCount - 1);
    }
  };

  // Helper to compute overall flat progress percentage
  const getFlatIndex = () => {
    let index = 0;
    for (let i = 0; i < currentStep; i++) {
      index += sections[i].slidesCount;
    }
    return index + currentSlide;
  };

  const totalSlides = sections.reduce((sum, s) => sum + s.slidesCount, 0);
  const progressPercent = ((getFlatIndex() + 1) / totalSlides) * 100;

  const CurrentSection = sectionComponents[sections[currentStep].id];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col shrink-0 text-slate-100">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            {t("app.title")}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{t("app.subtitle")}</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-all cursor-pointer ${
                i === currentStep
                  ? "bg-slate-800 text-slate-100 font-semibold border-r-2 border-blue-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i === currentStep ? "bg-blue-600 text-white" : i < currentStep ? "bg-slate-600 text-white" : "bg-slate-700 text-slate-400"
              }`}>
                {i === 0 ? "★" : (i < currentStep ? "✓" : i)}
              </span>
              <span className="truncate">{t(s.titleKey)}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700 text-xs text-slate-500 text-center">
          {currentStep === 0 
            ? (locale === "tr" ? "Giriş" : "Introduction") 
            : t("app.step", { current: currentStep, total: sections.length - 1 })}
        </div>
      </aside>
 
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-slate-900/50 backdrop-blur border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{t(sections[currentStep].titleKey)}</h2>
          
          <div className="flex items-center gap-3">
            {/* Pagination dots for current step's slides */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800/40 rounded-full border border-slate-700/50">
              {Array.from({ length: sections[currentStep].slidesCount }).map((_, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setCurrentSlide(sIdx)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                    sIdx === currentSlide
                      ? "bg-blue-500 scale-125"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                  title={`Slide ${sIdx + 1}`}
                />
              ))}
            </div>

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
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  locale === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("tr")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  locale === "tr" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                TR
              </button>
            </div>

            <button
              onClick={prev}
              disabled={currentStep === 0 && currentSlide === 0}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={currentStep === sections.length - 1 && currentSlide === sections[currentStep].slidesCount - 1}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Thin overall progress bar */}
        <div className="h-1.5 bg-slate-800 w-full shrink-0 relative overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={sections[currentStep].id + "_" + currentSlide + "_" + locale}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="max-w-4xl mx-auto"
            >
              <CurrentSection slide={currentSlide} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

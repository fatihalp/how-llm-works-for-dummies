"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const words = ["king", "queen", "man", "woman", "cat"];
const embeddings: Record<string, number[]> = {
  king:  [0.9, 0.1, 0.8, 0.7, -0.2, 0.5, 0.3, -0.1],
  queen: [0.85, 0.9, 0.75, 0.6, -0.15, 0.55, 0.35, -0.05],
  man:   [0.7, 0.05, 0.6, 0.5, -0.3, 0.4, 0.2, -0.2],
  woman: [0.65, 0.85, 0.55, 0.45, -0.25, 0.45, 0.25, -0.15],
  cat:   [-0.3, 0.1, -0.5, 0.2, 0.8, -0.4, 0.6, 0.7],
};

function getBarColor(value: number) {
  if (value > 0.5) return "bg-green-400";
  if (value > 0) return "bg-green-600";
  if (value > -0.5) return "bg-red-600";
  return "bg-red-400";
}

const wordTranslations: Record<string, Record<string, string>> = {
  tr: { king: "kral", queen: "kraliçe", man: "erkek", woman: "kadın", cat: "kedi" },
  en: { king: "king", queen: "queen", man: "man", woman: "woman", cat: "cat" },
};

export default function Embedding() {
  const { t, locale } = useI18n();
  const [selected, setSelected] = useState("king");
  const vec = embeddings[selected];
  
  const displayWord = (w: string) => {
    return wordTranslations[locale]?.[w] || w;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("embed.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("embed.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("embed.select")}</h4>
        <div className="flex gap-2 flex-wrap mb-6">
          {words.map((w) => (
            <button
              key={w}
              onClick={() => setSelected(w)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                selected === w
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {displayWord(w)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-mono mb-2">embedding[&quot;{displayWord(selected)}&quot;] = [{vec.map(v => v.toFixed(2)).join(", ")}]</p>
          <div className="flex items-end gap-1 h-32">
            {vec.map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 flex flex-col items-center justify-end h-full"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.05, type: "spring" }}
              >
                <div
                  className={`w-full rounded-t ${getBarColor(v)} transition-all`}
                  style={{ height: `${Math.abs(v) * 100}%`, minHeight: 4 }}
                />
                <span className="text-[10px] text-slate-500 mt-1">{v.toFixed(1)}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">{t("embed.dims")}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("embed.relationships")}</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-2">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-green-400">
            {t("embed.formula")}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-blue-400">
            {t("embed.similar")}
          </motion.p>
        </div>

        <div className="mt-4 relative h-48 bg-slate-900 rounded-lg overflow-hidden">
          {Object.entries(embeddings).map(([word, vec], i) => {
            const x = ((vec[0] + 0.5) / 1.5) * 80 + 10;
            const y = ((vec[1] + 0.5) / 1.5) * 80 + 10;
            return (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.15, type: "spring" }}
                className="absolute"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className={`w-3 h-3 rounded-full ${selected === word ? "bg-blue-500 ring-2 ring-blue-300" : "bg-blue-400"}`} />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-slate-300 whitespace-nowrap">{displayWord(word)}</span>
              </motion.div>
            );
          })}
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-600">{t("embed.2d")}</div>
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("embed.insight") }} />
      </motion.div>
    </motion.div>
  );
}

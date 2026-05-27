"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LayerNorm() {
  const { t } = useI18n();
  const [showNormalized, setShowNormalized] = useState(false);
  const rawValues = [3.2, -1.5, 0.8, 5.1, -0.3, 2.7, -2.1, 1.4];
  const mean = rawValues.reduce((a, b) => a + b, 0) / rawValues.length;
  const variance = rawValues.reduce((a, b) => a + (b - mean) ** 2, 0) / rawValues.length;
  const std = Math.sqrt(variance);
  const normalized = rawValues.map((v) => (v - mean) / std);

  const displayValues = showNormalized ? normalized : rawValues;
  const maxAbs = Math.max(...displayValues.map(Math.abs));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("ln.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("ln.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("ln.analogy")}</h4>
        <p className="text-slate-300 text-sm mb-4">{t("ln.analogy.desc")}</p>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowNormalized(false)}
            className={`px-4 py-2 rounded-lg text-sm transition ${!showNormalized ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            {t("ln.raw")}
          </button>
          <button
            onClick={() => setShowNormalized(true)}
            className={`px-4 py-2 rounded-lg text-sm transition ${showNormalized ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            {t("ln.normalized")}
          </button>
        </div>

        <div className="flex items-center gap-2 h-40">
          {displayValues.map((v, i) => {
            const height = (Math.abs(v) / maxAbs) * 100;
            const isPositive = v >= 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-center h-full relative">
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
                  <div className="w-full h-px bg-slate-600" />
                </div>
                <div className={`flex flex-col ${isPositive ? "justify-end pb-[50%]" : "justify-start pt-[50%]"} h-full w-full items-center`}>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                    className={`w-3/4 rounded ${isPositive ? "bg-green-500/60 origin-bottom" : "bg-red-500/60 origin-top"}`}
                    style={{ height: `${height / 2}%` }}
                  />
                </div>
                <span className="absolute bottom-0 text-[9px] text-slate-400">{v.toFixed(1)}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-4 text-xs text-slate-400">
          <span>Mean: <span className="text-white">{showNormalized ? "≈ 0" : mean.toFixed(2)}</span></span>
          <span>Std: <span className="text-white">{showNormalized ? "≈ 1" : std.toFixed(2)}</span></span>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("ln.formula.title")}</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-center">
          <p className="text-green-400">{t("ln.formula")}</p>
        </div>
        <p className="text-xs text-slate-400 mt-3">{t("ln.epsilon")}</p>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("ln.insight") }} />
      </motion.div>
    </motion.div>
  );
}

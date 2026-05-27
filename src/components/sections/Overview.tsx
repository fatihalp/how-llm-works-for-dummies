"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Overview() {
  const { t } = useI18n();

  const pipelineKeys = ["overview.pipeline.1", "overview.pipeline.2", "overview.pipeline.3", "overview.pipeline.4", "overview.pipeline.5"];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("overview.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("overview.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">{t("overview.autocomplete")}</h4>
        <div className="flex flex-col gap-3">
          {[
            { input: "The cat sat on the", output: "mat", color: "text-green-400" },
            { input: "Once upon a", output: "time", color: "text-blue-400" },
            { input: "The capital of France is", output: "Paris", color: "text-yellow-400" },
          ].map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3"
            >
              <span className="text-slate-300 font-mono text-sm">&quot;{ex.input}</span>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.2, type: "spring" }}
                className={`${ex.color} font-bold font-mono text-sm bg-slate-700 px-2 py-1 rounded`}
              >
                {ex.output}&quot;
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/30">
        <h4 className="text-lg font-semibold text-white mb-3">{t("overview.bigpicture")}</h4>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {pipelineKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="bg-purple-600/40 border border-purple-500/50 rounded-lg px-3 py-2 text-sm font-medium text-purple-200">
                {t(key)}
              </div>
              {i < 4 && <span className="text-purple-400 text-lg">→</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm">
        <p>{t("overview.next")}</p>
      </motion.div>
    </motion.div>
  );
}

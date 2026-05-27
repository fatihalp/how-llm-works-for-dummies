"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Projection() {
  const { t } = useI18n();
  const heads = [
    { label: "Head 1", focus: "grammar", color: "bg-blue-500" },
    { label: "Head 2", focus: "meaning", color: "bg-green-500" },
    { label: "Head 3", focus: "position", color: "bg-yellow-500" },
    { label: "Head 4", focus: "entities", color: "bg-pink-500" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("proj.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("proj.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Multi-Head Attention → Projection</h4>

        <div className="flex flex-col items-center gap-6">
          {/* Heads */}
          <div className="flex gap-3">
            {heads.map((head, i) => (
              <motion.div
                key={head.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-16 h-16 ${head.color}/20 border border-${head.color.replace("bg-", "")}/50 rounded-lg flex items-center justify-center`}>
                  <div className={`w-8 h-8 ${head.color} rounded opacity-60`} />
                </div>
                <span className="text-xs text-slate-400 font-mono">{head.label}</span>
                <span className="text-[10px] text-slate-500">{head.focus}</span>
              </motion.div>
            ))}
          </div>

          {/* Arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-16 flex justify-center">
                  <div className="w-px h-6 bg-slate-500" />
                </div>
              ))}
            </div>
            <div className="text-slate-500 text-lg">↓ Concatenate ↓</div>
          </motion.div>

          {/* Concatenated */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.1, type: "spring" }}
            className="w-full max-w-sm h-10 bg-gradient-to-r from-blue-500/30 via-green-500/30 via-yellow-500/30 to-pink-500/30 rounded-lg border border-slate-600 flex items-center justify-center"
          >
            <span className="text-xs text-slate-300 font-mono">Concatenated (4 × d_head = d_model)</span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-slate-500 text-lg"
          >
            ↓ Linear Projection (W<sub>O</sub>) ↓
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
            className="w-full max-w-sm h-10 bg-purple-500/20 border border-purple-500/50 rounded-lg flex items-center justify-center"
          >
            <span className="text-xs text-purple-300 font-mono">Output (d_model dimensions)</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">What is a projection?</h4>
        <p className="text-slate-300 text-sm mb-3">
          A projection is simply multiplying by a <strong>weight matrix</strong>. It transforms vectors from one space to another.
        </p>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-center">
          <p className="text-green-400">output = concat(head₁, head₂, ..., headₙ) × W<sub>O</sub></p>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          W<sub>O</sub> is a learned matrix that mixes information from all attention heads.
        </p>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("proj.insight") }} />
      </motion.div>
    </motion.div>
  );
}

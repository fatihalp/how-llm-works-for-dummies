"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function relu(x: number) { return Math.max(0, x); }
function gelu(x: number) { return x * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x))); }

export default function MLP() {
  const { t } = useI18n();
  const [inputVal, setInputVal] = useState(0.5);
  const range = Array.from({ length: 40 }, (_, i) => (i - 20) / 5);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("mlp.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("mlp.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Structure of the MLP</h4>
        <div className="flex flex-col items-center gap-4">
          {/* Input layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center text-[9px] text-blue-300">
                x{i+1}
              </div>
            ))}
          </motion.div>
          <span className="text-xs text-slate-400">Input (d_model = 768)</span>

          <div className="text-slate-500">↓ Multiply by W₁ ↓</div>

          {/* Hidden layer (expanded) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-1.5"
          >
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-green-500/30 border border-green-500/50" />
            ))}
          </motion.div>
          <span className="text-xs text-slate-400">Hidden (4× bigger = 3072)</span>

          <div className="text-slate-500">↓ Apply activation (GELU) ↓</div>

          {/* Hidden after activation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-1.5"
          >
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-full border ${i % 3 === 0 ? "bg-green-500/10 border-green-500/20" : "bg-green-500/40 border-green-500/60"}`} />
            ))}
          </motion.div>
          <span className="text-xs text-slate-400">After activation (some neurons are ~0)</span>

          <div className="text-slate-500">↓ Multiply by W₂ ↓</div>

          {/* Output layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex gap-2"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-500/50 flex items-center justify-center text-[9px] text-purple-300">
                y{i+1}
              </div>
            ))}
          </motion.div>
          <span className="text-xs text-slate-400">Output (back to d_model = 768)</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Activation Function (GELU)</h4>
        <p className="text-slate-300 text-sm mb-4">
          The activation function introduces <strong>non-linearity</strong>. Without it, the network could only learn linear 
          (straight-line) patterns. GELU is a smooth version of ReLU.
        </p>

        <div className="relative h-40 bg-slate-900 rounded-lg overflow-hidden p-4">
          {/* Axes */}
          <div className="absolute inset-4 border-l border-b border-slate-700" />
          {/* GELU curve */}
          <svg className="absolute inset-4" viewBox="0 0 200 100" preserveAspectRatio="none">
            <polyline
              points={range.map((x, i) => {
                const px = (i / (range.length - 1)) * 200;
                const py = 100 - ((gelu(x) + 2) / 5) * 100;
                return `${px},${py}`;
              }).join(" ")}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2"
            />
            <polyline
              points={range.map((x, i) => {
                const px = (i / (range.length - 1)) * 200;
                const py = 100 - ((relu(x) + 2) / 5) * 100;
                return `${px},${py}`;
              }).join(" ")}
              fill="none"
              stroke="#4ade80"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          </svg>
          <div className="absolute bottom-2 right-4 flex gap-4 text-[10px]">
            <span className="text-purple-400">— GELU</span>
            <span className="text-green-400">--- ReLU</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Formula:</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-2">
          <p className="text-green-400">MLP(x) = W₂ · GELU(W₁ · x + b₁) + b₂</p>
          <p className="text-slate-500 text-xs mt-2">Where W₁ expands dimensions and W₂ compresses back.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("mlp.insight") }} />
      </motion.div>
    </motion.div>
  );
}

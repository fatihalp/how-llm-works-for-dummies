"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function softmax(values: number[]): number[] {
  const maxVal = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export default function Softmax() {
  const { t } = useI18n();
  const [rawValues, setRawValues] = useState([2.0, 1.0, 0.1, -1.0, 3.5]);
  const labels = ["cat", "dog", "fish", "car", "mat"];
  const probs = softmax(rawValues);

  const updateValue = (idx: number, val: number) => {
    const newVals = [...rawValues];
    newVals[idx] = val;
    setRawValues(newVals);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("sm.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("sm.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Interactive: Adjust the raw scores (logits) to see probabilities change
        </h4>

        <div className="space-y-4">
          {rawValues.map((val, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-10 text-xs text-slate-400 font-mono">{labels[i]}</span>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.1}
                value={val}
                onChange={(e) => updateValue(i, parseFloat(e.target.value))}
                className="flex-1 accent-purple-500"
              />
              <span className="w-12 text-xs text-slate-300 font-mono text-right">{val.toFixed(1)}</span>
              <div className="w-32 flex items-center gap-2">
                <motion.div
                  className="h-5 bg-purple-500 rounded"
                  animate={{ width: `${probs[i] * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <span className="text-xs text-purple-300 font-mono whitespace-nowrap">
                  {(probs[i] * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Sum of probabilities: <span className="text-white font-mono">{probs.reduce((a, b) => a + b, 0).toFixed(4)}</span> (always = 1.0)
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">The Formula:</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-center space-y-2">
          <p className="text-green-400">softmax(xᵢ) = e^xᵢ / Σ(e^xⱼ)</p>
          <p className="text-slate-500 text-xs">For each value: take e^value, then divide by the sum of all e^values</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Step-by-step Example:</h4>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs space-y-1 overflow-x-auto">
          <p className="text-slate-400">Raw scores: [{rawValues.map(v => v.toFixed(1)).join(", ")}]</p>
          <p className="text-blue-400">e^values: [{rawValues.map(v => Math.exp(v).toFixed(2)).join(", ")}]</p>
          <p className="text-yellow-400">Sum: {rawValues.map(v => Math.exp(v)).reduce((a, b) => a + b, 0).toFixed(2)}</p>
          <p className="text-green-400">Probabilities: [{probs.map(p => p.toFixed(4)).join(", ")}]</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("sm.insight") }} />
      </motion.div>
    </motion.div>
  );
}

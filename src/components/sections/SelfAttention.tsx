"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const sentence = ["The", "cat", "sat", "on", "the", "mat"];

const attentionWeights: number[][] = [
  [0.4, 0.1, 0.1, 0.1, 0.2, 0.1],
  [0.1, 0.3, 0.2, 0.05, 0.05, 0.3],
  [0.15, 0.3, 0.2, 0.1, 0.1, 0.15],
  [0.1, 0.1, 0.3, 0.2, 0.1, 0.2],
  [0.3, 0.05, 0.05, 0.1, 0.4, 0.1],
  [0.05, 0.3, 0.15, 0.15, 0.05, 0.3],
];

export default function SelfAttention() {
  const { t } = useI18n();
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [showQKV, setShowQKV] = useState(false);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("attn.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("attn.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          {t("attn.hover")}
        </h4>
        <div className="flex justify-center gap-4 mb-6">
          {sentence.map((word, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredWord(i)}
              onMouseLeave={() => setHoveredWord(null)}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg font-mono text-sm cursor-pointer transition-all ${
                hoveredWord === i
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {word}
            </motion.div>
          ))}
        </div>

        {hoveredWord !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-xs text-slate-400 text-center">
              &quot;{sentence[hoveredWord]}&quot; attends to each word with these weights:
            </p>
            <div className="flex justify-center gap-2">
              {sentence.map((word, i) => {
                const weight = attentionWeights[hoveredWord][i];
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-12 rounded-t bg-purple-500 transition-all"
                      style={{ height: `${weight * 120}px`, opacity: 0.3 + weight * 2 }}
                    />
                    <span className="text-xs text-slate-400">{word}</span>
                    <span className="text-[10px] text-purple-300">{(weight * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {hoveredWord === null && (
          <p className="text-center text-slate-500 text-sm italic">{t("attn.hoverhint")}</p>
        )}
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{t("attn.qkv")}</h4>
          <button
            onClick={() => setShowQKV(!showQKV)}
            className="text-xs px-3 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
          >
            {showQKV ? t("attn.hide") : t("attn.show")}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { name: "Query (Q)", desc: "What am I looking for?", color: "border-blue-500 bg-blue-500/10" },
            { name: "Key (K)", desc: "What do I contain?", color: "border-green-500 bg-green-500/10" },
            { name: "Value (V)", desc: "What info do I give?", color: "border-yellow-500 bg-yellow-500/10" },
          ].map((qkv, i) => (
            <motion.div
              key={qkv.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className={`border rounded-lg p-3 ${qkv.color}`}
            >
              <p className="font-mono text-sm font-bold text-white">{qkv.name}</p>
              <p className="text-xs text-slate-400 mt-1">{qkv.desc}</p>
            </motion.div>
          ))}
        </div>

        {showQKV && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-slate-900 rounded-lg p-4 space-y-2 text-sm"
          >
            <p className="text-slate-300">1. Each word creates a <span className="text-blue-400">Query</span>, <span className="text-green-400">Key</span>, and <span className="text-yellow-400">Value</span> vector</p>
            <p className="text-slate-300">2. <span className="text-blue-400">Query</span> of word A is compared (dot product) with <span className="text-green-400">Key</span> of every word</p>
            <p className="text-slate-300">3. High score = &quot;these words are related&quot;</p>
            <p className="text-slate-300">4. Scores become weights (via softmax) to blend the <span className="text-yellow-400">Values</span></p>
            <div className="mt-3 font-mono text-xs text-purple-300 bg-slate-800 p-3 rounded">
              Attention(Q, K, V) = softmax(Q · K<sup>T</sup> / √d) · V
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("attn.insight") }} />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const layers = [
  { id: "ln1", label: "Layer Norm", color: "bg-yellow-500/20 border-yellow-500/50", textColor: "text-yellow-300" },
  { id: "attn", label: "Self-Attention", color: "bg-blue-500/20 border-blue-500/50", textColor: "text-blue-300" },
  { id: "proj", label: "Projection", color: "bg-cyan-500/20 border-cyan-500/50", textColor: "text-cyan-300" },
  { id: "res1", label: "+ Residual", color: "bg-green-500/20 border-green-500/50", textColor: "text-green-300" },
  { id: "ln2", label: "Layer Norm", color: "bg-yellow-500/20 border-yellow-500/50", textColor: "text-yellow-300" },
  { id: "mlp", label: "MLP", color: "bg-purple-500/20 border-purple-500/50", textColor: "text-purple-300" },
  { id: "res2", label: "+ Residual", color: "bg-green-500/20 border-green-500/50", textColor: "text-green-300" },
];

export default function TransformerBlock() {
  const { t } = useI18n();
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [numLayers, setNumLayers] = useState(12);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("tf.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("tf.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Inside One Transformer Block:</h4>

        <div className="flex flex-col items-center gap-2">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 font-mono"
          >
            Input (token embeddings)
          </motion.div>
          <div className="w-px h-4 bg-slate-600" />

          {/* Layers */}
          {layers.map((layer, i) => (
            <motion.div key={layer.id + i} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                onMouseEnter={() => setActiveLayer(i)}
                onMouseLeave={() => setActiveLayer(null)}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${layer.color} ${layer.textColor} ${
                  activeLayer === i ? "ring-2 ring-white/30 scale-105" : ""
                }`}
              >
                {layer.label}
              </motion.div>
              {i < layers.length - 1 && <div className="w-px h-3 bg-slate-600" />}
              {(layer.id === "res1" || layer.id === "res2") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="absolute -left-16 text-[10px] text-green-400 italic"
                >
                  skip connection
                </motion.div>
              )}
            </motion.div>
          ))}

          <div className="w-px h-4 bg-slate-600" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 font-mono"
          >
            Output → Next Block
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Stacking Blocks (depth = power)
        </h4>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-slate-400">Layers:</span>
          <input
            type="range"
            min={2}
            max={96}
            value={numLayers}
            onChange={(e) => setNumLayers(Number(e.target.value))}
            className="flex-1 accent-purple-500"
          />
          <span className="text-sm text-white font-mono w-8">{numLayers}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {Array.from({ length: numLayers }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="w-6 h-8 bg-gradient-to-b from-purple-500/40 to-blue-500/40 border border-purple-500/30 rounded text-[8px] flex items-center justify-center text-slate-400"
            >
              {i + 1}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-400 space-y-1">
          <p>GPT-2: <span className="text-white">12 layers</span> | GPT-3: <span className="text-white">96 layers</span> | LLaMA-70B: <span className="text-white">80 layers</span></p>
          <p>More layers = deeper understanding, but slower and more expensive.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Residual Connections</h4>
        <p className="text-slate-300 text-sm mb-3">
          The &quot;+ Residual&quot; steps add the original input back to the output. This creates a &quot;shortcut&quot; that helps 
          gradients flow during training and prevents information loss.
        </p>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-center">
          <p className="text-green-400">output = LayerNorm(x) → Attention → + x</p>
          <p className="text-green-400">output = LayerNorm(x) → MLP → + x</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("tf.insight") }} />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Training() {
  const { t } = useI18n();
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [loss, setLoss] = useState(4.5);

  useEffect(() => {
    if (isTraining && epoch < 20) {
      const timer = setTimeout(() => {
        setEpoch(epoch + 1);
        setLoss(4.5 * Math.exp(-0.15 * (epoch + 1)) + 0.3 + Math.random() * 0.1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (epoch >= 20) {
      setIsTraining(false);
    }
  }, [isTraining, epoch]);

  const lossHistory = Array.from({ length: epoch + 1 }, (_, i) =>
    4.5 * Math.exp(-0.15 * i) + 0.3
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("train.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("train.desc") }} />
      </motion.div>

      {/* Training section */}
      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">{t("train.phase")}</h4>
        
        <div className="space-y-4 mb-6">
          {[
            { step: "1", text: t("train.step1"), color: "text-blue-400" },
            { step: "2", text: t("train.step2"), color: "text-green-400" },
            { step: "3", text: t("train.step3"), color: "text-yellow-400" },
            { step: "4", text: t("train.step4"), color: "text-red-400" },
            { step: "5", text: t("train.step5"), color: "text-purple-400" },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white shrink-0">{s.step}</span>
              <span className={`text-sm ${s.color}`}>{s.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <p className="text-xs text-slate-400 mb-2">Training example:</p>
          <p className="font-mono text-sm">
            <span className="text-slate-300">Input: &quot;The capital of France is&quot;</span>
          </p>
          <p className="font-mono text-sm">
            <span className="text-slate-400">Target: </span>
            <span className="text-green-400">&quot;Paris&quot;</span>
          </p>
          <p className="font-mono text-sm">
            <span className="text-slate-400">Predicted: </span>
            <span className="text-red-400">&quot;London&quot;</span>
            <span className="text-slate-500"> → Wrong! Adjust weights.</span>
          </p>
        </div>

        {/* Loss animation */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => { setEpoch(0); setLoss(4.5); setIsTraining(true); }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 transition"
          >
            {t("train.simulate")}
          </button>
          <span className="text-xs text-slate-400">
            {t("train.epoch")} <span className="text-white">{epoch}</span> | {t("train.loss")} <span className="text-white">{loss.toFixed(3)}</span>
          </span>
        </div>

        <div className="relative h-32 bg-slate-900 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            {lossHistory.length > 1 && (
              <polyline
                points={lossHistory.map((l, i) => {
                  const x = (i / 20) * 200;
                  const y = 100 - ((l - 0.2) / 4.5) * 90;
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
              />
            )}
          </svg>
          <div className="absolute top-2 left-2 text-[10px] text-slate-500">{t("train.lossup")}</div>
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">{t("train.steps")}</div>
        </div>
        <p className="text-xs text-slate-400 mt-2">{t("train.lossdesc")}</p>
      </motion.div>

      {/* Inference section */}
      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">{t("train.inference")}</h4>
        <p className="text-slate-300 text-sm mb-4" dangerouslySetInnerHTML={{ __html: t("train.inference.desc") }} />

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
            <p className="text-sm font-bold text-blue-300 mb-2">{t("train.col.training")}</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• {t("train.t1")}</li>
              <li>• {t("train.t2")}</li>
              <li>• {t("train.t3")}</li>
              <li>• {t("train.t4")}</li>
              <li>• {t("train.t5")}</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
            <p className="text-sm font-bold text-green-300 mb-2">{t("train.col.inference")}</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• {t("train.i1")}</li>
              <li>• {t("train.i2")}</li>
              <li>• {t("train.i3")}</li>
              <li>• {t("train.i4")}</li>
              <li>• {t("train.i5")}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/30">
        <h4 className="text-lg font-semibold text-white mb-3">{t("train.pipeline")}</h4>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            "Input Text", "→", "Tokenize", "→", "Embed", "→",
            "Layer Norm", "→", "Self-Attention", "→", "Projection", "→", "Residual", "→",
            "Layer Norm", "→", "MLP", "→", "Residual", "→",
            "(×N layers)", "→", "Final Norm", "→", "Linear + Softmax", "→", "Next Token"
          ].map((s, i) => (
            <span key={i} className={s === "→" ? "text-slate-500" : "bg-slate-800/80 border border-slate-700 rounded px-2 py-1 text-slate-300"}>
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("train.insight") }} />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function calculateLayerNorm(values: number[]): { mean: number; variance: number; normalized: number[] } {
  const n = values.length;
  if (n === 0) return { mean: 0, variance: 0, normalized: [] };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  const eps = 0.00001;
  const normalized = values.map((v) => (v - mean) / Math.sqrt(variance + eps));
  return { mean, variance, normalized };
}

export default function LayerNorm({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [values, setValues] = useState([2.5, -1.0, 4.0, 0.5]);
  const { mean, variance, normalized } = calculateLayerNorm(values);

  const updateValue = (idx: number, val: number) => {
    const nextVals = [...values];
    nextVals[idx] = val;
    setValues(nextVals);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("ln.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("ln.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-2">
            <h4 className="text-base font-semibold text-white flex items-center gap-2">🎓 {t("ln.analogy")}</h4>
            <p className="text-base text-slate-300 leading-relaxed">{t("ln.analogy.desc")}</p>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("ln.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("ln.desc.1") }} />
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col justify-between">
              <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("ln.formula.title")}</h4>
              <div className="bg-slate-900 rounded-lg p-5 font-mono text-base text-center">
                <p className="text-green-400">{t("ln.formula")}</p>
                <p className="text-slate-500 text-xs mt-2">{t("ln.epsilon")}</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("ln.insight") }} />
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("ln.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("ln.desc.2") }} />
          </motion.div>

          {/* Interactive normalization demo */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">
              {locale === "tr" ? "Etkileşimli Dengeleme: Ham Değerleri Ayarla" : "Interactive Normalization: Adjust Raw Values"}
            </h4>

            <div className="space-y-6">
              {values.map((val, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <span className="w-16 text-xs text-slate-400 font-mono">Val {i + 1}</span>
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    step={0.1}
                    value={val}
                    onChange={(e) => updateValue(i, parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <div className="flex gap-4 w-44 shrink-0 font-mono text-sm">
                    <span className="text-slate-300 w-20">Raw: {val.toFixed(1)}</span>
                    <span className="text-blue-400 w-20 text-right font-bold">Norm: {normalized[i].toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Bar Chart Comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h5 className="text-xs text-slate-400 uppercase tracking-wider mb-4 text-center">{t("ln.raw")}</h5>
                <div className="flex items-end justify-center gap-3 h-28 pt-2">
                  {values.map((v, i) => {
                    const height = Math.min(100, Math.max(0, ((v + 5) / 10) * 100));
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 w-12">
                        <div
                          className="w-8 rounded-t bg-slate-600 transition-all duration-150"
                          style={{ height: `${height}%`, minHeight: 4 }}
                        />
                        <span className="text-[10px] text-slate-400">{v.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h5 className="text-xs text-slate-400 uppercase tracking-wider mb-4 text-center">{t("ln.normalized")}</h5>
                <div className="flex items-end justify-center gap-3 h-28 pt-2">
                  {normalized.map((v, i) => {
                    const height = Math.min(100, Math.max(0, ((v + 2.5) / 5) * 100));
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 w-12">
                        <div
                          className="w-8 rounded-t bg-blue-500 transition-all duration-150"
                          style={{ height: `${height}%`, minHeight: 4 }}
                        />
                        <span className="text-[10px] text-blue-300 font-semibold">{v.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400 flex flex-wrap gap-4 font-mono">
              <div>{locale === "tr" ? "Ortalama:" : "Calculated Mean (μ):"} <span className="text-white font-bold">{mean.toFixed(3)}</span></div>
              <div>{locale === "tr" ? "Varyans:" : "Variance (σ²):"} <span className="text-white font-bold">{variance.toFixed(3)}</span></div>
            </div>
          </motion.div>

      {/* Collapsible Senior Developer Mode */}
      <motion.div variants={item}>
        <SeniorDeveloperMode
          contentEn={
            <>
              <p>
                In deep neural networks, Layer Normalization (LayerNorm) is applied across the channel/feature dimensions to stabilize the distribution of activations during training.
              </p>
              <p className="mt-2 font-semibold">Standard LayerNorm Formulation:</p>
              <p className="text-slate-300">
                Given a vector <code>x \in \mathbb&#123;R&#125;^d</code> representing the feature activations of a single token:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"y = LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
              </div>
              <p className="text-slate-300 mt-2">
                where <code>\mu</code> and <code>\sigma^2</code> are the mean and variance computed over the feature dimensions of the single token:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-xs text-blue-400 overflow-x-auto space-y-1">
                <p>{"μ = (1/d) * Σ x_i"}</p>
                <p>{"σ² = (1/d) * Σ (x_i - μ)²"}</p>
              </div>
              <p className="text-slate-300 mt-2">
                <code>\gamma</code> (gain) and <code>\beta</code> (bias) are learnable parameters initialized to 1 and 0 respectively, which allow the network to restore representation capacity if necessary.
              </p>
              <p className="mt-3 font-semibold">RMSNorm Optimization:</p>
              <p className="text-slate-300">
                Modern models (LLaMA, Gemma) replace standard LayerNorm with <strong>RMSNorm</strong>. It drops the mean subtraction step entirely, only rescaling by the Root Mean Square of the activations:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
              </div>
              <p className="text-slate-300 mt-2">
                This reduces computational complexity (no mean tracking or extra subtractions) and yields identical downstream task performance, speeding up GPU execution by 10-50% in the normalization kernels.
              </p>
            </>
          }
          contentTr={
            <>
              <p>
                Derin yapay sinir ağlarında Katman Normalizasyonu (LayerNorm), eğitim boyunca aktivasyonların dağılımını sabitlemek için özellik/kanal boyutları boyunca uygulanır.
              </p>
              <p className="mt-2 font-semibold">Standart LayerNorm Formülü:</p>
              <p className="text-slate-300">
                Tek bir token&apos;a ait özellikleri temsil eden bir <code>x \in \mathbb&#123;R&#125;^d</code> vektörü için:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"y = LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
              </div>
              <p className="text-slate-300 mt-2">
                Burada <code>\mu</code> ve <code>\sigma^2</code>, tek bir token&apos;ın kendi özellikleri üzerinden hesaplanan ortalaması ve varyansıdır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-xs text-blue-400 overflow-x-auto space-y-1">
                <p>{"μ = (1/d) * Σ x_i"}</p>
                <p>{"σ² = (1/d) * Σ (x_i - μ)²"}</p>
              </div>
              <p className="text-slate-300 mt-2">
                <code>\gamma</code> (gain / ölçek) ve <code>\beta</code> (bias / kayma) sırasıyla 1 ve 0 ile başlayan öğrenilebilir parametrelerdir. Ağın gerekirse temsil gücünü geri kazanmasını sağlarlar.
              </p>
              <p className="mt-3 font-semibold">RMSNorm Optimizasyonu:</p>
              <p className="text-slate-300">
                LLaMA ve Gemma gibi modern modeller standart LayerNorm yerine <strong>RMSNorm</strong> kullanır. RMSNorm, ortalama çıkarma adımını tamamen atlar ve girdiyi sadece karekök ortalama değeriyle (Root Mean Square) böler:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
              </div>
              <p className="text-slate-300 mt-2">
                Bu basitleştirme, hesaplama maliyetini düşürür (ortalama hesaplamaya ve çıkarma işlemlerine gerek kalmaz) ve benzer model performansı sağlarken GPU normalizasyon çekirdeklerinin %10 ila %50 daha hızlı çalışmasını sağlar.
              </p>
            </>
          }
        />
      </motion.div>
        </>
      )}
    </motion.div>
  );
}

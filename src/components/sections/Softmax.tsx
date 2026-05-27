"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function softmax(values: number[]): number[] {
  const maxVal = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const labelsEn = ["cat", "dog", "fish", "car", "mat"];
const labelsTr = ["kedi", "köpek", "balık", "araba", "minder"];

export default function Softmax({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [rawValues, setRawValues] = useState([2.0, 1.0, 0.1, -1.0, 3.5]);
  const probs = softmax(rawValues);

  const labels = locale === "tr" ? labelsTr : labelsEn;

  const updateValue = (idx: number, val: number) => {
    const newVals = [...rawValues];
    newVals[idx] = val;
    setRawValues(newVals);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("sm.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("sm.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">
              {t("sm.interactive")}
            </h4>

            <div className="space-y-4">
              {rawValues.map((val, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-12 text-xs text-slate-400 font-mono">{labels[i]}</span>
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    step={0.1}
                    value={val}
                    onChange={(e) => updateValue(i, parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="w-12 text-xs text-slate-300 font-mono text-right">{val.toFixed(1)}</span>
                  <div className="w-32 flex items-center gap-2">
                    <motion.div
                      className="h-5 bg-blue-500 rounded"
                      animate={{ width: `${probs[i] * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <span className="text-xs text-blue-300 font-mono whitespace-nowrap">
                      {(probs[i] * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-400">
              {t("sm.sum")} <span className="text-white font-mono">{probs.reduce((a, b) => a + b, 0).toFixed(4)}</span> {t("sm.always")}
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("sm.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("sm.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("sm.formula.title")}</h4>
            <div className="bg-slate-900 rounded-lg p-5 font-mono text-base text-center space-y-2.5">
              <p className="text-green-400">softmax(xᵢ) = e^xᵢ / Σ(e^xⱼ)</p>
              <p className="text-slate-500 text-xs">{t("sm.formula.desc")}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("sm.example")}</h4>
            <div className="bg-slate-900 rounded-lg p-5 font-mono text-sm space-y-1.5 overflow-x-auto">
              <p className="text-slate-400">{t("sm.raw")} [{rawValues.map(v => v.toFixed(1)).join(", ")}]</p>
              <p className="text-blue-400">{t("sm.evalues")} [{rawValues.map(v => Math.exp(v).toFixed(2)).join(", ")}]</p>
              <p className="text-yellow-400">{t("sm.sumval")} {rawValues.map(v => Math.exp(v)).reduce((a, b) => a + b, 0).toFixed(2)}</p>
              <p className="text-green-400">{t("sm.probs")} [{probs.map(p => p.toFixed(4)).join(", ")}]</p>
            </div>
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("sm.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("sm.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("sm.insight") }} />
          </motion.div>

          <motion.div variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    In GPU kernels, a naive implementation of Softmax:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                    {"Softmax(x_i) = e^(x_i) / Σ e^(x_j)"}
                  </div>
                  <p className="text-slate-300 mt-2">
                    suffers from numerical instability. Large positive values of <code>x_i</code> lead to float overflow (exponents of values greater than ~88 exceed single-precision float capacity). To guarantee numerical stability, hardware implementations subtract the maximum input value:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                    {"Softmax(x_i) = Softmax(x_i - C)  where  C = max_j(x_j)"}
                  </div>
                  <p className="text-slate-300 mt-2 font-semibold">Temperature Scaling Mathematics:</p>
                  <p className="text-slate-300">
                    During decoding/sampling, temperature <code>T &gt; 0</code> scales the logits before Softmax:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                    {"P(x_i | x_{<t}) = e^(x_i / T) / Σ e^(x_j / T)"}
                  </div>
                  <p className="text-slate-300 mt-2">
                    As <code>T \to 0</code>, the probability of the maximum value approaches 1, reducing the operation to a deterministic ArgMax selection. As <code>T \to \infty</code>, the scaling drives all exponents to 1, causing the distribution to converge to a uniform distribution <code>1 / V</code>.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    GPU çekirdeklerinde (kernels), Softmax fonksiyonunun doğrudan hesaplanması:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                    {"Softmax(x_i) = e^(x_i) / Σ e^(x_j)"}
                  </div>
                  <p className="text-slate-300 mt-2">
                    sayısal kararsızlığa yol açar. Büyük pozitif <code>x_i</code> değerleri için <code>e^(x_i)</code> hesaplanırken float taşması (overflow) meydana gelir (örneğin single-precision float değerleri ~88&apos;in üzerindeki üslerde taşma yaşar). Bunu önlemek amacıyla, kararlı bir GPU uygulaması için logit değerlerinden maksimum değer (C) çıkarılır:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                    {"Softmax(x_i) = Softmax(x_i - C)  burada  C = max_j(x_j)"}
                  </div>
                  <p className="text-slate-300 mt-2 font-semibold">Sıcaklık (Temperature) Ölçekleme Matematiği:</p>
                  <p className="text-slate-300">
                    Metin üretme (kod çözme) sırasında sıcaklık parametresi <code>T &gt; 0</code>, Softmax öncesi logit değerlerini bölerek dağılımı kontrol eder:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                    {"P(x_i | x_{<t}) = e^(x_i / T) / Σ e^(x_j / T)"}
                  </div>
                  <p className="text-slate-300 mt-2">
                    <code>T \to 0</code> durumunda en büyük değere sahip elemanın olasılığı 1&apos;e yaklaşır ve sistem deterministik ArgMax seçimine dönüşür. <code>T \to \infty</code> durumunda ise tüm logitlerin üs değerleri 1&apos;e yaklaşarak dağılımın üniform (eşit dağılımlı) <code>1 / V</code> olmasına neden olur.
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

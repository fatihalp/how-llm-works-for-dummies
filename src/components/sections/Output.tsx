"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const generationStepsEn = [
  { prompt: "The cat sat on the", predictions: [{ word: "mat", prob: 0.35 }, { word: "floor", prob: 0.2 }, { word: "roof", prob: 0.15 }, { word: "bed", prob: 0.12 }, { word: "chair", prob: 0.08 }] },
  { prompt: "The cat sat on the mat", predictions: [{ word: ".", prob: 0.4 }, { word: "and", prob: 0.25 }, { word: ",", prob: 0.15 }, { word: "while", prob: 0.1 }, { word: "in", prob: 0.05 }] },
  { prompt: "The cat sat on the mat.", predictions: [{ word: "It", prob: 0.3 }, { word: "The", prob: 0.2 }, { word: "She", prob: 0.15 }, { word: "He", prob: 0.1 }, { word: "Then", prob: 0.08 }] },
];

const generationStepsTr = [
  { prompt: "Kedi halının üzerine", predictions: [{ word: "oturdu", prob: 0.45 }, { word: "uzandı", prob: 0.25 }, { word: "zıpladı", prob: 0.12 }, { word: "yattı", prob: 0.1 }, { word: "uyudu", prob: 0.08 }] },
  { prompt: "Kedi halının üzerine oturdu", predictions: [{ word: ".", prob: 0.5 }, { word: "ve", prob: 0.2 }, { word: "sonra", prob: 0.12 }, { word: "hızlıca", prob: 0.08 }, { word: "keyifle", prob: 0.05 }] },
  { prompt: "Kedi halının üzerine oturdu.", predictions: [{ word: "Orada", prob: 0.35 }, { word: "Çünkü", prob: 0.25 }, { word: "Sonra", prob: 0.15 }, { word: "Hemen", prob: 0.15 }, { word: "Bir", prob: 0.1 }] },
];

export default function Output({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generationSteps = locale === "tr" ? generationStepsTr : generationStepsEn;

  useEffect(() => {
    if (isGenerating && step < generationSteps.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 1500);
      return () => clearTimeout(timer);
    } else if (step >= generationSteps.length - 1) {
      setIsGenerating(false);
    }
  }, [isGenerating, step, generationSteps]);

  // Reset step if language switches
  useEffect(() => {
    setStep(0);
    setIsGenerating(false);
  }, [locale]);

  const currentStep = generationSteps[step] || generationSteps[0];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("out.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("out.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("out.watch")}</h4>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-4 font-mono text-sm">
              <span className="text-slate-300">{currentStep.prompt}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="text-blue-500 font-bold"
              >
                |
              </motion.span>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => { setStep(0); setIsGenerating(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 transition cursor-pointer"
              >
                {t("out.generate")}
              </button>
              <button
                onClick={() => { setStep(0); setIsGenerating(false); }}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition cursor-pointer"
              >
                {t("out.reset")}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400">{t("out.predictions")}</p>
              {currentStep.predictions.map((pred, i) => (
                <motion.div
                  key={pred.word}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className={`w-16 text-xs font-mono ${i === 0 ? "text-green-400 font-bold" : "text-slate-400"}`}>
                    {pred.word}
                  </span>
                  <div className="flex-1 h-4 bg-slate-900 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.prob * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`h-full rounded ${i === 0 ? "bg-green-500" : "bg-slate-600"}`}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{(pred.prob * 100).toFixed(0)}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("out.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("out.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("out.loop")}</h4>
            <div className="flex flex-col items-start gap-3 pl-2">
              {[t("out.loop.1"), t("out.loop.2"), t("out.loop.3"), t("out.loop.4"), t("out.loop.5")].map((stepText, i) => (
                <motion.div
                  key={stepText}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-300 font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-300">{stepText}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("out.temp")}</h4>
            <p className="text-slate-300 text-sm mb-3" dangerouslySetInnerHTML={{ __html: t("out.temp.desc") }} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { temp: t("out.temp.low"), desc: t("out.temp.low.desc"), color: "border-blue-500 bg-blue-500/10" },
                { temp: t("out.temp.med"), desc: t("out.temp.med.desc"), color: "border-green-500 bg-green-500/10" },
                { temp: t("out.temp.high"), desc: t("out.temp.high.desc"), color: "border-red-500 bg-red-500/10" },
              ].map((item) => (
                <div key={item.temp} className={`border rounded-lg p-3 ${item.color}`}>
                  <p className="text-sm font-bold text-white">{item.temp}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("out.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("out.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("out.insight") }} />
          </motion.div>

      <motion.div variants={item}>
        <SeniorDeveloperMode
          contentEn={
            <>
              <p>
                Causal self-attention scales quadratically <code>O(N^2)</code> with context length <code>N</code>. Since generation is autoregressive, re-evaluating the full history on every forward pass causes huge computational redundancies.
              </p>
              <p className="mt-2 font-semibold">The KV Cache Optimization:</p>
              <p className="text-slate-300">
                To bypass redundant matrix multiplications, production inference engines implement the **KV Cache**. For each layer, Key and Value vectors of past tokens are stored in memory. At step <code>t</code>, we only project the Query (Q), Key (K), and Value (V) vectors for the <em>newly generated token</em>:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                {"K_cached^(l) ← [K_cached^(l); k_t^(l)],  V_cached^(l) ← [V_cached^(l); v_t^(l)]"}
              </div>
              <p className="text-slate-300 mt-2">
                This reduces the attention computation for the current token to <code>O(N)</code> rather than <code>O(N^2)</code>, converting the memory-bound stage of generation to a linear scaling complexity.
              </p>
              <p className="mt-3 font-semibold">Advanced Decoding Strategies:</p>
              <p className="text-slate-300">
                Rather than selecting the token with the highest score (greedy decoding, which can lead to repetitive loops), models sample from filtered subsets of logits:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                <li><strong>Top-K Sampling:</strong> Caps the selection pool to the <code>K</code> tokens with the highest probabilities.</li>
                <li><strong>Top-p (Nucleus) Sampling:</strong> Dynamically calculates the smallest set of tokens whose cumulative probability exceeds the threshold <code>p</code> (e.g., <code>p = 0.90</code>). Tokens outside this &quot;nucleus&quot; are discarded, preventing the model from picking nonsensical outliers while preserving creativity.</li>
              </ul>
            </>
          }
          contentTr={
            <>
              <p>
                Nedensel (causal) öz-dikkat mekanizması bağlam boyutu <code>N</code> ile karesel <code>O(N^2)</code> olarak büyür. Metin üretimi otoregresif olduğu için, her adımda cümlenin başından itibaren tüm vektörleri yeniden çarpmak aşırı derecede verimsizdir.
              </p>
              <p className="mt-2 font-semibold">KV Cache (Anahtar-Değer Bellekleme) Optimizasyonu:</p>
              <p className="text-slate-300">
                Bu karesel maliyetten kaçınmak için endüstriyel sunucularda **KV Cache** kullanılır. Her bir katman için geçmiş kelimelerin Key (K) ve Value (V) vektörleri bellekte tutulur. Yeni bir kelime üretilirken sadece <em>o yeni kelimenin</em> Query, Key ve Value vektörleri hesaplanır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto font-bold">
                {"K_cached^(l) ← [K_cached^(l); k_t^(l)],  V_cached^(l) ← [V_cached^(l); v_t^(l)]"}
              </div>
              <p className="text-slate-300 mt-2">
                Daha sonra yeni Query vektörü, bellekteki birleşik K ve V vektörleri ile çarpılır. Bu sayede her adımda yapılan karesel hesaplama yükü doğrusal <code>O(N)</code> karmaşıklığına indirgenmiş olur.
              </p>
              <p className="mt-3 font-semibold">Gelişmiş Kod Çözme (Decoding) Stratejileri:</p>
              <p className="text-slate-300">
                Her zaman en olası kelimeyi seçmek (Greedy Decoding) yerine, rastgelelik ve yaratıcılık eklemek amacıyla olasılık dağılımından örnekleme yapılır:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                <li><strong>Top-K Örnekleme:</strong> En yüksek olasılığa sahip ilk <code>K</code> adet kelime havuzunu belirler ve gerisini eler.</li>
                <li><strong>Top-p (Nucleus) Örnekleme:</strong> Kümülâtif (toplam) olasılıkları <code>p</code> barajını (örn. <code>p = 0.90</code>) aşana kadar en olası kelimeleri havuzda toplar. Bu havuz dışındaki kelimeler tamamen elenerek anlamsız kelimelerin seçilmesi engellenir.</li>
              </ul>
            </>
          }
        />
      </motion.div>
        </>
      )}
    </motion.div>
  );
}

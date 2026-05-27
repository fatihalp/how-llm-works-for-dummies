"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Training({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
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
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("train.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("train.desc.0") }} />
          </motion.div>

          {/* Steps List */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">{t("train.phase")}</h4>
            
            <div className="space-y-4 mb-6">
              {[
                { step: "1", text: t("train.step1"), color: "text-blue-400" },
                { step: "2", text: t("train.step2"), color: "text-green-400" },
                { step: "3", text: t("train.step3"), color: "text-yellow-400" },
                { step: "4", text: t("train.step4"), color: "text-red-400" },
                { step: "5", text: t("train.step5"), color: "text-blue-300" },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white shrink-0 font-bold">{s.step}</span>
                  <span className={`text-sm ${s.color}`}>{s.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">{t("train.example")}</p>
              <p className="font-mono text-sm">
                <span className="text-slate-300">Giriş (Input): &quot;{locale === "tr" ? "Türkiye'nin başkenti" : "The capital of France is"}&quot;</span>
              </p>
              <p className="font-mono text-sm">
                <span className="text-slate-400">Hedef (Target): </span>
                <span className="text-green-400">&quot;{locale === "tr" ? "Ankara" : "Paris"}&quot;</span>
              </p>
              <p className="font-mono text-sm">
                <span className="text-slate-400">Tahmin (Predicted): </span>
                <span className="text-red-400">&quot;{locale === "tr" ? "İstanbul" : "London"}&quot;</span>
                <span className="text-slate-500"> {locale === "tr" ? " → Yanlış! Ağırlıkları güncelle." : " → Wrong! Adjust weights."}</span>
              </p>
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{locale === "tr" ? "Büyük Veri İhtiyacı" : "Massive Data Requirements"}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("train.desc.1") }} />
          </motion.div>

          {/* Big Picture Pipeline */}
          <motion.div variants={item} className="bg-gradient-to-r from-blue-950/30 to-slate-900/30 rounded-xl p-6 border border-slate-700/50">
            <h4 className="text-md font-semibold text-white mb-3">
              {locale === "tr" ? "Transformer İşlem Akışı (Büyük Resim)" : "Transformer Pipeline (The Big Picture)"}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                locale === "tr" ? "Metin Girişi" : "Input Text", "→", 
                locale === "tr" ? "Tokenize" : "Tokenize", "→", 
                locale === "tr" ? "Gömme (Embed)" : "Embed", "→",
                locale === "tr" ? "Dengeleme (Norm)" : "Norm", "→", 
                locale === "tr" ? "Öz-Dikkat (Attention)" : "Self-Attention", "→", 
                locale === "tr" ? "Yansıtma" : "Projection", "→", 
                locale === "tr" ? "Artık (Residual)" : "Residual", "→",
                locale === "tr" ? "Dengeleme (Norm)" : "Norm", "→", 
                locale === "tr" ? "MLP Katmanı" : "MLP", "→", 
                locale === "tr" ? "Artık (Residual)" : "Residual", "→",
                locale === "tr" ? "(×N Katman Tekrarı)" : "(×N layers)", "→", 
                locale === "tr" ? "Son Norm" : "Final Norm", "→", 
                locale === "tr" ? "Lineer + Softmax" : "Linear + Softmax", "→", 
                locale === "tr" ? "Sonraki Kelime" : "Next Token"
              ].map((s, i) => (
                <span key={i} className={s === "→" ? "text-slate-500 font-bold" : "bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300"}>
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            <span dangerouslySetInnerHTML={{ __html: t("train.insight") }} />
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{locale === "tr" ? "Hata Payı ve Simülasyon" : "Loss & Training Simulation"}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("train.desc.2") }} />
          </motion.div>

          {/* Loss animation */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => { setEpoch(0); setLoss(4.5); setIsTraining(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 transition cursor-pointer"
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
                    stroke="#0071e3"
                    strokeWidth="2"
                  />
                )}
              </svg>
              <div className="absolute top-2 left-2 text-[10px] text-slate-500">{t("train.lossup")}</div>
              <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">{t("train.steps")}</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">{t("train.lossdesc")}</p>
          </motion.div>

          {/* Senior Developer Mode */}
          <motion.div variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    Pre-training optimizes the model parameters <code>&theta;</code> by maximizing the likelihood of the training corpus. Mathematically, we minimize the cross-entropy loss function over sequence batches:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    L(\theta) = - \frac&#123;1&#125;&#123;N&#125; \sum_&#123;i=1&#125;^N \log P(x_i | x_&#123;&lt;i&#125;; &theta;)
                  </div>
                  <p className="mt-2 font-semibold">Optimizer: AdamW</p>
                  <p className="text-slate-300 font-sans">
                    To update the parameters <code>&theta;</code>, we use the <strong>AdamW</strong> optimizer, which computes adaptive learning rates for individual parameters using estimates of the first (mean) and second (uncentered variance) moments of the gradients, with decoupled weight decay:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-xs text-blue-400 overflow-x-auto space-y-1">
                    <p>g_t = \nabla_\theta L(\theta_&#123;t-1&#125;)</p>
                    <p>m_t = \beta_1 m_&#123;t-1&#125; + (1-\beta_1) g_t \quad (\text&#123;First moment&#125;)</p>
                    <p>v_t = \beta_2 v_&#123;t-1&#125; + (1-\beta_2) g_t^2 \quad (\text&#123;Second moment&#125;)</p>
                    <p>\theta_t = \theta_&#123;t-1&#125; - \frac&#123;\alpha&#125;&#123;\sqrt&#123;v_t&#125; + \epsilon&#125; m_t - \lambda \theta_&#123;t-1&#125; \quad (\text&#123;Weight decay update&#125;)</p>
                  </div>
                  <p className="mt-2 font-semibold">Training Phases:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Pre-training (Next Token Prediction):</strong> The model reads trillions of tokens from the web to learn grammar, syntax, facts, and reasoning patterns. Generates base model.</li>
                    <li><strong>Supervised Fine-Tuning (SFT):</strong> Tuned on high-quality demonstration conversations (queries and responses written by humans) to teach the model to act as a helpful chatbot.</li>
                    <li><strong>Alignment (RLHF/DPO):</strong> Uses **Reinforcement Learning from Human Feedback (RLHF)** via PPO or **Direct Preference Optimization (DPO)** to align model outputs with human preferences regarding truthfulness, safety, and utility.</li>
                  </ol>
                </>
              }
              contentTr={
                <>
                  <p>
                    Ön-eğitim (pre-training) aşamasında, model parametreleri <code>&theta;</code>, veri kümesindeki kelimelerin olasılığını en üst düzeye çıkaracak şekilde eğitilir. Matematiksel olarak çapraz entropi (cross-entropy) kaybı minimize edilir:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    L(\theta) = - \frac&#123;1&#125;&#123;N&#125; \sum_&#123;i=1&#125;^N \log P(x_i | x_&#123;&lt;i&#125;; &theta;)
                  </div>
                  <p className="mt-2 font-semibold">Optimizasyon Algoritması: AdamW</p>
                  <p className="text-slate-300 font-sans">
                    Parametrelerin <code>&theta;</code> güncellenmesinde **AdamW** optimizasyon algoritması kullanılır. Bu algoritma, gradyanların birinci (ortalama) ve ikinci (varyans) momentlerini hesaplayarak parametre bazlı adaptif öğrenme adımları belirlerken, ağırlık sönümlemeyi (weight decay) decoupled olarak uygular:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-xs text-blue-400 overflow-x-auto space-y-1">
                    <p>g_t = \nabla_\theta L(\theta_&#123;t-1&#125;)</p>
                    <p>m_t = \beta_1 m_&#123;t-1&#125; + (1-\beta_1) g_t \quad (\text&#123;Birinci moment - ivme&#125;)</p>
                    <p>v_t = \beta_2 v_&#123;t-1&#125; + (1-\beta_2) g_t^2 \quad (\text&#123;İkinci moment - varyans&#125;)</p>
                    <p>\theta_t = \theta_&#123;t-1&#125; - \frac&#123;\alpha&#125;&#123;\sqrt&#123;v_t&#125; + \epsilon&#125; m_t - \lambda \theta_&#123;t-1&#125; \quad (\text&#123;Ağırlık sönümleme güncellemesi&#125;)</p>
                  </div>
                  <p className="mt-2 font-semibold">Model Eğitim Aşamaları:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Ön-Eğitim (Pre-training):</strong> Trilyonlarca web verisi üzerinde bir sonraki token tahmini yaptırılır. Model dilin yapısını, genel kültür bilgilerini ve mantık kurallarını öğrenir (Taban Model oluşur).</li>
                    <li><strong>Denetimli İnce Ayar (Supervised Fine-Tuning - SFT):</strong> Modelin bir asistan gibi davranmasını sağlamak için, insan eliyle yazılmış soru-cevap veri setleri üzerinde ince ayar yapılır.</li>
                    <li><strong>İnsan Tercihleri ile Hizalama (RLHF/DPO):</strong> Modelin zararlı içerikler üretmesini önlemek, daha doğru ve faydalı olmasını sağlamak için **İnsan Geri Bildirimiyle Pekiştirmeli Öğrenme (RLHF)** veya **Direct Preference Optimization (DPO)** uygulanır.</li>
                  </ol>
                </>
              }
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const sentenceEn = ["The", "cat", "sat", "on", "the", "mat"];
const sentenceTr = ["Kedi", "halının", "üzerine", "usulca", "uzandı"];

const attentionWeightsEn: number[][] = [
  [0.4, 0.1, 0.1, 0.1, 0.2, 0.1],
  [0.1, 0.3, 0.2, 0.05, 0.05, 0.3],
  [0.15, 0.3, 0.2, 0.1, 0.1, 0.15],
  [0.1, 0.1, 0.3, 0.2, 0.1, 0.2],
  [0.3, 0.05, 0.05, 0.1, 0.4, 0.1],
  [0.05, 0.3, 0.15, 0.15, 0.05, 0.3],
];

const attentionWeightsTr: number[][] = [
  [0.4, 0.2, 0.1, 0.1, 0.2],
  [0.2, 0.3, 0.15, 0.05, 0.3],
  [0.1, 0.15, 0.4, 0.15, 0.2],
  [0.05, 0.1, 0.2, 0.4, 0.25],
  [0.1, 0.25, 0.15, 0.2, 0.3],
];

export default function SelfAttention({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [showQKV, setShowQKV] = useState(false);

  const sentence = locale === "tr" ? sentenceTr : sentenceEn;
  const attentionWeights = locale === "tr" ? attentionWeightsTr : attentionWeightsEn;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("attn.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("attn.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">
              {t("attn.hover")}
            </h4>
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {sentence.map((word, i) => (
                <motion.div
                  key={i}
                  onMouseEnter={() => setHoveredWord(i)}
                  onMouseLeave={() => setHoveredWord(null)}
                  whileHover={{ scale: 1.1 }}
                  className={`px-4 py-2.5 rounded-lg font-mono text-base cursor-pointer transition-all ${
                    hoveredWord === i
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
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
                  {t("attn.attends", { word: sentence[hoveredWord] })}
                </p>
                <div className="flex justify-center gap-2 items-end h-24">
                  {sentence.map((word, i) => {
                    const weight = attentionWeights[hoveredWord]?.[i] || 0;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-12 rounded-t bg-blue-500 transition-all"
                          style={{ height: `${weight * 80}px`, opacity: 0.3 + weight * 2 }}
                        />
                        <span className="text-xs text-slate-400">{word}</span>
                        <span className="text-[10px] text-blue-300 font-semibold">{(weight * 100).toFixed(0)}%</span>
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
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("attn.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("attn.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide">{t("attn.qkv")}</h4>
              <button
                onClick={() => setShowQKV(!showQKV)}
                className="text-xs px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition cursor-pointer"
              >
                {showQKV ? t("attn.hide") : t("attn.show")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { name: t("attn.q"), desc: t("attn.q.desc"), color: "border-blue-500 bg-blue-500/10" },
                { name: t("attn.k"), desc: t("attn.k.desc"), color: "border-green-500 bg-green-500/10" },
                { name: t("attn.v"), desc: t("attn.v.desc"), color: "border-yellow-500 bg-yellow-500/10" },
              ].map((qkv, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
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
                <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: t("attn.step1") }} />
                <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: t("attn.step2") }} />
                <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: t("attn.step3") }} />
                <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: t("attn.step4") }} />
                <div className="mt-3 font-mono text-xs text-blue-300 bg-slate-800 p-3 rounded">
                  Attention(Q, K, V) = softmax(Q · K<sup>T</sup> / √d<sub>k</sub>) · V
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("attn.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("attn.desc.2") }} />
          </motion.div>

          {/* Projection Explanation Embedded Card */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
            <h4 className="text-md font-semibold text-white">🔀 {locale === "tr" ? "Çok Başlı Dikkat ve Yansıtma (Projection)" : "Multi-Head Attention & Projection"}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {locale === "tr" 
                ? "Yapay zeka sadece tek bir odaklanma noktası kullanmaz. Tıpkı bir cümlenin hem öznesini, hem yüklemini hem de sıfatını aynı anda incelemek gibi, sistem birden fazla 'dikkat başı' (attention head) çalıştırır. Her bir baş cümlenin farklı bir yönüne odaklanır. Son aşamada ise, tüm bu dikkat başlarından çıkan çıktılar uç uca birleştirilir ve doğrusal bir yansıtma matrisi (W_O) ile çarpılarak tek bir sonuca dönüştürülür."
                : "The AI doesn't just focus on one thing at a time. It uses multiple 'attention heads' in parallel, each focusing on a different aspect (e.g., syntax, tense, subject-verb relations). In the end, all attention outputs are concatenated and multiplied by a linear projection weight matrix (W_O) to map them back to the model's core dimension."}
            </p>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("attn.insight") }} />
          </motion.div>

      <motion.div variants={item}>
        <SeniorDeveloperMode
          contentEn={
            <>
              <p>
                In Decoder-only models (e.g., GPT, LLaMA), self-attention is <strong>causal</strong>. The attention mechanism is prohibited from attending to future tokens. This is achieved by adding a causal mask matrix <code>M</code> where elements above the diagonal are set to <code>-\infty</code> before applying Softmax:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"Attention(Q, K, V) = Softmax( (Q · Kᵀ / √d_k) + M ) · V"}
              </div>
              <p className="mt-2">
                where <code>M_&#123;i, j&#125; = 0</code> if <code>j \le i</code>, and <code>M_&#123;i, j&#125; = -\infty</code> if <code>j &gt; i</code>. The scaling factor <code>\sqrt&#123;d_k&#125;</code> prevents the dot products from growing too large in magnitude, which would push the softmax function into regions with extremely small gradients.
              </p>
              <p className="mt-2 font-semibold">Multi-Head Attention (MHA) & Projection:</p>
              <p className="text-slate-300">
                To capture different types of contextual dependencies, we run <code>h</code> attention heads in parallel and concatenate their outputs before projecting:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · Wᴼ"}
              </div>
              <p className="mt-2">
                where <code>W^O \in \mathbb&#123;R&#125;^&#123;h \cdot d_v \times d_&#123;model&#125;&#125;</code> mixes the information learned by different attention heads.
              </p>
              <p className="mt-2 font-semibold">Real-world Optimizations:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                <li><strong>Grouped-Query Attention (GQA):</strong> Modern architectures (like LLaMA-3) share key/value projections across groups of query heads (e.g., 8 query heads per 1 KV head) to reduce memory bandwidth bottleneck in caching KV tensors during inference.</li>
                <li><strong>FlashAttention:</strong> Rather than constructing the intermediate <code>N \times N</code> attention matrix in slow GPU High-Bandwidth Memory (HBM), FlashAttention computes attention block-by-block on GPU SRAM using online softmax and tiling, achieving 2x to 4x speedups.</li>
              </ul>
            </>
          }
          contentTr={
            <>
              <p>
                Sadece Dekoder içeren modellerde (örn. GPT, LLaMA), öz-dikkat mekanizması <strong>nedenseldir (causal)</strong>. Yani bir kelimenin kendisinden sonraki kelimelere bakması maskelenerek engellenir. Bu, Softmax işleminden önce üst üçgen matris elemanlarının <code>-\infty</code> ile çarpılmasıyla (maske matrisi <code>M</code> eklenmesiyle) sağlanır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"Attention(Q, K, V) = Softmax( (Q · Kᵀ / √d_k) + M ) · V"}
              </div>
              <p className="mt-2">
                Burada <code>j &gt; i</code> ise <code>M_&#123;i, j&#125; = -\infty</code>, aksi halde <code>0</code>&apos;dır. <code>\sqrt&#123;d_k&#125;</code> ölçekleme faktörü, matris çarpımının büyümesini engeller; aksi halde softmax gradyanları sıfırlanıp sönümlenirdi (gradient vanishing).
              </p>
              <p className="mt-2 font-semibold">Çok Başlı Dikkat (Multi-Head Attention) ve Yansıtma:</p>
              <p className="text-slate-300">
                Farklı konumsal ve anlamsal ilişkileri yakalamak için <code>h</code> tane dikkat kafası paralel çalıştırılır, çıktılar birleştirilir ve yansıtılır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · Wᴼ"}
              </div>
              <p className="mt-2">
                Burada <code>W^O \in \mathbb&#123;R&#125;^&#123;h \cdot d_v \times d_&#123;model&#125;&#125;</code> matrisi, tüm dikkat kafalarından gelen bilgileri harmanlayarak modelin ana boyutuna geri indirger.
              </p>
              <p className="mt-2 font-semibold">Gerçek Hayattaki Optimizasyonlar:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                <li><strong>Grouped-Query Attention (GQA):</strong> LLaMA-3 gibi modern modeller, çıkarım (inference) sırasında KV-cache belleğinin darboğaz oluşturmasını engellemek için Key ve Value kafalarını gruplayarak paylaşır (örn. 8 Query kafasına 1 KV kafası).</li>
                <li><strong>FlashAttention:</strong> <code>N \times N</code> boyutundaki devasa dikkat matrisini GPU ana belleğine (HBM) yazmak yerine, tiling ve çevrimiçi softmax teknikleriyle doğrudan GPU SRAM (hızlı bellek) üzerinde blok blok hesaplayarak 2 ila 4 kat hız kazandırır.</li>
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const words = ["king", "queen", "man", "woman", "cat"];
const embeddings: Record<string, number[]> = {
  king:  [0.9, 0.1, 0.8, 0.7, -0.2, 0.5, 0.3, -0.1],
  queen: [0.85, 0.9, 0.75, 0.6, -0.15, 0.55, 0.35, -0.05],
  man:   [0.7, 0.05, 0.6, 0.5, -0.3, 0.4, 0.2, -0.2],
  woman: [0.65, 0.85, 0.55, 0.45, -0.25, 0.45, 0.25, -0.15],
  cat:   [-0.3, 0.1, -0.5, 0.2, 0.8, -0.4, 0.6, 0.7],
};

function getBarColor(value: number) {
  if (value > 0.5) return "bg-green-400";
  if (value > 0) return "bg-green-600";
  if (value > -0.5) return "bg-red-600";
  return "bg-red-400";
}

const wordTranslations: Record<string, Record<string, string>> = {
  tr: { king: "kral", queen: "kraliçe", man: "erkek", woman: "kadın", cat: "kedi" },
  en: { king: "king", queen: "queen", man: "man", woman: "woman", cat: "cat" },
};

export default function Embedding({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [selected, setSelected] = useState("king");
  const vec = embeddings[selected];
  
  const displayWord = (w: string) => {
    return wordTranslations[locale]?.[w] || w;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("embed.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("embed.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("embed.select")}</h4>
            <div className="flex gap-2 flex-wrap mb-6">
              {words.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelected(w)}
                  className={`px-4 py-2.5 rounded-lg font-mono text-base transition-all cursor-pointer ${
                    selected === w
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {displayWord(w)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-400 font-mono mb-2">embedding[&quot;{displayWord(selected)}&quot;] = [{vec.map(v => v.toFixed(2)).join(", ")}]</p>
              <div className="flex items-end gap-1.5 h-36">
                {vec.map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                  >
                    <div
                      className={`w-full rounded-t ${getBarColor(v)} transition-all`}
                      style={{ height: `${Math.abs(v) * 100}%`, minHeight: 4 }}
                    />
                    <span className="text-xs text-slate-500 mt-1">{v.toFixed(1)}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">{t("embed.dims")}</p>
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("embed.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("embed.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("embed.relationships")}</h4>
            <div className="bg-slate-900 rounded-lg p-5 font-mono text-base space-y-2.5">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-green-400">
                {t("embed.formula")}
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-blue-400">
                {t("embed.similar")}
              </motion.p>
            </div>
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("embed.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("embed.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="relative h-56 bg-slate-900 rounded-lg overflow-hidden border border-slate-850">
              {Object.entries(embeddings).map(([word, vec], i) => {
                const x = ((vec[0] + 0.5) / 1.5) * 80 + 10;
                const y = ((vec[1] + 0.5) / 1.5) * 80 + 10;
                return (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    className="absolute"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${selected === word ? "bg-blue-500 ring-2 ring-blue-300" : "bg-blue-400"}`} />
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-slate-300 whitespace-nowrap">{displayWord(word)}</span>
                  </motion.div>
                );
              })}
              <div className="absolute bottom-2 right-2 text-xs text-slate-600">{t("embed.2d")}</div>
            </div>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("embed.insight") }} />
          </motion.div>

          <motion.div variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    In production, an embedding layer is represented by a parameter matrix <code>W_e</code> of shape <code>(V, d_model)</code>. The lookup is computationally optimized as a slice selection (equivalent to multiplying a one-hot vector representation of the token ID with the embedding weight matrix):
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"x_t = Embedding(t_t) = W_e[t_t, :]"}
                  </div>
                  <p className="mt-2 font-semibold">Position Embeddings:</p>
                  <p className="text-slate-300">
                    Since Transformer&apos;s self-attention has no inherent sense of token order (permutation invariance), positional information must be injected. Modern architectures (like LLaMA-2/3, Mistral, Gemma) discard original additive sinusoidal position embeddings in favor of <strong>Rotary Position Embeddings (RoPE)</strong>.
                  </p>
                  <p className="mt-2 font-semibold">How RoPE Works:</p>
                  <p className="text-slate-300">
                    Instead of adding a position vector to the token embedding, RoPE applies a rotation to the Query (Q) and Key (K) vectors in 2D planes. For a query vector <code>q</code> at position <code>m</code>:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"R_{Θ, m}^d q = diag(R_1, R_2, ..., R_{d/2}) q"}
                  </div>
                  <p className="mt-2 text-slate-300">
                    where each <code>R_i</code> is a 2D rotation matrix rotating the <code>2i</code> and <code>2i+1</code> dimensions of the vector by angle <code>m \theta_i</code>. This preserves relative distances because the inner product of queries and keys depends only on their relative distance <code>m - n</code>.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    Gelişmiş uygulamalarda gömme (embedding) katmanı, <code>(V, d_model)</code> boyutlarında bir parametre matrisi olan <code>W_e</code> ile temsil edilir. Gömme arama (lookup) işlemi, bilgisayarda doğrudan bir indeks erişimi (dilim seçimi) şeklinde yapılır:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"x_t = Embedding(t_t) = W_e[t_t, :]"}
                  </div>
                  <p className="mt-2 font-semibold">Pozisyon Kodlama (Position Embeddings):</p>
                  <p className="text-slate-300">
                    Transformer&apos;ın öz-dikkat mekanizması yer değiştirme altında değişmez (permutation-invariant) olduğundan, kelimelerin sırasını modele bildirmek için konumsal bilgilerin eklenmesi gerekir. Modern mimariler (LLaMA-2/3, Mistral, Gemma gibi), eklemeli sinüzoidal pozisyon vektörleri yerine <strong>Döner Konumsal Gömme (Rotary Position Embeddings - RoPE)</strong> kullanır.
                  </p>
                  <p className="mt-2 font-semibold">RoPE Nasıl Çalışır?</p>
                  <p className="text-slate-300">
                    RoPE, pozisyon vektörlerini doğrudan gömme vektörüne eklemek yerine, dikkat katmanındaki Sorgu (Q) ve Anahtar (K) vektörlerini iki boyutlu düzlemlerde döndürür. <code>m</code>. pozisyondaki bir <code>q</code> sorgu vektörü için rotasyon şu şekildedir:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"R_{Θ, m}^d q = diag(R_1, R_2, ..., R_{d/2}) q"}
                  </div>
                  <p className="mt-2 text-slate-300">
                    Burada her <code>R_i</code>, vektörün ilgili boyutlarını <code>m \theta_i</code> açısıyla döndüren 2B bir rotasyon matrisidir. Bu sayede sorgu ve anahtar vektörlerinin iç çarpımı, sadece kelimelerin birbirine olan bağıl mesafesine (<code>m - n</code>) bağlı hale gelir.
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

"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Overview({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();

  const examples = locale === "tr" ? [
    { input: "Bir varmış, bir", output: "yokmuş", color: "text-green-400" },
    { input: "Türkiye'nin başkenti", output: "Ankara'dır", color: "text-blue-400" },
    { input: "Kedi halının üzerine", output: "oturdu", color: "text-yellow-400" },
  ] : [
    { input: "The cat sat on the", output: "mat", color: "text-green-400" },
    { input: "Once upon a", output: "time", color: "text-blue-400" },
    { input: "The capital of France is", output: "Paris", color: "text-yellow-400" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("overview.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("overview.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-6 text-slate-300 space-y-2">
            <h4 className="text-md font-semibold text-white">🚀 {locale === "tr" ? "Sözümüz Söz!" : "Our Promise!"}</h4>
            <p className="text-base leading-relaxed">{t("overview.promise")}</p>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{locale === "tr" ? "Kelime Tamamlama" : "Smart Autocomplete"}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("overview.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-white mb-4">{t("overview.autocomplete")}</h4>
            <div className="flex flex-col gap-3">
              {examples.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3"
                >
                  <span className="text-slate-300 font-mono text-base">&quot;{ex.input}</span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
                    className={`${ex.color} font-bold font-mono text-base bg-slate-700 px-2.5 py-1 rounded`}
                  >
                    {ex.output}&quot;
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{locale === "tr" ? "Büyük Resim" : "The Big Picture"}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("overview.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base">
            <p>{t("overview.next")}</p>
          </motion.div>

          <motion.div variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    At a mathematical level, a Decoder-only Large Language Model (LLM) computes the conditional probability distribution of the next token given the sequence of previous tokens:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 select-all overflow-x-auto">
                    P(x_t | x_1, x_2, ..., x_&#123;t-1&#125;; &theta;) = Softmax(Logits_t)
                  </div>
                  <p className="mt-2">
                    where:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>x_i</strong> represents the token at index <em>i</em>.</li>
                    <li><strong>&theta;</strong> represents the model&apos;s learnable parameters (weights and biases of self-attention and MLP layers).</li>
                    <li><strong>Logits_t</strong> is the output of the final linear projection layer mapping back to the vocabulary dimension.</li>
                  </ul>
                  <p className="mt-3">
                    During training, we minimize the cross-entropy loss over a corpus of billions of tokens to optimize &theta;:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 select-all overflow-x-auto">
                    L = - &Sigma;_t log P(x_t | x_&lt;t; &theta;)
                  </div>
                  <p className="mt-2">
                    Modern architectures (like GPT-4, LLaMA, Claude) stack 32 to 128 layers of Transformer blocks containing multi-head causal attention and SwiGLU feed-forward networks, scaling up to hundreds of billions of parameters.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    Matematiksel düzeyde, sadece Dekoder (Decoder-only) içeren bir Büyük Dil Modeli (LLM), önceki token&apos;lar dizisi verildiğinde bir sonraki token&apos;ın koşullu olasılık dağılımını hesaplar:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 select-all overflow-x-auto">
                    P(x_t | x_1, x_2, ..., x_&#123;t-1&#125;; &theta;) = Softmax(Logits_t)
                  </div>
                  <p className="mt-2">
                    Burada:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>x_i</strong>, <em>i</em>. indeksteki token&apos;ı temsil eder.</li>
                    <li><strong>&theta;</strong>, modelin öğrenilebilir parametrelerini (öz-dikkat ve MLP katmanlarının ağırlıkları ve sapmaları) temsil eder.</li>
                    <li><strong>Logits_t</strong>, son doğrusal katmanın kelime haznesi (vocabulary) boyutuna yansıttığı ham skorlardır.</li>
                  </ul>
                  <p className="mt-3">
                    Eğitim sırasında, milyarlarca token&apos;lık bir veri kümesi üzerinde çapraz entropi (cross-entropy) kaybını minimize ederek &theta; parametrelerini optimize ederiz:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 select-all overflow-x-auto">
                    L = - &Sigma;_t log P(x_t | x_&lt;t; &theta;)
                  </div>
                  <p className="mt-2">
                    Modern mimariler (GPT-4, LLaMA, Claude), nedensel (causal) çok başlı öz-dikkat ve SwiGLU beslemeli ağları içeren 32 ila 128 adet Transformer bloğunu üst üste yığarak yüz milyarlarca parametreye ulaşır.
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

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const tokenColors = [
  "bg-red-500/20 border-red-500/50 text-red-300",
  "bg-blue-500/20 border-blue-500/50 text-blue-300",
  "bg-green-500/20 border-green-500/50 text-green-300",
  "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  "bg-purple-500/20 border-purple-500/50 text-purple-300",
  "bg-pink-500/20 border-pink-500/50 text-pink-300",
  "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
  "bg-orange-500/20 border-orange-500/50 text-orange-300",
];

function simpleTokenize(text: string): string[] {
  if (!text) return [];
  const tokens: string[] = [];
  let current = "";
  for (const char of text) {
    if (char === " ") {
      if (current) tokens.push(current);
      tokens.push(" ");
      current = "";
    } else if (/[.,!?;:]/.test(char)) {
      if (current) tokens.push(current);
      tokens.push(char);
      current = "";
    } else {
      current += char;
      if (current.length >= 4 && /[aeiou]/i.test(char)) {
        tokens.push(current);
        current = "";
      }
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export default function Tokenization({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [inputText, setInputText] = useState("");
  const [hasUserEdited, setHasUserEdited] = useState(false);

  useEffect(() => {
    if (!hasUserEdited) {
      setInputText(locale === "tr" ? "Kedi halının üzerine oturdu." : "The cat sat on the mat.");
    }
  }, [locale, hasUserEdited]);

  const tokens = simpleTokenize(inputText);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("token.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("token.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("token.try")}</h4>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setHasUserEdited(true);
              }}
              className="w-full bg-slate-950 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-blue-500 transition"
              placeholder={t("token.placeholder")}
            />
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("token.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("token.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("token.tokens")}</h4>
            <div className="flex flex-wrap gap-2">
              {tokens.map((token, i) => (
                <motion.div
                  key={`${token}-${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  className={`border rounded-lg px-3.5 py-2 font-mono text-base ${tokenColors[i % tokenColors.length]}`}
                >
                  {token === " " ? "⎵" : token}
                </motion.div>
              ))}
            </div>
            {tokens.length > 0 && (
              <p className="text-slate-400 text-sm mt-4">
                {t("token.total")} <span className="text-white font-bold">{tokens.length}</span>
              </p>
            )}
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("token.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("token.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("token.ids")}</h4>
            <div className="flex flex-wrap gap-2.5">
              {tokens.slice(0, 12).map((token, i) => (
                <motion.div
                  key={`id-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className={`border rounded-lg px-3 py-1.5 font-mono text-sm ${tokenColors[i % tokenColors.length]}`}>
                    {token === " " ? "⎵" : token}
                  </span>
                  <span className="text-xs text-slate-500">↓</span>
                  <span className="bg-slate-700 rounded px-2.5 py-1 font-mono text-sm text-slate-300">
                    {(i * 137 + 42) % 50000}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("token.insight") }} />
          </motion.div>

          <motion.div variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    Modern LLMs use subword tokenization algorithms, primarily <strong>Byte Pair Encoding (BPE)</strong> (GPT, LLaMA) or <strong>WordPiece</strong> (BERT). 
                  </p>
                  <p className="mt-2 font-semibold">BPE Algorithm Workflow:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2">
                    <li>Initialize vocabulary with all individual characters (and byte values 0-255).</li>
                    <li>Count frequency of consecutive symbol pairs in the training corpus.</li>
                    <li>Merge the most frequent pair <code>(A, B)</code> to create a new token <code>AB</code>.</li>
                    <li>Repeat step 2-3 until vocabulary reaches target size (e.g., 32,000 for LLaMA, 100,000 for GPT-4).</li>
                  </ol>
                  <p className="mt-3">
                    Mathematically, tokenization is a deterministic mapping function:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"f: Unicode Text → [t_1, t_2, ..., t_N]  where  t_i ∈ {0, 1, ..., V - 1}"}
                  </div>
                  <p className="mt-2">
                    This guarantees zero out-of-vocabulary (OOV) errors because unknown words are split into individual bytes or characters. BPE is trained on the corpus but inference is computed using a precompiled static merge file.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    Modern LLM&apos;ler, alt-kelime (subword) tokenlaştırma algoritmaları kullanır. Genellikle <strong>Byte Pair Encoding (BPE)</strong> (GPT, LLaMA) veya <strong>WordPiece</strong> (BERT) tercih edilir.
                  </p>
                  <p className="mt-2 font-semibold">BPE Algoritmasının Çalışma Mantığı:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2">
                    <li>Sözlüğü tüm tekil karakterler (veya 0-255 arasındaki bayt değerleri) ile başlatır.</li>
                    <li>Eğitim veri kümesindeki ardışık sembol çiftlerinin frekansını sayar.</li>
                    <li>En sık geçen <code>(A, B)</code> çiftini birleştirip <code>AB</code> şeklinde yeni bir token oluşturur.</li>
                    <li>Hedef sözlük boyutuna (örn. LLaMA için 32.000, GPT-4 için 100.000) ulaşılana kadar 2-3. adımları tekrarlar.</li>
                  </ol>
                  <p className="mt-3">
                    Matematiksel olarak tokenlaştırma, deterministik bir eşleme fonksiyonudur:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"f: Unicode Metin → [t_1, t_2, ..., t_N]  burada  t_i ∈ {0, 1, ..., V - 1}"}
                  </div>
                  <p className="mt-2">
                    Bu sayede sözlük dışı (out-of-vocabulary - OOV) hatası alma olasılığı sıfıra indirilir, çünkü bilinmeyen kelimeler tekil baytlara veya karakterlere kadar parçalanabilir.
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

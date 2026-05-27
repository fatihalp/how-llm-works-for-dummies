"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

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

export default function Tokenization() {
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
      <motion.div variants={item}>
        <h3 className="text-2xl font-bold text-white mb-3">{t("token.title")}</h3>
        <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("token.desc") }} />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("token.try")}</h4>
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setHasUserEdited(true);
          }}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition"
          placeholder={t("token.placeholder")}
        />
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("token.tokens")}</h4>
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, i) => (
            <motion.div
              key={`${token}-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
              className={`border rounded-lg px-3 py-1.5 font-mono text-sm ${tokenColors[i % tokenColors.length]}`}
            >
              {token === " " ? "⎵" : token}
            </motion.div>
          ))}
        </div>
        {tokens.length > 0 && (
          <p className="text-slate-400 text-xs mt-4">
            {t("token.total")} <span className="text-white font-bold">{tokens.length}</span>
          </p>
        )}
      </motion.div>

      <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("token.ids")}</h4>
        <div className="flex flex-wrap gap-2">
          {tokens.slice(0, 12).map((token, i) => (
            <motion.div
              key={`id-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex flex-col items-center gap-1"
            >
              <span className={`border rounded-lg px-3 py-1 font-mono text-xs ${tokenColors[i % tokenColors.length]}`}>
                {token === " " ? "⎵" : token}
              </span>
              <span className="text-xs text-slate-500">↓</span>
              <span className="bg-slate-700 rounded px-2 py-0.5 font-mono text-xs text-slate-300">
                {(i * 137 + 42) % 50000}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <span dangerouslySetInnerHTML={{ __html: t("token.insight") }} />
      </motion.div>
    </motion.div>
  );
}

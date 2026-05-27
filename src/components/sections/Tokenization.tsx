"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, TextField, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const tokenColors = [
  { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)", text: "#f87171" },
  { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.4)", text: "#60a5fa" },
  { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#34d399" },
  { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#fbbf24" },
  { bg: "rgba(139, 92, 246, 0.15)", border: "rgba(139, 92, 246, 0.4)", text: "#a78bfa" },
  { bg: "rgba(236, 72, 153, 0.15)", border: "rgba(236, 72, 153, 0.4)", text: "#f472b6" },
  { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.4)", text: "#22d3ee" },
  { bg: "rgba(249, 115, 22, 0.15)", border: "rgba(249, 115, 22, 0.4)", text: "#fb923c" },
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
  const theme = useTheme();
  const [inputText, setInputText] = useState("");
  const [hasUserEdited, setHasUserEdited] = useState(false);

  useEffect(() => {
    if (!hasUserEdited) {
      setInputText(locale === "tr" ? "Kedi halının üzerine oturdu." : "The cat sat on the mat.");
    }
  }, [locale, hasUserEdited]);

  const tokens = simpleTokenize(inputText);

  return (
    <Box 
      component={motion.div} 
      variants={container} 
      initial="hidden" 
      animate="show" 
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {slide === 0 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("token.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("token.desc.0") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("token.try")}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setHasUserEdited(true);
              }}
              placeholder={t("token.placeholder")}
              sx={{ 
                bgcolor: "background.default", 
                borderRadius: 1,
                "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "1.1rem" }
              }}
            />
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("token.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("token.desc.1") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("token.tokens")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {tokens.map((token, i) => {
                const colorConfig = tokenColors[i % tokenColors.length];
                return (
                  <Box
                    key={`${token}-${i}`}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                    sx={{
                      px: 2,
                      py: 1,
                      fontFamily: "monospace",
                      fontSize: "1.1rem",
                      borderRadius: 2,
                      border: 1,
                      borderColor: colorConfig.border,
                      bgcolor: colorConfig.bg,
                      color: theme.palette.mode === "dark" ? colorConfig.text : "text.primary",
                    }}
                  >
                    {token === " " ? "⎵" : token}
                  </Box>
                );
              })}
            </Box>
            {tokens.length > 0 && (
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 3 }}>
                {t("token.total")}{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: "bold", fontSize: "1rem" }}>
                  {tokens.length}
                </Box>
              </Typography>
            )}
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("token.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("token.desc.2") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("token.ids")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {tokens.slice(0, 12).map((token, i) => {
                const colorConfig = tokenColors[i % tokenColors.length];
                return (
                  <Box
                    key={`id-${i}`}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        borderRadius: 1.5,
                        border: 1,
                        borderColor: colorConfig.border,
                        bgcolor: colorConfig.bg,
                        color: theme.palette.mode === "dark" ? colorConfig.text : "text.primary",
                      }}
                    >
                      {token === " " ? "⎵" : token}
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>↓</Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                        color: "text.primary",
                        border: "none"
                      }}
                    >
                      {(i * 137 + 42) % 50000}
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          <Paper
            component={motion.div}
            variants={item}
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.1)" : "rgba(0, 113, 227, 0.05)",
              border: 1,
              borderColor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.2)" : "rgba(0, 113, 227, 0.1)",
              borderRadius: 2
            }}
          >
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("token.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
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
                  <p className="mt-3 font-semibold">Deterministic Mapping:</p>
                  <p>
                    Mathematically, tokenization is a deterministic mapping function:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"f: Unicode Text → [t_1, t_2, ..., t_N]  where  t_i ∈ {0, 1, ..., V - 1}"}
                  </Box>
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
                  <p className="mt-3 font-semibold">Deterministik Eşleme:</p>
                  <p>
                    Matematiksel olarak tokenlaştırma, deterministik bir eşleme fonksiyonudur:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"f: Unicode Metin → [t_1, t_2, ..., t_N]  burada  t_i ∈ {0, 1, ..., V - 1}"}
                  </Box>
                  <p className="mt-2">
                    Bu sayede sözlük dışı (out-of-vocabulary - OOV) hatası alma olasılığı sıfıra indirilir, çünkü bilinmeyen kelimeler tekil baytlara veya karakterlere kadar parçalanabilir.
                  </p>
                </>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

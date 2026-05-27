"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Button, useTheme } from "@mui/material";

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
  const theme = useTheme();
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
              {t("out.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("out.desc.0") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("out.watch")}
            </Typography>
            
            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 2.5, borderRadius: 2, mb: 3, fontFamily: "monospace", fontSize: "1.05rem" }}>
              <span style={{ color: theme.palette.text.primary }}>{currentStep.prompt}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ color: "#0071e3", fontWeight: "bold" }}
              >
                |
              </motion.span>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                onClick={() => { setStep(0); setIsGenerating(true); }}
                disabled={isGenerating}
                sx={{ px: 3 }}
              >
                {t("out.generate")}
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setStep(0); setIsGenerating(false); }}
                sx={{ px: 3 }}
              >
                {t("out.reset")}
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("out.predictions")}
              </Typography>
              {currentStep.predictions.map((pred, i) => (
                <Box
                  key={pred.word}
                  component={motion.div}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Typography variant="body2" sx={{ width: 64, fontFamily: "monospace", fontWeight: i === 0 ? "bold" : "normal", color: i === 0 ? "#4caf50" : "text.secondary" }}>
                    {pred.word}
                  </Typography>
                  <Box sx={{ flexGrow: 1, height: 16, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.200", borderRadius: 1, overflow: "hidden" }}>
                    <Box
                      component={motion.div}
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.prob * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      sx={{
                        height: "100%",
                        bgcolor: i === 0 ? "success.main" : "grey.600",
                        borderRadius: 1
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ width: 44, textAlign: "right", fontFamily: "monospace", color: "text.secondary" }}>
                    {(pred.prob * 100).toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("out.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("out.desc.1") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("out.loop")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[t("out.loop.1"), t("out.loop.2"), t("out.loop.3"), t("out.loop.4"), t("out.loop.5")].map((stepText, i) => (
                <Box
                  key={stepText}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "rgba(0, 113, 227, 0.15)",
                      border: 1,
                      borderColor: "rgba(0, 113, 227, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: "primary.light",
                      fontWeight: "bold"
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {stepText}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("out.temp")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }} dangerouslySetInnerHTML={{ __html: t("out.temp.desc") }} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2.5 }}>
              {[
                { temp: t("out.temp.low"), desc: t("out.temp.low.desc"), borderColor: "rgba(33, 150, 243, 0.4)", bgcolor: "rgba(33, 150, 243, 0.05)", textColor: "#60a5fa" },
                { temp: t("out.temp.med"), desc: t("out.temp.med.desc"), borderColor: "rgba(76, 175, 80, 0.4)", bgcolor: "rgba(76, 175, 80, 0.05)", textColor: "#34d399" },
                { temp: t("out.temp.high"), desc: t("out.temp.high.desc"), borderColor: "rgba(239, 68, 68, 0.4)", bgcolor: "rgba(239, 68, 68, 0.05)", textColor: "#f87171" },
              ].map((item) => (
                <Box 
                  key={item.temp} 
                  sx={{ 
                    border: 1, 
                    borderColor: item.borderColor, 
                    bgcolor: item.bgcolor, 
                    borderRadius: 2, 
                    p: 2 
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold", color: item.textColor }}>
                    {item.temp}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("out.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("out.desc.2") }} 
            />
          </Box>

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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("out.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    Causal self-attention scales quadratically <code>O(N^2)</code> with context length <code>N</code>. Since generation is autoregressive, re-evaluating the full history on every forward pass causes huge computational redundancies.
                  </p>
                  <p className="mt-2 font-semibold">The KV Cache Optimization:</p>
                  <p className="text-slate-300 font-sans">
                    To bypass redundant matrix multiplications, production inference engines implement the **KV Cache**. For each layer, Key and Value vectors of past tokens are stored in memory. At step <code>t</code>, we only project the Query (Q), Key (K), and Value (V) vectors for the <em>newly generated token</em>:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontWeight: "bold" }}>
                    {"K_cached^(l) ← [K_cached^(l); k_t^(l)],  V_cached^(l) ← [V_cached^(l); v_t^(l)]"}
                  </Box>
                  <p className="text-slate-300 mt-2 font-sans">
                    This reduces the attention computation for the current token to <code>O(N)</code> rather than <code>O(N^2)</code>, converting the memory-bound stage of generation to a linear scaling complexity.
                  </p>
                  <p className="mt-3 font-semibold">Advanced Decoding Strategies:</p>
                  <p className="text-slate-300 font-sans">
                    Rather than selecting the token with the highest score (greedy decoding, which can lead to repetitive loops), models sample from filtered subsets of logits:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
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
                  <p className="text-slate-300 font-sans">
                    Bu karesel maliyetten kaçınmak için endüstriyel sunucularda **KV Cache** kullanılır. Her bir katman için geçmiş kelimelerin Key (K) ve Value (V) vektörleri bellekte tutulur. Yeni bir kelime üretilirken sadece <em>o yeni kelimenin</em> Query, Key ve Value vektörleri hesaplanır:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontWeight: "bold" }}>
                    {"K_cached^(l) ← [K_cached^(l); k_t^(l)],  V_cached^(l) ← [V_cached^(l); v_t^(l)]"}
                  </Box>
                  <p className="text-slate-300 mt-2 font-sans">
                    Daha sonra yeni Query vektörü, bellekteki birleşik K ve V vektörleri ile çarpılır. Bu sayede her adımda yapılan karesel hesaplama yükü doğrusal <code>O(N)</code> karmaşıklığına indirgenmiş olur.
                  </p>
                  <p className="mt-3 font-semibold font-sans">Gelişmiş Kod Çözme (Decoding) Stratejileri:</p>
                  <p className="text-slate-300 font-sans">
                    Her zaman en olası kelimeyi seçmek (Greedy Decoding) yerine, rastgelelik ve yaratıcılık eklemek amacıyla olasılık dağılımından örnekleme yapılır:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Top-K Örnekleme:</strong> En yüksek olasılığa sahip ilk <code>K</code> adet kelime havuzunu belirler ve gerisini eler.</li>
                    <li><strong>Top-p (Nucleus) Örnekleme:</strong> Kümülâtif (toplam) olasılıkları <code>p</code> barajını (örn. <code>p = 0.90</code>) aşana kadar en olası kelimeleri havuzda toplar. Bu havuz dışındaki kelimeler tamamen elenerek anlamsız kelimelerin seçilmesi engellenir.</li>
                  </ul>
                </>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

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

function InteractiveLoop({ locale, theme }: { locale: string; theme: any }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing && step < 4) {
      const timer = setTimeout(() => setStep(s => s + 1), 1800);
      return () => clearTimeout(timer);
    } else if (step >= 4) {
      setPlaying(false);
    }
  }, [playing, step]);

  const steps = locale === "tr" ? [
    "Kelimeleri → Modele gönder",
    "→ Her kelime için bir skor (logit) hesapla",
    "→ Softmax ile olasılığa çevir",
    "→ En yüksek olasılıklı kelimeyi seç",
    "→ Kelimeyi cümlenin sonuna ekle, başa dön!",
  ] : [
    "Send tokens → Transformer",
    "→ Compute logit for each word",
    "→ Softmax → Probabilities",
    "→ Pick highest-probability word",
    "→ Append to input, repeat!",
  ];

  const stepEmojis = ["📥", "📊", "🎲", "🎯", "🔄"];
  const stepColors = ["#60a5fa", "#fbbf24", "#34d399", "#f472b6", "#a78bfa"];

  const candidateWords = locale === "tr"
    ? ["oturdu", "uzandı", "yattı", "zıpladı", "uyudu"]
    : ["mat", "floor", "roof", "bed", "chair"];

  const fakeLogits = [3.5, 1.2, -0.5, -1.8, 0.3];
  const fakeProbs = fakeLogits.map(v => Math.exp(v)).map(e => e / fakeLogits.reduce((s, v) => s + Math.exp(v), 0));

  const currentWord = candidateWords[0];

  const togglePlay = () => {
    if (step >= 4) setStep(0);
    setPlaying(p => !p);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Steps */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {steps.map((s, i) => {
          const isActive = i === step;
          const isPast = i < step;
          return (
            <Box
              key={i}
              component={motion.div}
              initial={false}
              animate={{ opacity: isPast ? 0.5 : 1, x: isActive ? 8 : 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => { setStep(i); setPlaying(false); }}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer",
                p: 1, borderRadius: 1.5,
                bgcolor: isActive ? `${stepColors[i]}18` : "transparent",
              }}
            >
              <Box sx={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem",
                bgcolor: isActive ? stepColors[i] : (isPast ? "grey.600" : "grey.800"),
                color: isActive ? "#000" : (isPast ? "#fff" : "grey.500"),
                fontWeight: "bold",
                transition: "all 0.3s",
              }}>
                {stepEmojis[i]}
              </Box>
              <Typography variant="body2" sx={{ flex: 1, color: isActive ? stepColors[i] : "text.primary", fontWeight: isActive ? "bold" : "normal", fontSize: "0.85rem" }}>
                {s}
              </Typography>
              {isActive && (
                <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ color: stepColors[i], fontSize: "0.6rem" }}>
                  ●
                </motion.div>
              )}
              {isPast && <Typography variant="caption" sx={{ color: "success.main" }}>✓</Typography>}
            </Box>
          );
        })}
      </Box>

      {/* Visual data display based on current step */}
      <Box sx={{ mt: 1, p: 2, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, minHeight: 60 }}>
        {step === 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
            {(["Kedi", "halının", "üzerine"]).map((w, i) => (
              <Box key={i} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, bgcolor: `${["#60a5fa", "#34d399", "#fbbf24"][i]}22`, border: 1, borderColor: ["#60a5fa", "#34d399", "#fbbf24"][i], fontFamily: "monospace", fontSize: "0.85rem", color: ["#60a5fa", "#34d399", "#fbbf24"][i] }}>
                {w}
              </Box>
            ))}
            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: "2px dashed", borderColor: "grey.600", fontFamily: "monospace", fontSize: "0.85rem", color: "grey.500" }}>
              ???
            </Box>
            <Typography variant="h5" sx={{ color: "grey.500" }}>→</Typography>
            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, bgcolor: "rgba(96,165,250,0.15)", border: 1, borderColor: "#60a5fa", fontFamily: "monospace", fontSize: "0.85rem", color: "#60a5fa", fontWeight: "bold" }}>
              {locale === "tr" ? "Transformer" : "Transformer"}
            </Box>
          </Box>
        )}
        {step === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "grey.500", textAlign: "center", fontSize: "0.6rem" }}>
              {locale === "tr" ? "Sözlükteki her kelime bir puan (logit) alır:" : "Every word in the vocabulary gets a score (logit):"}
            </Typography>
            {candidateWords.map((w, i) => (
              <Box key={w} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" sx={{ width: 50, fontFamily: "monospace", color: "text.secondary", fontSize: "0.7rem" }}>
                  {w}
                </Typography>
                <Box sx={{ flex: 1, height: 14, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300", borderRadius: 1, overflow: "hidden" }}>
                  <Box sx={{ width: `${Math.max(5, (fakeLogits[i] + 2) / 7 * 100)}%`, height: "100%", bgcolor: fakeLogits[i] > 0 ? "#60a5fa" : "#ef4444", borderRadius: 1 }} />
                </Box>
                <Typography variant="caption" sx={{ width: 36, fontFamily: "monospace", color: fakeLogits[i] > 0 ? "#60a5fa" : "#ef4444", textAlign: "right", fontSize: "0.65rem" }}>
                  {fakeLogits[i] > 0 ? "+" : ""}{fakeLogits[i].toFixed(1)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "grey.500", textAlign: "center", fontSize: "0.6rem" }}>
              {locale === "tr" ? "Softmax puanları yüzdelere dönüştürür:" : "Softmax turns scores into percentages:"}
            </Typography>
            {candidateWords.map((w, i) => (
              <Box key={w} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" sx={{ width: 50, fontFamily: "monospace", color: "text.secondary", fontSize: "0.7rem" }}>
                  {w}
                </Typography>
                <Box sx={{ flex: 1, height: 18, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300", borderRadius: 1.5, overflow: "hidden" }}>
                  <Box
                    component={motion.div}
                    initial={{ width: 0 }}
                    animate={{ width: `${fakeProbs[i] * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    sx={{ height: "100%", bgcolor: i === 0 ? "#34d399" : "grey.500", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "flex-end", px: 0.5 }}
                  >
                    {fakeProbs[i] > 0.08 && (
                      <Typography variant="caption" sx={{ color: i === 0 ? "#000" : "#fff", fontWeight: "bold", fontSize: "0.55rem" }}>
                        {(fakeProbs[i] * 100).toFixed(0)}%
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        {step === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: "grey.500", fontSize: "0.6rem" }}>
              {locale === "tr" ? "En yüksek olasılıklı kelime seçilir:" : "Highest-probability word is picked:"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {candidateWords.map((w, i) => (
                <Box key={w} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: i === 0 ? "#34d399" : "grey.700", bgcolor: i === 0 ? "rgba(52,211,153,0.2)" : "transparent", fontFamily: "monospace", color: i === 0 ? "#34d399" : "grey.500", fontWeight: i === 0 ? "bold" : "normal", fontSize: "0.85rem" }}>
                  {w}
                </Box>
              ))}
            </Box>
            <Box
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              sx={{ mt: 0.5, px: 2, py: 0.5, borderRadius: 1.5, bgcolor: "rgba(52,211,153,0.15)", border: 1, borderColor: "#34d399" }}
            >
              <Typography variant="body2" sx={{ color: "#34d399", fontWeight: "bold" }}>
                🏆 {currentWord}!
              </Typography>
            </Box>
          </Box>
        )}
        {step === 4 && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: "grey.500", fontSize: "0.6rem" }}>
              {locale === "tr" ? "Kelime eklendi, döngü başa dönüyor!" : "Word appended, loop restarts!"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
              {(["Kedi", "halının", "üzerine"]).map((w, i) => (
                <Box key={i} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, bgcolor: `${["#60a5fa", "#34d399", "#fbbf24"][i]}22`, border: 1, borderColor: ["#60a5fa", "#34d399", "#fbbf24"][i], fontFamily: "monospace", fontSize: "0.85rem", color: ["#60a5fa", "#34d399", "#fbbf24"][i] }}>
                  {w}
                </Box>
              ))}
              <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, bgcolor: "rgba(52,211,153,0.2)", border: 2, borderColor: "#34d399", fontFamily: "monospace", fontSize: "0.85rem", color: "#34d399", fontWeight: "bold" }}>
                {currentWord}
              </Box>
              <Typography variant="h5" sx={{ color: "success.main" }}>✨</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "grey.500", mt: 1, fontStyle: "italic", textAlign: "center", fontSize: "0.65rem" }}>
              {locale === "tr"
                ? "Şimdi bu yeni cümleyle model tekrar çalıştırılır ve bir sonraki kelime tahmin edilir!"
                : "Now the model runs again with the new sentence to predict the next word!"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 1 }}>
        <Button
          variant={playing ? "outlined" : "contained"}
          size="small"
          onClick={togglePlay}
          sx={{ px: 3, minWidth: 120 }}
        >
          {playing
            ? "⏸ " + (locale === "tr" ? "Durdur" : "Pause")
            : (step >= 4
              ? "🔄 " + (locale === "tr" ? "Baştan Başlat" : "Replay")
              : "▶ " + (locale === "tr" ? "Adım Adım İzle" : "Step Through"))}
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => { setStep(0); setPlaying(false); }}
          disabled={step === 0 && !playing}
          sx={{ px: 2 }}
        >
          {locale === "tr" ? "Sıfırla" : "Reset"}
        </Button>
      </Box>
    </Box>
  );
}

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
              <Box component="span" sx={{ color: "text.primary" }}>{currentStep.prompt}</Box>
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
            <InteractiveLoop locale={locale} theme={theme} />
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

          <Box
            component={motion.div}
            variants={item}
            sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}
          >
            <Paper
              elevation={0}
              sx={{
                flex: "1 1 300px",
                p: 2.5,
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)",
                borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.200",
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                📜 {locale === "tr" ? "Tarihçe" : "History"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {t("out.history")}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                flex: "1 1 300px",
                p: 2.5,
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)",
                borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.200",
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "warning.main", fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                💡 {locale === "tr" ? "Ortamlarda Satmalık Bilgi" : "Fun Fact"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {t("out.fact")}
              </Typography>
            </Paper>
          </Box>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Causal self-attention scales quadratically <code>O(N^2)</code> with context length <code>N</code>. Since generation is autoregressive, re-evaluating the full history on every forward pass causes huge computational redundancies.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>The KV Cache Optimization:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    To bypass redundant matrix multiplications, production inference engines implement the **KV Cache**. For each layer, Key and Value vectors of past tokens are stored in memory. At step <code>t</code>, we only project the Query (Q), Key (K), and Value (V) vectors for the <em>newly generated token</em>:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontWeight: "bold" }}>
                    {"K_cached^(l) ← [K_cached^(l); k_t^(l)],  V_cached^(l) ← [V_cached^(l); v_t^(l)]"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    This reduces the attention computation for the current token to <code>O(N)</code> rather than <code>O(N^2)</code>, converting the memory-bound stage of generation to a linear scaling complexity.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Advanced Decoding Strategies:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Rather than selecting the token with the highest score (greedy decoding, which can lead to repetitive loops), models sample from filtered subsets of logits:
                  </Typography>
                  <Box component="ul" sx={{ listStyle: "disc", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Top-K Sampling:</strong> Caps the selection pool to the <code>K</code> tokens with the highest probabilities.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Top-p (Nucleus) Sampling:</strong> Dynamically calculates the smallest set of tokens whose cumulative probability exceeds the threshold <code>p</code> (e.g., <code>p = 0.90</code>). Tokens outside this &quot;nucleus&quot; are discarded, preventing the model from picking nonsensical outliers while preserving creativity.</Typography>
                  </Box>
                </>
              }
              contentTr={
                <>
                  <Box sx={{ mb: 2, p: 2, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2 }}>
                    <Typography sx={{ fontWeight: "bold", color: "common.white", mb: 0.5 }}>⚡ Verimlilik Sorunu:</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Her yeni kelime üretirken model tüm geçmiş kelimelere yeniden bakmak zorunda. Bu, özellikle uzun metinlerde (1000+ kelime) çok büyük bir işlem yükü demek.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 2, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2 }}>
                    <Typography sx={{ fontWeight: "bold", color: "success.light", mb: 0.5 }}>💡 Çözüm: KV Cache (Bellekleme)</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Daha önce hesaplanmış Key (K) ve Value (V) vektörleri bellekten silinmez, saklanır. Yeni kelime için sadece o kelimenin K ve V vektörü hesaplanır ve eskilerin yanına eklenir. Böylece her seferinde sıfırdan hesaplama yapmak zorunda kalmayız.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 2, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 2 }}>
                    <Typography sx={{ fontWeight: "bold", color: "primary.light", mb: 0.5 }}>🎯 Seçim Stratejileri (Nasıl Karar Veriyor?)</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                      Model her zaman en yüksek olasılıklı kelimeyi seçmez. Bazen yaratıcılık için farklı stratejiler kullanılır:
                    </Typography>
                    <Box component="ul" sx={{ listStyle: "disc", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><Box component="span" sx={{ color: "warning.light", fontWeight: "bold" }}>Greedy (Açgözlü):</Box> En yüksek puanlı kelimeyi seç. Garantici ama sıkıcı, hep aynı cümleleri kurar.</Typography>
                      <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><Box component="span" sx={{ color: "warning.light", fontWeight: "bold" }}>Top-K:</Box> İlk K (örn. 40) kelime arasından rastgele seç. Biraz çeşitlilik katar.</Typography>
                      <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><Box component="span" sx={{ color: "warning.light", fontWeight: "bold" }}>Top-p (Nucleus):</Box> Toplam olasılığı %90'ı geçene kadar en iyi kelimeleri havuza al, gerisini at. En popüler yöntem; hem mantıklı hem yaratıcı.</Typography>
                    </Box>
                  </Box>
                </>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

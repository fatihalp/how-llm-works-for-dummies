"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Play, RotateCcw, Sparkles, BookOpen, ChevronRight, HelpCircle } from "lucide-react";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Slider, 
  Select, 
  MenuItem, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  useTheme 
} from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// Default training paragraphs
const defaultTexts: Record<string, string> = {
  tr: "kedi güneşli bir günde yeşil çimlerde mutlu mutlu oynuyordu. kedi gökyüzü altındaki yeşil çimlerde aniden durdu ve tatlı bir uykuya daldı. gökyüzü bugün çok güzeldi.",
  en: "the cat was playing happily on the green grass on a sunny day. the cat stopped suddenly on the green grass under the blue sky and fell asleep. the blue sky was very beautiful today."
};

// Helper tokenizer
function tokenizeText(text: string): string[] {
  return text.toLowerCase().match(/\b[a-zA-ZğüşıöçĞÜŞİÖÇ']+\b|[.,!?;]/g) || [];
}

export default function Inference({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();

  // Training text state
  const [trainingText, setTrainingText] = useState("");
  const [isEditingText, setIsEditingText] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [retrainFlash, setRetrainFlash] = useState(false);

  // Temperature slider state
  const [temperature, setTemperature] = useState(1.0);
  const [tempFlash, setTempFlash] = useState<string | null>(null);

  // Selected word for probability lookup visualization
  const [selectedLookupWord, setSelectedLookupWord] = useState("");
  const [wordChangeKey, setWordChangeKey] = useState(0);

  // Generation state
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [genStepCount, setGenStepCount] = useState(0);

  // Initialize training text based on locale
  useEffect(() => {
    if (!hasUserEdited) {
      setTrainingText(defaultTexts[locale] || defaultTexts["en"]);
    }
  }, [locale, hasUserEdited]);

  // Parse text and train bigram model
  const { tokens, vocabulary, bigrams } = useMemo(() => {
    const tokens = tokenizeText(trainingText);
    const vocabSet = new Set(tokens);
    const vocabulary = Array.from(vocabSet).sort();

    // Map each token to its next token counts
    const bigrams: Record<string, Record<string, number>> = {};
    for (let i = 0; i < tokens.length - 1; i++) {
      const current = tokens[i];
      const next = tokens[i + 1];
      if (!bigrams[current]) {
        bigrams[current] = {};
      }
      bigrams[current][next] = (bigrams[current][next] || 0) + 1;
    }

    return { tokens, vocabulary, bigrams };
  }, [trainingText]);

  // Set default selected lookup word when vocabulary updates
  useEffect(() => {
    if (vocabulary.length > 0 && (!selectedLookupWord || !vocabulary.includes(selectedLookupWord))) {
      // Find a word that has transitions if possible
      const wordWithTransitions = vocabulary.find(w => bigrams[w] && Object.keys(bigrams[w]).length > 0);
      setSelectedLookupWord(wordWithTransitions || vocabulary[0]);
    }
  }, [vocabulary, bigrams, selectedLookupWord]);

  // Set default starting word for prompt when vocabulary updates
  useEffect(() => {
    if (vocabulary.length > 0 && !generationPrompt) {
      setGenerationPrompt(vocabulary[0]);
    }
  }, [vocabulary, generationPrompt]);

  // Calculate transition probabilities for a given word based on temperature
  const getTransitionProbabilities = (word: string, temp: number) => {
    const transitions = bigrams[word];
    if (!transitions) return [];

    const rawCounts = Object.entries(transitions); // [ [nextWord, count], ... ]
    
    // Apply temperature scaling: count^(1/T)
    const scaledExps = rawCounts.map(([nextWord, count]) => {
      // Avoid division by zero, cap temperature low-bound
      const tVal = Math.max(0.1, temp);
      return {
        word: nextWord,
        val: Math.pow(count, 1 / tVal)
      };
    });

    const sumVals = scaledExps.reduce((a, b) => a + b.val, 0);
    
    return scaledExps.map(item => ({
      word: item.word,
      probability: sumVals > 0 ? item.val / sumVals : 0,
      rawCount: transitions[item.word] || 0
    })).sort((a, b) => b.probability - a.probability);
  };

  // Live probabilities for the selected lookup word
  const transitionProbs = useMemo(() => {
    return getTransitionProbabilities(selectedLookupWord, temperature);
  }, [selectedLookupWord, bigrams, temperature]);

  // Next token sampler
  const sampleNextToken = (lastWord: string, temp: number): string | null => {
    const probs = getTransitionProbabilities(lastWord, temp);
    if (probs.length === 0) return null;

    // Standard cumulative random sampling
    const r = Math.random();
    let cumulative = 0;
    for (const item of probs) {
      cumulative += item.probability;
      if (r <= cumulative) {
        return item.word;
      }
    }
    return probs[0].word; // fallback
  };

  // Perform single step of next word prediction
  const handleGenerateStep = () => {
    const currentText = generatedTokens.length > 0 
      ? generatedTokens[generatedTokens.length - 1] 
      : generationPrompt.trim().toLowerCase();

    if (!currentText) return;

    // Tokenize current input to get the last word
    const inputTokens = tokenizeText(currentText);
    if (inputTokens.length === 0) return;

    const lastWord = inputTokens[inputTokens.length - 1];
    
    // If last token is punctuation, let's see if it has transitions, else pick random
    const nextToken = sampleNextToken(lastWord, temperature);

    if (nextToken) {
      if (generatedTokens.length === 0) {
        setGeneratedTokens([generationPrompt.trim(), nextToken]);
      } else {
        setGeneratedTokens([...generatedTokens, nextToken]);
      }
      setGenStepCount(s => s + 1);
    } else {
      // Dead-end transition, append a message or stop
      const fallbackWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      if (generatedTokens.length === 0) {
        setGeneratedTokens([generationPrompt.trim(), `[${locale === "tr" ? "tıkanma - sıfırlanıyor" : "dead end - resetting"}]`, fallbackWord]);
      } else {
        setGeneratedTokens([...generatedTokens, `[${locale === "tr" ? "tıkanma" : "dead end"}]`, fallbackWord]);
      }
    }
  };

  // Auto generate multiple words
  useEffect(() => {
    if (isAutoGenerating) {
      const interval = setInterval(() => {
        const currentTokens = generatedTokens.length > 0 ? generatedTokens : [generationPrompt.trim().toLowerCase()];
        const lastWord = currentTokens[currentTokens.length - 1];
        const cleanedLastWord = lastWord.replace(/[.,!?;]/g, "");
        
        // Find next token
        const nextToken = sampleNextToken(cleanedLastWord || lastWord, temperature);
        if (nextToken && generatedTokens.length < 15) {
          if (generatedTokens.length === 0) {
            setGeneratedTokens([generationPrompt.trim(), nextToken]);
          } else {
            setGeneratedTokens([...generatedTokens, nextToken]);
          }
          setGenStepCount(s => s + 1);
        } else {
          setIsAutoGenerating(false);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isAutoGenerating, generatedTokens, generationPrompt, temperature, vocabulary]);

  const resetGeneration = () => {
    setGeneratedTokens([]);
    setIsAutoGenerating(false);
    setGenStepCount(0);
  };

  return (
    <Box 
      component={motion.div} 
      variants={container} 
      initial="hidden" 
      animate="show" 
      sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 5 }}
    >
      {slide === 0 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("infer.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("infer.desc.0") }} 
            />
          </Box>

          {/* Training Paragraph (Interactive Dataset) */}
          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BookOpen style={{ color: "#0071e3", width: 22, height: 22 }} />
                <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
                  {locale === "tr" ? "Eğitim Verisi (Paragraf)" : "Training Data (Paragraph)"}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  if (isEditingText) {
                    setRetrainFlash(true);
                    setGenStepCount(0);
                  }
                  setIsEditingText(!isEditingText);
                }}
              >
                {isEditingText 
                  ? (locale === "tr" ? "Eğitimi Tamamla" : "Save & Retrain") 
                  : (locale === "tr" ? "Metni Düzenle" : "Edit Text")}
              </Button>
            </Box>

                {isEditingText ? (
              <TextField
                multiline
                fullWidth
                rows={4}
                value={trainingText}
                onChange={(e) => {
                  setTrainingText(e.target.value);
                  setHasUserEdited(true);
                }}
                sx={{ 
                  bgcolor: "background.default",
                  "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "0.95rem" }
                }}
              />
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", 
                  p: 2.5, 
                  borderRadius: 2, 
                  fontFamily: "monospace", 
                  lineHeight: 1.7,
                  userSelect: "all"
                }}
              >
                {trainingText}
              </Typography>
            )}

            {retrainFlash && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: [0, 1, 0], y: [0, 0, -4] }}
                transition={{ duration: 1.2 }}
                onAnimationComplete={() => setRetrainFlash(false)}
                sx={{ textAlign: "center" }}
              >
                <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontFamily: "monospace" }}>
                  ⚡ {locale === "tr" ? "Model yeniden eğitildi!" : "Model retrained!"}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, fontSize: "0.8rem", color: "text.secondary" }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {locale === "tr" ? "Toplam Kelime:" : "Total Tokens:"}{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>{tokens.length}</Box>
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {locale === "tr" ? "Sözlük Boyutu:" : "Vocabulary Size:"}{" "}
                <Box component="span" sx={{ color: "primary.light", fontWeight: "bold" }}>{vocabulary.length}</Box>
              </Typography>
              {hasUserEdited && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<RotateCcw style={{ width: 14, height: 14 }} />}
                  onClick={() => {
                    setTrainingText(defaultTexts[locale]);
                    setHasUserEdited(false);
                    resetGeneration();
                  }}
                  sx={{ py: 0 }}
                >
                  {locale === "tr" ? "Sıfırla" : "Reset"}
                </Button>
              )}
            </Box>
          </Paper>

          {/* Comparison Table */}
          <Box component={motion.div} variants={item}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: "50%" }}>{t("infer.col.training")}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "50%" }}>{t("infer.col.inference")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.t1")}</TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.i1")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.t2")}</TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.i2")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.t3")}</TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.i3")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.t4")}</TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.i4")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.t5")}</TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>• {t("infer.i5")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {locale === "tr" ? "Çıkarım ve Cümle Üretim Laboratuvarı" : "Inference & Sentence Playground"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("infer.desc.1") }} 
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 4 }}>
            {/* Live Model Parameters / Temperature */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2, display: "block", fontWeight: "bold" }}>
                  {locale === "tr" ? "Model Parametreleri: Olasılık Dağılımları" : "Model Parameters: Probability Distribution"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 3, display: "block", lineHeight: 1.5 }}>
                  {locale === "tr"
                    ? "Sözlükten bir kelime seçin. Modelin bu kelimeden sonra hangi kelimelerin gelebileceğini nasıl öğrendiğini canlı olarak görün."
                    : "Select a word from vocabulary to inspect the model's learned transition probability distribution."}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <Typography variant="caption" sx={{ fontFamily: "monospace" }}>P( next_word |</Typography>
                  <Select
                    size="small"
                    value={selectedLookupWord}
                    onChange={(e) => {
                      setSelectedLookupWord(e.target.value);
                      setWordChangeKey(k => k + 1);
                    }}
                    sx={{ fontFamily: "monospace", minWidth: 100 }}
                  >
                    {vocabulary.map(word => (
                      <MenuItem key={word} value={word} sx={{ fontFamily: "monospace" }}>{word}</MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" sx={{ fontFamily: "monospace" }}>)</Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} key={wordChangeKey + "_" + temperature.toFixed(1)}>
                  {transitionProbs.length > 0 ? (
                    transitionProbs.map((item, i) => (
                      <Box key={item.word} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body2" noWrap sx={{ width: 64, fontFamily: "monospace", color: "text.primary" }}>
                          {item.word}
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 16, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.200", borderRadius: 1.5, overflow: "hidden" }}>
                          <Box
                            component={motion.div}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.probability * 100}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            sx={{
                              height: "100%",
                              bgcolor: i === 0 ? "primary.main" : "grey.500",
                              borderRadius: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              px: 0.5,
                            }}
                          >
                            {item.probability > 0.08 && (
                              <Typography variant="caption" sx={{ color: i === 0 ? "#fff" : "#fff", fontWeight: "bold", fontSize: "0.55rem" }}>
                                {(item.probability * 100).toFixed(0)}%
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ width: 36, textAlign: "right", fontFamily: "monospace", color: "text.secondary", fontSize: "0.65rem" }}>
                          ({item.rawCount}x)
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary", textAlign: "center", py: 3 }}>
                      {locale === "tr" ? "Bu kelimeden sonra bir geçiş yok (cümle sonu)." : "No transitions found for this word (end of text)."}
                    </Typography>
                  )}
                </Box>
              </Paper>

              <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2, display: "block", fontWeight: "bold" }}>
                  {locale === "tr" ? "Olasılıkları Şekillendir: Sıcaklık (Temperature)" : "Shape Probabilities: Temperature Slider"}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "between", fontFamily: "monospace", fontSize: "0.85rem" }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Temperature:</Typography>
                    <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold" }}>{temperature.toFixed(2)}</Typography>
                  </Box>
                  <Slider
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    value={temperature}
                    onChange={(_, val) => {
                      const t = val as number;
                      setTemperature(t);
                      setTempFlash(t < 0.5 ? "cold" : t > 1.5 ? "hot" : null);
                      setTimeout(() => setTempFlash(null), 400);
                    }}
                    sx={{ "& .MuiSlider-thumb": { transition: "box-shadow 0.15s", boxShadow: tempFlash === "hot" ? "0 0 0 8px rgba(239,68,68,0.3)" : tempFlash === "cold" ? "0 0 0 8px rgba(96,165,250,0.3)" : "none" } }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "text.secondary" }}>
                    <Typography variant="caption" component="span" sx={{ fontFamily: "monospace" }}>0.1 ({locale === "tr" ? "Robotik" : "Robotic"})</Typography>
                    <Typography variant="caption" component="span" sx={{ fontFamily: "monospace" }}>2.0 ({locale === "tr" ? "Çılagın" : "Creative"})</Typography>
                  </Box>
                </Box>

                <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 2, borderRadius: 1.5, mt: 3, border: 1, borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300" }}>
                  <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "text.primary", fontWeight: "bold" }}>
                    <HelpCircle style={{ color: "#0071e3", width: 16, height: 16 }} />
                    {locale === "tr" ? "Sıcaklık Nasıl Etki Eder?" : "How does Temperature work?"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.5, display: "block" }}>
                    {temperature < 0.5 
                      ? (locale === "tr" 
                        ? "Düşük Sıcaklık: Olasılıkları keskinleştirir. En yüksek skorlu kelimenin kazanma şansını aşırı artırır, tahminleri robotik yapar." 
                        : "Low Temperature: Sharpens probabilities. The highest count candidate dominates, leading to highly predictable predictions.")
                      : temperature > 1.2
                      ? (locale === "tr" 
                        ? "Yüksek Sıcaklık: Olasılıkları birbirine yakınlaştırır. Düşük olasılıklı kelimelerin seçilme şansını artırarak metin üretimini yaratıcı ve çılgın yapar." 
                        : "High Temperature: Softens probabilities. Flattens out distributions, allowing low-probability words to be selected, raising creativity.")
                      : (locale === "tr" 
                        ? "Dengeli Sıcaklık: Kelimelerin gerçek sıklıklarına göre doğal bir akışta örnekleme yapar." 
                        : "Balanced Temperature: Follows the natural training counts directly for a healthy, human-like generation flow.")}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Sentence Generation Playground */}
            <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "between", height: "100%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Sparkles style={{ color: "#0071e3", width: 20, height: 20 }} />
                    <Typography sx={{ fontWeight: "bold" }} variant="subtitle2">
                      {locale === "tr" ? "Cümle Üretim Laboratuvarı" : "Sentence Generator"}
                    </Typography>
                    {genStepCount > 0 && (
                      <Typography variant="caption" sx={{ color: "success.main", fontFamily: "monospace", fontWeight: "bold", fontSize: "0.65rem" }}>
                        +{genStepCount} {locale === "tr" ? "kelime" : "words"}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{locale === "tr" ? "Başlangıç:" : "Start:"}</Typography>
                    <Select
                      size="small"
                      value={generationPrompt}
                      onChange={(e) => {
                        setGenerationPrompt(e.target.value);
                        resetGeneration();
                      }}
                      sx={{ fontFamily: "monospace", fontSize: "0.8rem", height: 32 }}
                    >
                      {vocabulary.map(word => (
                        <MenuItem key={word} value={word} sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{word}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>

                {/* Text Screen Display */}
                  <Box 
                  component={isAutoGenerating ? motion.div : Box}
                  animate={isAutoGenerating ? { borderColor: ["rgba(0,113,227,0.3)", "rgba(52,211,153,0.3)", "rgba(0,113,227,0.3)"] } : undefined}
                  transition={isAutoGenerating ? { repeat: Infinity, duration: 1.5 } : undefined}
                  sx={{ 
                    bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", 
                    border: 1, 
                    borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300", 
                    borderRadius: 2, 
                    p: 2.5, 
                    minHeight: 140, 
                    fontFamily: "monospace", 
                    fontSize: "0.95rem", 
                    lineHeight: 1.7,
                    display: "flex", 
                    flexWrap: "wrap", 
                    alignItems: "center", 
                    gap: 1
                  }}
                >
                  {generatedTokens.length > 0 ? (
                    generatedTokens.map((tok, i) => {
                      const isPunct = /[.,!?;]/.test(tok);
                      const isLast = i === generatedTokens.length - 1;
                      return (
                        <Box
                          key={i}
                          component={motion.span}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          sx={{
                            color: isLast ? "primary.light" : (tok.startsWith("[") ? "error.light" : "text.primary"),
                            fontWeight: isLast || tok.startsWith("[") ? "bold" : "normal",
                            bgcolor: isLast ? "rgba(0,113,227,0.1)" : "transparent",
                            px: isLast ? 0.5 : 0,
                            borderRadius: 1,
                            fontFamily: "monospace"
                          }}
                        >
                          {tok}{!isPunct && " "}
                        </Box>
                      );
                    })
                  ) : (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic", display: "block" }}>
                      {locale === "tr" ? "Başlamak için aşağıdaki butonları kullanın..." : "Use the controls below to start generating tokens..."}
                    </Typography>
                  )}
                  <Box
                    component={motion.span}
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    sx={{ width: 3, height: 18, bgcolor: "primary.main", display: "inline-block", ml: 0.5 }}
                  />
                </Box>
              </Box>

              {/* Generation Controls */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleGenerateStep}
                  disabled={isAutoGenerating}
                  startIcon={<ChevronRight style={{ width: 16, height: 16 }} />}
                  sx={{ textTransform: "none" }}
                >
                  {locale === "tr" ? "1 Kelime Üret" : "Generate 1 Word"}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (isAutoGenerating) {
                      setIsAutoGenerating(false);
                    } else {
                      if (generatedTokens.length === 0) {
                        setGeneratedTokens([generationPrompt.trim()]);
                      }
                      setIsAutoGenerating(true);
                    }
                  }}
                  startIcon={<Play style={{ width: 14, height: 14 }} />}
                >
                  {isAutoGenerating 
                    ? (locale === "tr" ? "Durdur" : "Stop") 
                    : (locale === "tr" ? "Otomatik Üret" : "Auto-Generate")}
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={resetGeneration}
                  startIcon={<RotateCcw style={{ width: 14, height: 14 }} />}
                >
                  {locale === "tr" ? "Temizle" : "Reset"}
                </Button>
              </Box>
            </Paper>
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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("infer.insight") }} />
          </Paper>

          {/* Senior Developer Mode */}
          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Serving Large Language Models at scale in production requires significant engineering optimizations. Because modern parameters scale from 7B to 400B+ parameters, naive float32/float16 inference leads to huge memory footprints and slow response times.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>1. Quantization (Model Compression):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Quantization maps continuous floating-point weights (FP16 or BF16) to discrete lower-precision numerical representations (INT8, FP8, INT4, or NF4):
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"W_q = round( W / S ) + Z"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    where <code>S</code> is a scale factor and <code>Z</code> is a zero-point offset. Advanced techniques like <strong>AWQ (Activation-aware Weight Quantization)</strong> and <strong>GPTQ</strong> protect salient weights (e.g. weights corresponding to high-activation tokens) from severe precision reduction, enabling 4-bit quantized models to perform with almost zero perplexity loss compared to their FP16 baselines, reducing GPU VRAM needs by 4x.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>2. Speculative Decoding:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Text generation is bounded by GPU memory bandwidth (loading weights into SRAM takes longer than computing outputs). **Speculative Decoding** solves this by running a small &quot;draft model&quot; (e.g., LLaMA-1.1B) to quickly generate <code>K</code> candidate tokens autoregressively. Then, the larger &quot;target model&quot; (e.g., LLaMA-70B) evaluates all <code>K</code> tokens in parallel in a single forward pass. Tokens that match the target model&apos;s probability distribution are accepted, achieving up to a 2x-3x speedup.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>3. PagedAttention (KV Cache Management):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    In classical setups, GPU memory for the KV cache must be pre-allocated contiguously based on the maximum sequence length. This leads to up to 60-80% memory waste (&quot;internal fragmentation&quot;) because actual generations are shorter. **PagedAttention** (introduced in vLLM) partitions the KV cache into small, non-contiguous physical pages (similar to virtual memory in operating systems). Pages are allocated dynamically, allowing batch sizes to scale up to 4x, drastically increasing throughput.
                  </Typography>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Büyük Dil Modellerini endüstriyel boyutta sunmak (serving), büyük mühendislik optimizasyonları gerektirir. 7 milyardan 400 milyarın üzerine çıkan devasa parametre boyutları nedeniyle, ham float16 çıkarımı yüksek donanım maliyeti ve yavaş cevap süresine yol açar.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>1. Nicemleme (Quantization - Model Sıkıştırma):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Nicemleme işlemi, sürekli ondalıklı sayı ağırlıklarını (FP16 veya BF16) daha düşük hassasiyete sahip tamsayı veya küçük ondalık formatlara (INT8, FP8, INT4 veya NF4) yuvarlayarak eşleştirir:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"W_q = round( W / S ) + Z"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Burada <code>S</code> ölçek çarpanı, <code>Z</code> ise sıfır noktası kaymasıdır. <strong>AWQ (Activation-aware Weight Quantization)</strong> ve <strong>GPTQ</strong> gibi gelişmiş yöntemler, model kalitesi için kritik olan 'hassas ağırlıkları' (etkinleştirme değerleri yüksek olan kanalları) koruyarak 4-bit sıkıştırmada bile FP16 kalitesine yakın sonuçlar üretilmesini sağlar. Bu, VRAM ihtiyacını 4 kat azaltır.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>2. Spekülatif Kod Çözme (Speculative Decoding):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Çıkarım sırasında kelime üretimi GPU bellek bant genişliği ile sınırlıdır (ağırlıkları bellekten çekmek, onları işlemekten çok daha uzun sürer). **Spekülatif Kod Çözme**, bu darboğazı çözmek için daha küçük ve hızlı bir &quot;taslak model&quot; (örn. LLaMA-1.1B) kullanarak ardışık <code>K</code> adet kelime üretir. Büyük asıl model (örn. LLaMA-70B), bu <code>K</code> kelimeyi tek bir ileri geçişte (forward pass) paralel olarak doğrular. Doğrulanan kelimeler kabul edilir, böylece işlem hızı 2 ila 3 kat artırılmış olur.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>3. PagedAttention (KV Cache Yönetimi):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Geleneksel çıkarım motorlarında, KV cache bellek alanı her kullanıcı için maksimum bağlam uzunluğuna göre bitişik (contiguous) olarak ayrılırdı. Bu durum, gerçek üretilen metinler kısa kaldığında %60 ila %80 oranında bellek israfına (internal fragmentation) sebep oluyordu. **PagedAttention** (vLLM kütüphanesi ile popülerleşen), işletim sistemlerindeki sanal bellek gibi KV cache verisini küçük, bitişik olmayan bellek sayfalarına böler. Dinamik sayfa yönetimi sayesinde bellek israfı sıfıra yaklaşır ve sunucu kapasitesi (throughput) 4 katına kadar çıkabilir.
                  </Typography>
                </>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

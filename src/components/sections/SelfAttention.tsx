"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Button, Collapse, useTheme } from "@mui/material";

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

const qColors = { bg: "rgba(33, 150, 243, 0.12)", border: "rgba(33, 150, 243, 0.5)", text: "#60a5fa", label: "Q" };
const kColors = { bg: "rgba(76, 175, 80, 0.12)", border: "rgba(76, 175, 80, 0.5)", text: "#34d399", label: "K" };
const vColors = { bg: "rgba(255, 235, 59, 0.12)", border: "rgba(255, 235, 59, 0.5)", text: "#fbbf24", label: "V" };

const headColors = [
  { bg: "rgba(33, 150, 243, 0.15)", border: "rgba(33, 150, 243, 0.5)", text: "#60a5fa", name: "Özne-Yüklem / Subject-Verb" },
  { bg: "rgba(76, 175, 80, 0.15)", border: "rgba(76, 175, 80, 0.5)", text: "#34d399", name: "Sıfat-İsim / Adjective-Noun" },
  { bg: "rgba(255, 235, 59, 0.15)", border: "rgba(255, 235, 59, 0.5)", text: "#fbbf24", name: "Zaman / Tense" },
  { bg: "rgba(156, 39, 176, 0.15)", border: "rgba(156, 39, 176, 0.5)", text: "#c084fc", name: "Bağlam / Context" },
];

export default function SelfAttention({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [showQKV, setShowQKV] = useState(false);
  const [activeQWord, setActiveQWord] = useState<number>(0);

  const sentence = locale === "tr" ? sentenceTr : sentenceEn;
  const attentionWeights = locale === "tr" ? attentionWeightsTr : attentionWeightsEn;

  const QKVBar = ({ value, colors, label }: { value: number; colors: typeof qColors; label?: string }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: "bold", color: colors.text, width: 18, textAlign: "right" }}>
        {label || colors.label}
      </Typography>
      <Box sx={{ flex: 1, height: 8, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200", borderRadius: 1, overflow: "hidden" }}>
        <Box sx={{ width: `${Math.abs(value) * 100}%`, height: "100%", bgcolor: colors.text, borderRadius: 1, transition: "all 0.3s" }} />
      </Box>
      <Typography variant="caption" sx={{ fontFamily: "monospace", color: colors.text, width: 32, textAlign: "right", fontSize: "0.65rem" }}>
        {value.toFixed(2)}
      </Typography>
    </Box>
  );

  const matchScore = (qIdx: number, kIdx: number) => {
    const q = [0.8, 0.9, 0.7, 0.6, 0.85, 0.75][qIdx % 6] || 0.7;
    const k = [0.7, 0.8, 0.9, 0.6, 0.75, 0.85][kIdx % 6] || 0.7;
    return Math.min(1, (q * k) * 1.4);
  };

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
              {t("attn.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("attn.desc.0") }}
            />
          </Box>

          {/* Analogy card */}
          <Paper component={motion.div} variants={item} elevation={0} sx={{ p: 2.5, bgcolor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.08)" : "rgba(0, 113, 227, 0.04)", border: 1, borderColor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.2)" : "rgba(0, 113, 227, 0.1)", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7, fontStyle: "italic" }}>
              {locale === "tr"
                ? "🤝 Örnek: Bir grup insan düşün. Her biri diğerlerini dinler ve 'Bu benim için önemli mi?' diye karar verir. İşte Attention tam olarak bunu yapar — her kelime, diğer tüm kelimelere bakar ve 'Kim bana bağlam sağlıyor?' diye sorgular."
                : "🤝 Analogy: Imagine a group conversation. Each person listens to everyone else and decides 'Is this relevant to me?' That's exactly what Attention does — each word looks at every other word and asks 'Who gives me context?'"}
            </Typography>
          </Paper>

          {/* Interactive hover visualization */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("attn.hover")}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
              {sentence.map((word, i) => (
                <Button
                  key={i}
                  variant={hoveredWord === i ? "contained" : "outlined"}
                  onMouseEnter={() => setHoveredWord(i)}
                  onMouseLeave={() => setHoveredWord(null)}
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    boxShadow: hoveredWord === i ? "0 4px 12px rgba(0,113,227,0.2)" : "none",
                  }}
                >
                  {word}
                </Button>
              ))}
            </Box>

            {hoveredWord !== null && (
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", display: "block" }}>
                  {t("attn.attends", { word: sentence[hoveredWord] })}
                </Typography>

                {/* Connection lines visual */}
                <Box sx={{ position: "relative", height: 120, mb: 1 }}>
                  {sentence.map((word, i) => {
                    const weight = attentionWeights[hoveredWord]?.[i] || 0;
                    const isSelf = i === hoveredWord;
                    const barWidth = 100 / sentence.length;
                    return (
                      <Box key={i} sx={{ position: "absolute", left: `${i * barWidth + barWidth / 2}%`, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, height: "100%", justifyContent: "flex-end" }}>
                        {/* Animated connection line */}
                        <Box
                          component={motion.div}
                          animate={{ height: weight * 80 }}
                          sx={{
                            width: 4,
                            bgcolor: isSelf ? "primary.main" : "primary.light",
                            borderRadius: 2,
                            minHeight: 4,
                            opacity: isSelf ? 1 : 0.4 + weight * 0.6,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", textAlign: "center" }}>
                          {word}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontSize: "0.65rem", fontFamily: "monospace" }}>
                          {(weight * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* Bar chart */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, alignItems: "end", height: 80 }}>
                  {sentence.map((word, i) => {
                    const weight = attentionWeights[hoveredWord]?.[i] || 0;
                    return (
                      <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, width: 56 }}>
                        <Box
                          sx={{
                            width: "100%",
                            borderRadius: "4px 4px 0 0",
                            bgcolor: i === hoveredWord ? "primary.main" : "primary.light",
                            height: `${weight * 60}px`,
                            opacity: 0.3 + weight * 2,
                            transition: "all 0.2s"
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem", textAlign: "center" }}>
                          {word}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontSize: "0.6rem", fontFamily: "monospace" }}>
                          {(weight * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {hoveredWord === null && (
              <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", fontStyle: "italic", py: 2 }}>
                {t("attn.hoverhint")}
              </Typography>
            )}
          </Paper>

          {/* Insight card */}
          <Paper component={motion.div} variants={item} elevation={0} sx={{ p: 2.5, bgcolor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.1)" : "rgba(0, 113, 227, 0.05)", border: 1, borderColor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.2)" : "rgba(0, 113, 227, 0.1)", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("attn.insight") }} />
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("attn.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("attn.desc.1") }}
            />
          </Box>

          {/* Analogy: Library search */}
          <Paper component={motion.div} variants={item} elevation={0} sx={{ p: 2.5, bgcolor: theme.palette.mode === "dark" ? "rgba(76, 175, 80, 0.08)" : "rgba(76, 175, 80, 0.04)", border: 1, borderColor: theme.palette.mode === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7 }}>
              {locale === "tr"
                ? "📚 Kütüphane Benzetmesi: Query = \"Ne arıyorum?\" (kitap adı). Key = \"Bende ne var?\" (kitap etiketi). Value = \"İçindeki bilgi\" (kitabın kendisi). Önce soruyla (Q) etiketleri (K) eşleştirir, en iyi eşleşen kitapların içindeki bilgiyi (V) alır."
                : "📚 Library Analogy: Query = \"What am I looking for?\" (book title). Key = \"What do I have?\" (book label). Value = \"The actual info\" (book content). First match query (Q) with labels (K), then retrieve info (V) from best matches."}
            </Typography>
          </Paper>

          {/* Visual QKV per word */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("attn.qkv")}
            </Typography>

            {/* QKV Legend */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              {[
                { label: "Query (Q)", desc: locale === "tr" ? "Ne arıyorum?" : "What am I looking for?", colors: qColors },
                { label: "Key (K)", desc: locale === "tr" ? "Bende ne var?" : "What do I contain?", colors: kColors },
                { label: "Value (V)", desc: locale === "tr" ? "Ne bilgi veririm?" : "What info do I give?", colors: vColors },
              ].map(({ label, desc, colors }) => (
                <Box key={label} sx={{ flex: 1, p: 1.5, border: 1, borderColor: colors.border, bgcolor: colors.bg, borderRadius: 1.5, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: "bold", color: colors.text, display: "block" }}>
                    {label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    {desc}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Each word with Q, K, V bars */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {sentence.map((word, i) => {
                const isActive = i === activeQWord;
                const qVal = 0.5 + Math.random() * 0.5;
                const kVal = 0.5 + Math.random() * 0.5;
                const vVal = 0.5 + Math.random() * 0.5;
                return (
                  <Box
                    key={i}
                    component={motion.div}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5, p: 1,
                      bgcolor: isActive ? (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)") : "transparent",
                      borderRadius: 1.5, cursor: "pointer",
                      border: isActive ? 1 : 0,
                      borderColor: isActive ? "primary.dark" : "transparent",
                    }}
                    onClick={() => setActiveQWord(i)}
                  >
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold", color: isActive ? "primary.main" : "text.primary", minWidth: 70 }}>
                      {word}
                    </Typography>
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.3 }}>
                      <QKVBar value={qVal} colors={qColors} />
                      <QKVBar value={kVal} colors={kColors} />
                      <QKVBar value={vVal} colors={vColors} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Match visualization */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {locale === "tr" ? "🎯 Eşleşme: Q × K" : "🎯 Matching: Q × K"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6 }}>
              {locale === "tr"
                ? `"${sentence[activeQWord]}" kelimesinin Sorgusu (Q), tüm kelimelerin Anahtarı (K) ile eşleştirilir. Yüksek skor = yüksek ilgi!`
                : `Query (Q) of "${sentence[activeQWord]}" matches against every word's Key (K). Higher score = more attention!`}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {sentence.map((word, i) => {
                const score = matchScore(activeQWord, i);
                const isSelf = i === activeQWord;
                return (
                  <Box
                    key={i}
                    component={motion.div}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: i * 0.1 }}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: "monospace", minWidth: 70, color: isSelf ? "primary.main" : "text.secondary", fontWeight: isSelf ? "bold" : "normal" }}>
                      {word}
                    </Typography>
                    <Box sx={{ flex: 1, height: 24, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200", borderRadius: 1.5, overflow: "hidden", position: "relative" }}>
                      <Box
                        component={motion.div}
                        initial={{ width: 0 }}
                        animate={{ width: `${score * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                        sx={{
                          height: "100%",
                          bgcolor: isSelf ? "primary.main" : `rgba(0, 113, 227, ${0.3 + score * 0.7})`,
                          borderRadius: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          pr: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold", fontSize: "0.65rem" }}>
                          {(score * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
              {sentence.map((_, i) => (
                <Button
                  key={i}
                  size="small"
                  variant={activeQWord === i ? "contained" : "outlined"}
                  onClick={() => setActiveQWord(i)}
                  sx={{ minWidth: 36, px: 0.5, fontSize: "0.7rem" }}
                >
                  {sentence[i]}
                </Button>
              ))}
            </Box>

            <Collapse in={showQKV}>
              <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, p: 3, display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step1") }} />
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step2") }} />
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step3") }} />
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step4") }} />
                <Box sx={{ mt: 2, fontFamily: "monospace", fontSize: "0.85rem", color: "primary.light", bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.200", p: 2, borderRadius: 1.5 }}>
                  Attention(Q, K, V) = softmax(Q · K<sup>T</sup> / √d<sub>k</sub>) · V
                </Box>
              </Box>
            </Collapse>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowQKV(!showQKV)}
              >
                {showQKV ? t("attn.hide") : t("attn.show")}
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("attn.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("attn.desc.2") }}
            />
          </Box>

          {/* Multi-Head Visual */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
              👥 {locale === "tr" ? "Birden Çok Göz (Multi-Head)" : "Multiple Eyes (Multi-Head)"}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
              {locale === "tr"
                ? "Model sadece tek bir açıdan bakmaz. Aynı cümleye birden fazla 'göz' (head) ile bakar. Her göz farklı bir ilişkiyi yakalar."
                : "The model doesn't just look from one angle. It looks at the same sentence with multiple 'eyes' (heads). Each eye captures a different relationship."}
            </Typography>

            {/* Visual heads */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {headColors.map((head, headIdx) => {
                const isActive = activeQWord === headIdx;
                return (
                  <Box
                    key={headIdx}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: headIdx * 0.1 }}
                    sx={{
                      p: 1.5, borderRadius: 2, border: 1, borderColor: head.border, bgcolor: head.bg,
                      cursor: "pointer",
                      opacity: isActive ? 1 : 0.7,
                    }}
                    onClick={() => setActiveQWord(headIdx)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: head.text }} />
                      <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: "bold", color: head.text }}>
                        {locale === "tr" ? `Head #${headIdx + 1}` : `Head #${headIdx + 1}`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {head.name.split(" / ")[locale === "tr" ? 0 : 1] || head.name.split(" / ")[0]}
                      </Typography>
                    </Box>

                    {/* Visual: which words connect */}
                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                      {sentence.map((word, wi) => (
                        <Box key={wi} sx={{
                          px: 0.75, py: 0.25, borderRadius: 1, fontSize: "0.65rem",
                          fontFamily: "monospace", color: head.text,
                          bgcolor: isActive ? `${head.text}22` : "transparent",
                          border: 1, borderColor: `${head.text}33`,
                        }}>
                          {word}
                        </Box>
                      ))}
                    </Box>

                    {/* Connection lines */}
                    {isActive && (
                      <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 2 }}>
                        <Typography variant="caption" sx={{ color: head.text, fontSize: "0.6rem" }}>
                          {locale === "tr" ? "← odaklanıyor →" : "← focuses on →"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Concat + Projection visual */}
            <Box
              component={motion.div}
              variants={item}
              sx={{ mt: 3, p: 2.5, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2 }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: "bold", display: "block", mb: 1 }}>
                {locale === "tr" ? "🔗 Birleştir (Concat) + Yansıt (Project)" : "🔗 Concat + Project"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                {headColors.map((head, i) => (
                  <Box key={i} sx={{ width: 32, height: 48, bgcolor: head.text, borderRadius: 1, opacity: 0.7 }} />
                ))}
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold", mx: 1 }}>→</Typography>
                <Box sx={{ width: 48, height: 32, bgcolor: "primary.main", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold", fontSize: "0.6rem" }}>
                    W_O
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold", mx: 1 }}>→</Typography>
                <Box sx={{ width: 40, height: 40, bgcolor: "primary.light", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold", fontSize: "0.6rem" }}>
                    {locale === "tr" ? "Çıktı" : "Output"}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "center", mt: 1, fontSize: "0.7rem" }}>
                {locale === "tr"
                  ? "Tüm kafaların çıktısı uç uca eklenir, W_O matrisiyle sıkıştırılır ve tek bir anlamlı vektör üretilir."
                  : "All head outputs are concatenated, compressed via W_O matrix, producing a single meaningful vector."}
              </Typography>
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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("attn.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    In Decoder-only models (e.g., GPT, LLaMA), self-attention is <strong>causal</strong>. The attention mechanism is prohibited from attending to future tokens. This is achieved by adding a causal mask matrix <code>M</code> where elements above the diagonal are set to <code>-\infty</code> before applying Softmax:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"Attention(Q, K, V) = Softmax( (Q · Kᵀ / √d_k) + M ) · V"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    where <code>M_&#123;i, j&#125; = 0</code> if <code>j \le i</code>, and <code>M_&#123;i, j&#125; = -\infty</code> if <code>j &gt; i</code>. The scaling factor <code>\sqrt&#123;d_k&#125;</code> prevents the dot products from growing too large in magnitude, which would push the softmax function into regions with extremely small gradients.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Multi-Head Attention (MHA) & Projection:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    To capture different types of contextual dependencies, we run <code>h</code> attention heads in parallel and concatenate their outputs before projecting:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · Wᴼ"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    where <code>W^O \in \mathbb&#123;R&#125;^&#123;h \cdot d_v \times d_&#123;model&#125;&#125;</code> mixes the information learned by different attention heads.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Real-world Optimizations:</Typography>
                  <Box component="ul" sx={{ listStyle: "disc", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Grouped-Query Attention (GQA):</strong> Modern architectures (like LLaMA-3) share key/value projections across groups of query heads (e.g., 8 query heads per 1 KV head) to reduce memory bandwidth bottleneck in caching KV tensors during inference.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>FlashAttention:</strong> Rather than constructing the intermediate <code>N \times N</code> attention matrix in slow GPU High-Bandwidth Memory (HBM), FlashAttention computes attention block-by-block on GPU SRAM using online softmax and tiling, achieving 2x to 4x speedups.</Typography>
                  </Box>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Sadece Dekoder içeren modellerde (örn. GPT, LLaMA), öz-dikkat mekanizması <strong>nedenseldir (causal)</strong>. Yani bir kelimenin kendisinden sonraki kelimelere bakması maskelenerek engellenir. Bu, Softmax işleminden önce üst üçgen matris elemanlarının <code>-\infty</code> ile çarpılmasıyla (maske matrisi <code>M</code> eklenmesiyle) sağlanır:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"Attention(Q, K, V) = Softmax( (Q · Kᵀ / √d_k) + M ) · V"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Burada <code>j &gt; i</code> ise <code>M_&#123;i, j&#125; = -\infty</code>, aksi halde <code>0</code>&apos;dır. <code>\sqrt&#123;d_k&#125;</code> ölçekleme faktörü, matris çarpımının büyümesini engeller; aksi halde softmax gradyanları sıfırlanıp sönümlenirdi (gradient vanishing).
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Çok Başlı Dikkat (Multi-Head Attention) ve Yansıtma:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Farklı konumsal ve anlamsal ilişkileri yakalamak için <code>h</code> tane dikkat kafası paralel çalıştırılır, çıktılar birleştirilir ve yansıtılır:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · Wᴼ"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Burada <code>W^O \in \mathbb&#123;R&#125;^&#123;h \cdot d_v \times d_&#123;model&#125;&#125;</code> matrisi, tüm dikkat kafalarından gelen bilgileri harmanlayarak modelin ana boyutuna geri indirger.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Gerçek Hayattaki Optimizasyonlar:</Typography>
                  <Box component="ul" sx={{ listStyle: "disc", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Grouped-Query Attention (GQA):</strong> LLaMA-3 gibi modern modeller, çıkarım (inference) sırasında KV-cache belleğinin darboğaz oluşturmasını engellemek için Key ve Value kafalarını gruplayarak paylaşır (örn. 8 Query kafasına 1 KV kafası).</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>FlashAttention:</strong> <code>N \times N</code> boyutundaki devasa dikkat matrisini GPU ana belleğine (HBM) yazmak yerine, tiling ve çevrimiçi softmax teknikleriyle doğrudan GPU SRAM (hızlı bellek) üzerinde blok blok hesaplayarak 2 ila 4 kat hız kazandırır.</Typography>
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

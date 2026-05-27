"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Button, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Training({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [loss, setLoss] = useState(4.5);

  useEffect(() => {
    if (isTraining && epoch < 20) {
      const timer = setTimeout(() => {
        setEpoch(epoch + 1);
        setLoss(4.5 * Math.exp(-0.15 * (epoch + 1)) + 0.3 + Math.random() * 0.1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (epoch >= 20) {
      setIsTraining(false);
    }
  }, [isTraining, epoch]);

  const lossHistory = Array.from({ length: epoch + 1 }, (_, i) =>
    4.5 * Math.exp(-0.15 * i) + 0.3
  );

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
              {t("train.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("train.desc.0") }} 
            />
          </Box>

          {/* Steps List */}
          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("train.phase")}
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {[
                { step: "1", text: t("train.step1"), textColor: "#60a5fa" },
                { step: "2", text: t("train.step2"), textColor: "#34d399" },
                { step: "3", text: t("train.step3"), textColor: "#fbbf24" },
                { step: "4", text: t("train.step4"), textColor: "#f87171" },
                { step: "5", text: t("train.step5"), textColor: "#93c5fd" },
              ].map((s, i) => (
                <Box
                  key={s.step}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  sx={{ display: "flex", alignItems: "start", gap: 2 }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: theme.palette.mode === "dark" ? "grey.850" : "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: "text.primary",
                      fontWeight: "bold",
                      flexShrink: 0
                    }}
                  >
                    {s.step}
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? s.textColor : "text.primary", fontSize: "0.95rem" }}>
                    {s.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 2.5, borderRadius: 2, display: "flex", flexDirection: "column", gap: 1, fontFamily: "monospace", fontSize: "0.9rem" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace", mb: 1, display: "block" }}>{t("train.example")}</Typography>
              <Box>
                <Box component="span" sx={{ color: "text.secondary" }}>Giriş (Input): &quot;{locale === "tr" ? "Türkiye'nin başkenti" : "The capital of France is"}&quot;</Box>
              </Box>
              <Box>
                <Box component="span" sx={{ color: "text.secondary" }}>Hedef (Target): </Box>
                <Box component="span" sx={{ color: "#4caf50", fontWeight: "bold" }}>&quot;{locale === "tr" ? "Ankara" : "Paris"}&quot;</Box>
              </Box>
              <Box>
                <Box component="span" sx={{ color: "text.secondary" }}>Tahmin (Predicted): </Box>
                <Box component="span" sx={{ color: "#f44336", fontWeight: "bold" }}>&quot;{locale === "tr" ? "İstanbul" : "London"}&quot;</Box>
                <Box component="span" sx={{ color: "text.secondary" }}> {locale === "tr" ? " → Yanlış! Ağırlıkları güncelle." : " → Wrong! Adjust weights."}</Box>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {locale === "tr" ? "Büyük Resim: Bir Cümlenin Yolculuğu" : "Big Picture: A Sentence's Journey"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("train.desc.1") }} 
            />
          </Box>

          <PipelineAnimation locale={locale} theme={theme} />

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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("train.insight") }} />
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {locale === "tr" ? "Hata Payı ve Simülasyon" : "Loss & Training Simulation"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("train.desc.2") }} 
            />
          </Box>

          {/* Concrete example card */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: "bold" }}>
              {locale === "tr" ? "🎯 Tek Bir Örnek Üzerinden Görelim" : "🎯 Let's Walk Through One Example"}
            </Typography>

            {/* The example sentence */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, fontFamily: "monospace" }}>
                {locale === "tr" ? "Cümle: " : "Sentence: "}
                <Box component="span" sx={{ color: "text.primary" }}>
                  &quot;{locale === "tr" ? "Türkiye'nin başkenti" : "The capital of Turkey is"}&quot;
                </Box>
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 1 }}>
                <Box sx={{ px: 2, py: 1, borderRadius: 1.5, bgcolor: "rgba(96,165,250,0.15)", border: 1, borderColor: "#60a5fa", fontFamily: "monospace", color: "#60a5fa", fontSize: "0.85rem" }}>
                  {locale === "tr" ? "Türkiye'nin" : "The"}
                </Box>
                <Typography variant="caption" sx={{ color: "grey.500" }}>+</Typography>
                <Box sx={{ px: 2, py: 1, borderRadius: 1.5, bgcolor: "rgba(52,211,153,0.15)", border: 1, borderColor: "#34d399", fontFamily: "monospace", color: "#34d399", fontSize: "0.85rem" }}>
                  {locale === "tr" ? "başkenti" : "capital"}
                </Box>
                <Typography variant="caption" sx={{ color: "grey.500" }}>+</Typography>
                <Box sx={{ px: 2, py: 1, borderRadius: 1.5, bgcolor: "rgba(251,191,36,0.15)", border: 1, borderColor: "#fbbf24", fontFamily: "monospace", color: "#fbbf24", fontSize: "0.85rem" }}>
                  {locale === "tr" ? "→ ?" : "of Turkey is → ?"}
                </Box>
              </Box>
            </Box>

            {/* BEFORE / AFTER comparison */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
              {/* BEFORE */}
              <Paper variant="outlined" sx={{ p: 2.5, borderColor: "#f87171" }}>
                <Typography variant="caption" sx={{ color: "#f87171", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em", mb: 1.5, display: "block" }}>
                  {locale === "tr" ? "🔴 Eğitim ÖNCESİ" : "🔴 BEFORE Training"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5, fontSize: "0.85rem" }}>
                  {locale === "tr" ? "Model rastgele tahmin ediyor:" : "Model guesses randomly:"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                    {locale === "tr" ? "Tahmin:" : "Prediction:"}
                  </Typography>
                  {locale === "tr"
                    ? ["İstanbul", "Ankara", "Bursa", "İzmir"].map((w, i) => (
                        <Box key={w} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: i === 0 ? "#f87171" : "grey.700", bgcolor: i === 0 ? "rgba(248,113,113,0.15)" : "transparent", fontFamily: "monospace", fontSize: "0.75rem", color: i === 0 ? "#f87171" : "grey.500", fontWeight: i === 0 ? "bold" : "normal" }}>
                          {w}
                        </Box>
                      ))
                    : ["London", "Ankara", "Paris", "Berlin"].map((w, i) => (
                        <Box key={w} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: i === 0 ? "#f87171" : "grey.700", bgcolor: i === 0 ? "rgba(248,113,113,0.15)" : "transparent", fontFamily: "monospace", fontSize: "0.75rem", color: i === 0 ? "#f87171" : "grey.500", fontWeight: i === 0 ? "bold" : "normal" }}>
                          {w}
                        </Box>
                      ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, bgcolor: "rgba(248,113,113,0.1)", borderRadius: 1.5, border: 1, borderColor: "rgba(248,113,113,0.2)" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#f87171", fontWeight: "bold" }}>
                      {locale === "tr" ? "Doğru cevap:" : "Correct answer:"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#34d399", fontWeight: "bold", fontFamily: "monospace" }}>
                      &quot;{locale === "tr" ? "Ankara" : "Ankara"}&quot;
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" sx={{ color: "#f87171", fontSize: "0.6rem" }}>
                      {locale === "tr" ? "Hata Payı:" : "Loss:"}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#f87171", fontWeight: "bold", fontFamily: "monospace" }}>
                      4.5
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, p: 1, bgcolor: "rgba(248,113,113,0.05)", borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: "#f87171", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                    ❌ {locale === "tr" ? '"İstanbul" dedi, "Ankara" olmalıydı. Çok yanlış! Model ağırlıklarını güncelliyor...' : 'Said "London", should be "Ankara". Very wrong! Updating weights...'}
                  </Typography>
                </Box>
              </Paper>

              {/* AFTER */}
              <Paper variant="outlined" sx={{ p: 2.5, borderColor: "#34d399" }}>
                <Typography variant="caption" sx={{ color: "#34d399", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em", mb: 1.5, display: "block" }}>
                  {locale === "tr" ? "🟢 Eğitim SONRASI" : "🟢 AFTER Training"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5, fontSize: "0.85rem" }}>
                  {locale === "tr" ? "Model artık doğru tahmin ediyor:" : "Model now predicts correctly:"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                    {locale === "tr" ? "Tahmin:" : "Prediction:"}
                  </Typography>
                  {locale === "tr"
                    ? ["İstanbul", "Ankara", "Bursa", "İzmir"].map((w, i) => (
                        <Box key={w} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: i === 1 ? "#34d399" : "grey.700", bgcolor: i === 1 ? "rgba(52,211,153,0.15)" : "transparent", fontFamily: "monospace", fontSize: "0.75rem", color: i === 1 ? "#34d399" : "grey.500", fontWeight: i === 1 ? "bold" : "normal" }}>
                          {w}
                        </Box>
                      ))
                    : ["London", "Ankara", "Paris", "Berlin"].map((w, i) => (
                        <Box key={w} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: i === 1 ? "#34d399" : "grey.700", bgcolor: i === 1 ? "rgba(52,211,153,0.15)" : "transparent", fontFamily: "monospace", fontSize: "0.75rem", color: i === 1 ? "#34d399" : "grey.500", fontWeight: i === 1 ? "bold" : "normal" }}>
                          {w}
                        </Box>
                      ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, bgcolor: "rgba(52,211,153,0.1)", borderRadius: 1.5, border: 1, borderColor: "rgba(52,211,153,0.2)" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#34d399", fontWeight: "bold" }}>
                      {locale === "tr" ? "Doğru cevap:" : "Correct answer:"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#34d399", fontWeight: "bold", fontFamily: "monospace" }}>
                      &quot;{locale === "tr" ? "Ankara" : "Ankara"}&quot;
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" sx={{ color: "#34d399", fontSize: "0.6rem" }}>
                      {locale === "tr" ? "Hata Payı:" : "Loss:"}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#34d399", fontWeight: "bold", fontFamily: "monospace" }}>
                      0.3
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, p: 1, bgcolor: "rgba(52,211,153,0.05)", borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: "#34d399", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                    ✅ {locale === "tr" ? '"Ankara" dedi, doğru! Hata payı çok düştü.' : 'Said "Ankara" — correct! Loss is very low now.'}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Arrow showing loss decreasing */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mt: 2.5, p: 1.5, bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: "#f87171", fontWeight: "bold", fontFamily: "monospace", fontSize: "0.9rem" }}>
                Hata: 4.5
              </Typography>
              <Typography variant="h5" sx={{ color: "grey.500" }}>→</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "grey.500", fontSize: "0.6rem" }}>
                  {locale === "tr" ? "Ağırlıkları Güncelle" : "Update Weights"}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey.500", fontSize: "0.55rem" }}>
                  (× Milyarlarca tekrar)
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: "grey.500" }}>→</Typography>
              <Typography variant="caption" sx={{ color: "#34d399", fontWeight: "bold", fontFamily: "monospace", fontSize: "0.9rem" }}>
                Hata: 0.3
              </Typography>
            </Box>
          </Paper>

          {/* Loss chart simulation */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
              {locale === "tr" ? "📉 Hata Payının Düşüşünü İzle" : "📉 Watch the Loss Decrease"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", mb: 2, display: "block" }}>
              {locale === "tr"
                ? "Her adımda model bir cümle okur, tahmin yapar, yanlışsa ağırlıklarını günceller. Hata payı giderek azalır:"
                : "Each step: model reads a sentence, predicts, if wrong updates weights. Loss keeps decreasing:"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => { setEpoch(0); setLoss(4.5); setIsTraining(true); }}
                sx={{ px: 3 }}
              >
                {t("train.simulate")}
              </Button>
              <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                {locale === "tr" ? "Adım" : "Step"}: <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>{epoch}</Box> / 20
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: loss > 2 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399") }} />
                <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                  {locale === "tr" ? "Hata" : "Loss"}: <Box component="span" sx={{ color: loss > 2 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399"), fontWeight: "bold" }}>{loss.toFixed(2)}</Box>
                </Typography>
                {loss < 0.5 && (
                  <Typography variant="caption" sx={{ color: "#34d399", fontWeight: "bold" }}>
                    ✅ {locale === "tr" ? "Neredeyse sıfır!" : "Almost zero!"}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Chart */}
            <Box sx={{ position: "relative", height: 180, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, overflow: "hidden", border: 1, borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300" }}>
              {/* Y-axis labels */}
              <Typography variant="caption" sx={{ position: "absolute", top: 4, left: 8, color: "#f87171", fontFamily: "monospace", fontSize: "0.6rem" }}>
                ↑ Hata / Loss
              </Typography>
              <Typography variant="caption" sx={{ position: "absolute", top: 8, right: 8, color: "#f87171", fontFamily: "monospace", fontSize: "0.55rem" }}>
                Yüksek
              </Typography>
              <Typography variant="caption" sx={{ position: "absolute", bottom: 8, right: 8, color: "#34d399", fontFamily: "monospace", fontSize: "0.55rem" }}>
                Düşük
              </Typography>
              <Typography variant="caption" sx={{ position: "absolute", bottom: 8, left: 8, color: "text.secondary", fontFamily: "monospace", fontSize: "0.55rem" }}>
                Eğitim Adımları →
              </Typography>

              <svg width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0 }} viewBox="0 0 200 100" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#333" strokeWidth="0.3" opacity="0.5" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#333" strokeWidth="0.3" opacity="0.5" />
                <line x1="0" y1="80" x2="200" y2="80" stroke="#333" strokeWidth="0.3" opacity="0.5" />

                {/* Loss curve */}
                {lossHistory.length > 1 && (
                  <>
                    <defs>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d={lossHistory.map((l, i) => {
                        const x = (i / 20) * 200;
                        const y = 100 - ((l - 0.2) / 4.5) * 90;
                        return `${i === 0 ? "M" : "L"}${x},${y}`;
                      }).join(" ")}
                      fill="none"
                      stroke="url(#lossGrad)"
                      strokeWidth="0"
                    />
                    <path
                      d={lossHistory.map((l, i) => {
                        const x = (i / 20) * 200;
                        const y = 100 - ((l - 0.2) / 4.5) * 90;
                        return `${i === 0 ? "M" : "L"}${x},${y}`;
                      }).join(" ")}
                      fill="none"
                      stroke={loss > 2 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399")}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Current point */}
                    <circle cx={(epoch / 20) * 200} cy={100 - ((loss - 0.2) / 4.5) * 90} r="4" fill={loss > 2 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399")} stroke="#000" strokeWidth="1" />
                  </>
                )}
                {/* Before line (dashed, showing starting loss at 4.5) */}
                <line x1="0" y1="14" x2="40" y2="14" stroke="#f87171" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
                <text x="2" y="12" fill="#f87171" fontSize="4" opacity="0.6">4.5</text>
                {/* After line */}
                {epoch >= 20 && (
                  <>
                    <line x1="160" y1="92" x2="195" y2="92" stroke="#34d399" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
                    <text x="162" y="90" fill="#34d399" fontSize="4" opacity="0.7">0.3</text>
                  </>
                )}
              </svg>

              {/* Overlay status */}
              <Box sx={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: loss > 2 ? "rgba(248,113,113,0.15)" : (loss > 1 ? "rgba(251,191,36,0.15)" : "rgba(52,211,153,0.15)") }}>
                <Typography variant="caption" sx={{ color: loss > 2 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399"), fontWeight: "bold", fontSize: "0.6rem" }}>
                  {loss > 2
                    ? (locale === "tr" ? "🔴 Çok karışık, çoğu tahmin yanlış" : "🔴 Very confused, most guesses wrong")
                    : (loss > 1
                      ? (locale === "tr" ? "🟡 Öğreniyor, hata düşüyor..." : "🟡 Learning, loss decreasing...")
                      : (locale === "tr" ? "🟢 İyi öğrendi! Tahminler doğru" : "🟢 Learned well! Predictions accurate"))}
                </Typography>
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block", textAlign: "center", fontStyle: "italic", fontSize: "0.6rem" }}>
              {locale === "tr"
                ? "20 adımlık simülasyon. Gerçek eğitim milyarlarca adım sürer."
                : "20-step simulation. Real training takes billions of steps."}
            </Typography>
          </Paper>

          {/* Senior Developer Mode */}
          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Pre-training optimizes the model parameters <code>&theta;</code> by maximizing the likelihood of the training corpus. Mathematically, we minimize the cross-entropy loss function over sequence batches:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    L(\theta) = - \frac&#123;1&#125;&#123;N&#125; \sum_&#123;i=1&#125;^N \log P(x_i | x_&#123;&lt;i&#125;; &theta;)
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Optimizer: AdamW</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    To update the parameters <code>&theta;</code>, we use the <strong>AdamW</strong> optimizer, which computes adaptive learning rates for individual parameters using estimates of the first (mean) and second (uncentered variance) moments of the gradients, with decoupled weight decay:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "left", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>g_t = \nabla_\theta L(\theta_&#123;t-1&#125;)</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>m_t = \beta_1 m_&#123;t-1&#125; + (1-\beta_1) g_t \quad (\text&#123;First moment&#125;)</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>v_t = \beta_2 v_&#123;t-1&#125; + (1-\beta_2) g_t^2 \quad (\text&#123;Second moment&#125;)</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>\theta_t = \theta_&#123;t-1&#125; - \frac&#123;\alpha&#125;&#123;\sqrt&#123;v_t&#125; + \epsilon&#125; m_t - \lambda \theta_&#123;t-1&#125; \quad (\text&#123;Weight decay update&#125;)</Typography>
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Training Phases:</Typography>
                  <Box component="ol" sx={{ listStyle: "decimal", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Pre-training (Next Token Prediction):</strong> The model reads trillions of tokens from the web to learn grammar, syntax, facts, and reasoning patterns. Generates base model.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Supervised Fine-Tuning (SFT):</strong> Tuned on high-quality demonstration conversations (queries and responses written by humans) to teach the model to act as a helpful chatbot.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Alignment (RLHF/DPO):</strong> Uses **Reinforcement Learning from Human Feedback (RLHF)** via PPO or **Direct Preference Optimization (DPO)** to align model outputs with human preferences regarding truthfulness, safety, and utility.</Typography>
                  </Box>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Ön-eğitim (pre-training) aşamasında, model parametreleri <code>&theta;</code>, veri kümesindeki kelimelerin olasılığını en üst düzeye çıkaracak şekilde eğitilir. Matematiksel olarak çapraz entropi (cross-entropy) kaybı minimize edilir:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    L(\theta) = - \frac&#123;1&#125;&#123;N&#125; \sum_&#123;i=1&#125;^N \log P(x_i | x_&#123;&lt;i&#125;; &theta;)
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Optimizasyon Algoritması: AdamW</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Parametrelerin <code>&theta;</code> güncellenmesinde **AdamW** optimizasyon algoritması kullanılır. Bu algoritma, gradyanların birinci (ortalama) ve ikinci (varyans) momentlerini hesaplayarak parametre bazlı adaptif öğrenme adımları belirlerken, ağırlık sönümlemeyi (weight decay) decoupled olarak uygular:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "left", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>g_t = \nabla_\theta L(\theta_&#123;t-1&#125;)</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>m_t = \beta_1 m_&#123;t-1&#125; + (1-\beta_1) g_t \quad (\text&#123;Birinci moment - ivme&#125;)</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>v_t = \beta_2 v_&#123;t-1&#125; + (1-\beta_2) g_t^2 \quad (\text&#123;İkinci moment - varyans&#125;)</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light", fontSize: "0.75rem" }}>\theta_t = \theta_&#123;t-1&#125; - \frac&#123;\alpha&#125;&#123;\sqrt&#123;v_t&#125; + \epsilon&#125; m_t - \lambda \theta_&#123;t-1&#125; \quad (\text&#123;Ağırlık sönümleme güncellemesi&#125;)</Typography>
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Model Eğitim Aşamaları:</Typography>
                  <Box component="ol" sx={{ listStyle: "decimal", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Ön-Eğitim (Pre-training):</strong> Trilyonlarca web verisi üzerinde bir sonraki token tahmini yaptırılır. Model dilin yapısını, genel kültür bilgilerini ve mantık kurallarını öğrenir (Taban Model oluşur).</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>Denetimli İnce Ayar (Supervised Fine-Tuning - SFT):</strong> Modelin bir asistan gibi davranmasını sağlamak için, insan eliyle yazılmış soru-cevap veri setleri üzerinde ince ayar yapılır.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><strong>İnsan Tercihleri ile Hizalama (RLHF/DPO):</strong> Modelin zararlı içerikler üretmesini önlemek, daha doğru ve faydalı olmasını sağlamak için **İnsan Geri Bildirimiyle Pekiştirmeli Öğrenme (RLHF)** veya **Direct Preference Optimization (DPO)** uygulanır.</Typography>
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

function PipelineAnimation({ locale, theme }: { locale: string; theme: any }) {
  const [activeStep, setActiveStep] = useState(0);

  const trWords = ["Kedi", "halının", "üzerine", "oturdu"];
  const enWords = ["The", "cat", "sat"];
  const words = locale === "tr" ? trWords : enWords;
  const sentence = words.join(" ");

  const wordColors = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c"];
  const tokenIds = locale === "tr" ? [142, 3891, 5217, 2304] : [198, 3512, 8954];
  const nextWordScores = locale === "tr"
    ? [{ word: "oturdu", score: 0.76 }, { word: "çıktı", score: 0.12 }, { word: "uzandı", score: 0.08 }, { word: "düştü", score: 0.04 }]
    : [{ word: "sat", score: 0.68 }, { word: "slept", score: 0.15 }, { word: "lay", score: 0.10 }, { word: "jumped", score: 0.07 }];
  const nextWord = locale === "tr" ? "oturdu" : "sat";

  const next = useCallback(() => {
    if (activeStep < 5) {
      setActiveStep(s => s + 1);
    }
  }, [activeStep]);

  const reset = useCallback(() => {
    setActiveStep(0);
  }, []);

  const stageColors = [
    { border: "rgba(76, 175, 80, 0.4)", bg: "rgba(76, 175, 80, 0.1)", text: "#34d399" },
    { border: "rgba(33, 150, 243, 0.4)", bg: "rgba(33, 150, 243, 0.1)", text: "#60a5fa" },
    { border: "rgba(255, 235, 59, 0.4)", bg: "rgba(255, 235, 59, 0.1)", text: "#fdeb3b" },
    { border: "rgba(156, 39, 176, 0.4)", bg: "rgba(156, 39, 176, 0.1)", text: "#c084fc" },
    { border: "rgba(255, 152, 0, 0.4)", bg: "rgba(255, 152, 0, 0.1)", text: "#fb923c" },
    { border: "rgba(76, 175, 80, 0.4)", bg: "rgba(76, 175, 80, 0.1)", text: "#34d399" },
  ];

  const stages = [
    {
      label: locale === "tr" ? "📝 Giriş Metni" : "📝 Input Text",
      desc: locale === "tr" ? "Kullanıcı bir cümle yazar." : "User enters a sentence.",
      visual: (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          {words.map((w, i) => (
            <Box key={i} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: wordColors[i], bgcolor: `${wordColors[i]}22`, fontFamily: "monospace", fontWeight: "bold", color: wordColors[i], fontSize: "0.85rem" }}>
              {w}
            </Box>
          ))}
        </Box>
      ),
    },
    {
      label: locale === "tr" ? "🔢 Token ID'lerine Çevir" : "🔢 Convert to Token IDs",
      desc: locale === "tr" ? "Her kelime, sözlükteki numarasına (ID) dönüştürülür." : "Each word is mapped to its vocabulary number (ID).",
      visual: (
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1 }}>
          {words.map((w, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, border: 1, borderColor: wordColors[i], bgcolor: `${wordColors[i]}22`, fontFamily: "monospace", color: wordColors[i], fontSize: "0.85rem" }}>
                {w}
              </Box>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: "grey.500", fontSize: "0.65rem" }}>
                ↓ ID[{tokenIds[i]}]
              </Typography>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300", fontFamily: "monospace", color: "text.primary", fontSize: "0.8rem", fontWeight: "bold" }}>
                [{tokenIds[i]}]
              </Box>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      label: locale === "tr" ? "📊 Vektöre Çevir (Embedding)" : "📊 Embedding (Vectorize)",
      desc: locale === "tr" ? "Her ID, anlamını taşıyan bir sayı listesine (vektör) dönüşür. Benzer anlamlı kelimelerin vektörleri birbirine yakın olur." : "Each ID becomes a number list (vector) carrying meaning. Similar words have similar vectors.",
      visual: (
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1 }}>
          {words.map((w, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: wordColors[i], fontSize: "0.7rem", fontWeight: "bold" }}>
                {w}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.3 }}>
                {[0.8, 0.2, -0.5, 0.9, -0.1, 0.6, 0.3, -0.4].map((v, vi) => (
                  <Box key={vi} sx={{ width: 10, height: 24, borderRadius: "2px", bgcolor: v > 0 ? "primary.main" : "error.main", opacity: Math.abs(v), transition: "all 0.3s" }} />
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: "grey.500", fontSize: "0.55rem" }}>
                [{tokenIds[i]}] → 8 sayı
              </Typography>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      label: locale === "tr" ? "🧠 Transformer Blokları (×N)" : "🧠 Transformer Blocks (×N)",
      desc: locale === "tr" ? "Vektörler sırayla Norm → Attention → MLP adımlarından geçer. Her blok kelimeler arası bağlamı derinleştirir." : "Vectors flow through Norm → Attention → MLP repeatedly. Each block deepens context.",
      visual: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: "grey.600", bgcolor: `${wordColors[0]}22` }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: wordColors[0], fontSize: "0.7rem" }}>
                Kedi
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "grey.500" }}>+</Typography>
            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: "grey.600", bgcolor: `${wordColors[1]}22` }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: wordColors[1], fontSize: "0.7rem" }}>
                halının
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "grey.500" }}>+</Typography>
            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: "grey.600", bgcolor: `${wordColors[2]}22` }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: wordColors[2], fontSize: "0.7rem" }}>
                üzerine
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
            {["⚖️ Norm", "👁️ Attn", "🧠 MLP"].map((step, si) => (
              <Box key={si} sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200", border: 1, borderColor: "grey.700" }}>
                <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary", fontSize: "0.65rem" }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "grey.500", textAlign: "center", fontSize: "0.6rem" }}>
            {locale === "tr" ? "Bu döngü tüm kelime çiftleri arasında tekrarlanır. ×12, ×24, ×96 katman" : "This cycles across all word pairs. ×12, ×24, ×96 layers"}
          </Typography>
        </Box>
      ),
    },
    {
      label: locale === "tr" ? "🎯 Olasılık Dağıt (Softmax)" : "🎯 Softmax (Probability)",
      desc: locale === "tr" ? "Son bloğun çıktısı Softmax'e girer. Tüm kelimelere yüzde (%) olasılık atanır." : "Last block output enters Softmax. Every word gets a probability (%).",
      visual: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          {nextWordScores.map((nw, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary", minWidth: 60, fontSize: "0.75rem" }}>
                {nw.word}
              </Typography>
              <Box sx={{ flex: 1, height: 18, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200", borderRadius: 1.5, overflow: "hidden" }}>
                <Box sx={{ width: `${nw.score * 100}%`, height: "100%", bgcolor: i === 0 ? "#34d399" : theme.palette.mode === "dark" ? "grey.600" : "grey.400", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "flex-end", px: 0.5 }}>
                  <Typography variant="caption" sx={{ color: i === 0 ? "#000" : "#fff", fontWeight: "bold", fontSize: "0.6rem" }}>
                    {(nw.score * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      label: locale === "tr" ? "✨ Sonraki Kelimeyi Seç" : "✨ Pick Next Word",
      desc: locale === "tr" ? `En yüksek olasılıklı kelime (${nextWord}) seçilir, cümlenin sonuna eklenir.` : `Highest probability word (${nextWord}) is picked and appended.`,
      visual: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {words.map((w, i) => (
            <Box key={i} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 1, borderColor: wordColors[i], bgcolor: `${wordColors[i]}22`, fontFamily: "monospace", fontWeight: "bold", color: wordColors[i], fontSize: "0.85rem" }}>
              {w}
            </Box>
          ))}
          <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5, border: 2, borderColor: "#34d399", bgcolor: "rgba(52, 211, 153, 0.2)", fontFamily: "monospace", fontWeight: "bold", color: "#34d399", fontSize: "0.85rem" }}>
            {nextWord}
          </Box>
          <Typography variant="body2" sx={{ color: "success.main", fontWeight: "bold", fontSize: "1.2rem" }}>
            ✨
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Paper
      component={motion.div}
      variants={item}
      sx={{
        p: 3,
        bg: theme.palette.mode === "dark" ? "linear-gradient(90deg, rgba(30,58,138,0.15) 0%, rgba(17,24,39,0.3) 100%)" : "linear-gradient(90deg, rgba(0,113,227,0.05) 0%, rgba(255,255,255,0.4) 100%)",
        border: 1,
        borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {locale === "tr" ? "🔄 Bir Cümlenin Model İçindeki Yolculuğu" : "🔄 A Sentence's Journey"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {locale === "tr" ? `Örnek: "${sentence}"` : `Example: "${sentence}"`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {activeStep > 0 && (
            <Button variant="text" size="small" onClick={reset} sx={{ px: 1.5, minWidth: 60 }}>
              {locale === "tr" ? "🔄 Başa Dön" : "🔄 Reset"}
            </Button>
          )}
          {activeStep < 5 ? (
            <Button variant="contained" size="small" onClick={next} sx={{ px: 2, minWidth: 100 }}>
              {locale === "tr" ? `▶ Adım ${activeStep + 1}` : `▶ Step ${activeStep + 1}`}
            </Button>
          ) : (
            <Button variant="outlined" size="small" onClick={reset} sx={{ px: 2, minWidth: 100 }}>
              {locale === "tr" ? "🔄 Baştan Başlat" : "🔄 Replay"}
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {stages.map((stage, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          const colors = stageColors[i % stageColors.length];
          return (
            <Box
              key={i}
              component={motion.div}
              initial={false}
              animate={{ opacity: isPast ? 0.5 : 1, scale: isActive ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveStep(i)}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: isActive ? colors.border : (isPast ? "grey.800" : "grey.750"),
                bgcolor: isActive ? colors.bg : "transparent",
                cursor: "pointer",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: isActive ? colors.text : (isPast ? "grey.700" : "grey.800"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: isActive ? "#000" : (isPast ? "#fff" : "grey.500"), fontWeight: "bold", flexShrink: 0, transition: "all 0.3s" }}>
                  {i + 1}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: isActive ? "bold" : "normal", color: isActive ? colors.text : (isPast ? "grey.400" : "grey.500"), fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {stage.label}
                  </Typography>
                  {isActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5, lineHeight: 1.4 }}>
                        {stage.desc}
                      </Typography>
                      {stage.visual}
                    </motion.div>
                  )}
                </Box>
                {isPast && (
                  <Typography variant="body2" sx={{ color: "success.main", fontWeight: "bold" }}>
                    ✓
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 2, textAlign: "center", fontStyle: "italic" }}>
        {locale === "tr"
          ? "Her seferinde bir sonraki kelime tahmin edilir ve cümle uzar. Bu döngü milyonlarca kez tekrarlanır!"
          : "Each step predicts the next word. The sentence grows one word at a time."}
      </Typography>
    </Paper>
  );
}

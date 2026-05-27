"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Slider, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function softmax(values: number[]): number[] {
  const maxVal = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const labelsEn = ["cat", "dog", "fish", "car", "mat"];
const labelsTr = ["kedi", "köpek", "balık", "araba", "minder"];

export default function Softmax({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [rawValues, setRawValues] = useState([2.0, 1.0, 0.1, -1.0, 3.5]);
  const probs = softmax(rawValues);

  const labels = locale === "tr" ? labelsTr : labelsEn;

  const updateValue = (idx: number, val: number) => {
    const newVals = [...rawValues];
    newVals[idx] = val;
    setRawValues(newVals);
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
              {t("sm.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("sm.desc.0") }} 
            />
          </Box>

          {/* Example sentence context */}
          <Paper
            component={motion.div}
            variants={item}
            elevation={0}
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
              {locale === "tr" ? "Model hangi kelimeyi tahmin ediyor?" : "What word is the model predicting?"}
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: "monospace", mt: 1, color: "text.primary" }}>
              {locale === "tr"
                ? <>&quot;Kedi halının üzerine <Box component="span" sx={{ color: "warning.main", bgcolor: "rgba(251,191,36,0.1)", px: 1, borderRadius: 1 }}>___</Box>&quot;</>
                : <>&quot;The cat sat on the <Box component="span" sx={{ color: "warning.main", bgcolor: "rgba(251,191,36,0.1)", px: 1, borderRadius: 1 }}>___</Box>&quot;</>}
            </Typography>
          </Paper>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: "stretch" }}>
              {/* LEFT: Raw Scores */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2, display: "block", fontWeight: "bold" }}>
                  {locale === "tr" ? "🔴 Ham Puanlar (Logits)" : "🔴 Raw Scores (Logits)"}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey.500", mb: 2, display: "block", fontSize: "0.65rem" }}>
                  {locale === "tr" ? "Sürgüleri kaydırarak her kelimenin puanını değiştir" : "Drag the sliders to change each word's score"}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {rawValues.map((val, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Typography variant="body2" sx={{ width: 56, fontFamily: "monospace", color: "text.secondary", fontSize: "0.8rem" }}>
                        {labels[i]}
                      </Typography>
                      <Slider
                        min={-5}
                        max={5}
                        step={0.1}
                        value={val}
                        onChange={(_, newVal) => updateValue(i, newVal as number)}
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="body2" sx={{ width: 36, fontFamily: "monospace", color: "text.primary", textAlign: "right", fontSize: "0.8rem" }}>
                        {val > 0 ? "+" : ""}{val.toFixed(1)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Arrow in the middle */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 1 }}>
                <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="h4" sx={{ color: "primary.main" }}>→</Typography>
                  <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: "rgba(0,113,227,0.1)", border: 1, borderColor: "rgba(0,113,227,0.3)" }}>
                    <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontSize: "0.6rem", whiteSpace: "nowrap" }}>
                      Softmax
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: "primary.main" }}>→</Typography>
                </Box>
              </Box>

              {/* RIGHT: Probabilities */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2, display: "block", fontWeight: "bold" }}>
                  {locale === "tr" ? "🟢 Olasılıklar (%)" : "🟢 Probabilities (%)"}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey.500", mb: 2, display: "block", fontSize: "0.65rem" }}>
                  {locale === "tr" ? "Softmax yüksek puanları daha da baskın yapar" : "Softmax makes high scores dominate"}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {probs.map((p, i) => {
                    const isWinner = p === Math.max(...probs);
                    const barPercent = p * 100;
                    return (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography variant="body2" sx={{ width: 56, fontFamily: "monospace", color: "text.secondary", fontSize: "0.8rem" }}>
                          {labels[i]}
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 22, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.200", borderRadius: 1.5, overflow: "hidden" }}>
                          <Box
                            component={motion.div}
                            animate={{ width: `${barPercent}%` }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            sx={{
                              height: "100%",
                              borderRadius: 1.5,
                              bgcolor: isWinner ? "success.main" : "grey.500",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              px: 1,
                              minWidth: barPercent > 5 ? 0 : 0,
                            }}
                          >
                            {barPercent > 15 && (
                              <Typography variant="caption" sx={{ color: isWinner ? "#000" : "#fff", fontWeight: "bold", fontSize: "0.65rem" }}>
                                {barPercent.toFixed(0)}%
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        {isWinner && (
                          <Typography variant="body2" sx={{ color: "success.main", fontSize: "0.9rem" }}>
                            🏆
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 2, display: "block", fontFamily: "monospace", fontSize: "0.65rem", textAlign: "center" }}>
                  {t("sm.sum")}{" "}
                  <Box component="span" sx={{ color: "success.main", fontWeight: "bold" }}>
                    %{(probs.reduce((a, b) => a + b, 0) * 100).toFixed(1)}
                  </Box>{" "}
                  {t("sm.always")}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("sm.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("sm.desc.1") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("sm.example")}
            </Typography>
            <Box 
              sx={{ 
                bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", 
                p: 3, 
                borderRadius: 2, 
                fontFamily: "monospace", 
                display: "flex", 
                flexDirection: "column", 
                gap: 1,
                fontSize: "0.9rem",
                overflowX: "auto"
              }}
            >
              <Box>{t("sm.raw")} [2.0, 1.0, 3.5]</Box>
              <Box>{t("sm.evalues")} [e^2.0, e^1.0, e^3.5] ≈ [7.39, 2.72, 33.12]</Box>
              <Box>{t("sm.sumval")} 7.39 + 2.72 + 33.12 = 43.23</Box>
              <Box sx={{ color: "#60a5fa" }}>{t("sm.probs")} [7.39/43.23, 2.72/43.23, 33.12/43.23] ≈ [17.1%, 6.3%, 76.6%]</Box>
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("sm.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("sm.desc.2") }} 
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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("sm.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Box sx={{ mb: 2, p: 2, border: 1, borderColor: "rgba(0,113,227,0.3)", borderRadius: 2, bgcolor: "rgba(0,113,227,0.05)" }}>
                    <Typography sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>📐 The Formula:</Typography>
                    <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light" }}>
                      softmax(xᵢ) = e^xᵢ / Σ(e^xⱼ)
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, fontSize: "0.875rem" }}>
                      For each value: take e^value, then divide by the sum of all e^values. This turns any set of numbers into percentages that add up to 100%.
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    In hardware acceleration, directly calculating the softmax function can cause numeric overflow or underflow because <code>e^x</code> grows exponentially. To prevent this, standard libraries implement <strong>Safe Softmax</strong> by subtracting the maximum value from all inputs:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"Softmax(x_i) = \\frac{e^{x_i - \\max(x)}}{ \\sum_j e^{x_j - \\max(x)} }"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Mathematically, the output is unchanged since subtracting a constant from exponents scales both numerator and denominator by the exact same factor:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.8rem" }}>
                    {"\\frac{e^{x_i - c}}{\\sum e^{x_j - c}} = \\frac{e^{x_i} e^{-c}}{\\sum e^{x_j} e^{-c}} = \\frac{e^{x_i}}{\\sum e^{x_j}}"}
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Logit scaling with Temperature:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Temperature scaling divide logits by <code>T</code> before applying softmax. As <code>T \to 0</code>, the probability distribution converges to a one-hot vector (deterministic greedy argmax selection). As <code>T \to \infty</code>, the distribution approaches a uniform probability, where all tokens are equally likely.
                  </Typography>
                </>
              }
              contentTr={
                <>
                  <Box sx={{ mb: 2, p: 2, border: 1, borderColor: "rgba(0,113,227,0.3)", borderRadius: 2, bgcolor: "rgba(0,113,227,0.05)" }}>
                    <Typography sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>📐 Matematiksel Formülü:</Typography>
                    <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light" }}>
                      softmax(xᵢ) = e^xᵢ / Σ(e^xⱼ)
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, fontSize: "0.875rem" }}>
                      Her sayının e^sayı değerini hesapla, sonra her birini tüm sayıların toplamına böl. Bu işlem herhangi bir sayı kümesini %100'e tamamlanan olasılıklara dönüştürür.
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Donanım hızlandırıcılarında (GPU/TPU), <code>e^x</code> üstel olarak büyüdüğü için doğrudan softmax hesaplaması yapmak sayısal taşmaya (overflow) veya sıfırlanmaya (underflow) sebep olur. Bunu önlemek için kütüphaneler tüm girdilerden maksimum değeri çıkararak <strong>Güvenli Softmax (Safe Softmax)</strong> formülünü uygular:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"Softmax(x_i) = \\frac{e^{x_i - \\max(x)}}{ \\sum_j e^{x_j - \\max(x)} }"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Üstel ifadelerden sabit bir sayı çıkarılması hem payı hem de paydayı aynı oranda ölçeklediği için matematiksel olarak sonuç değişmez:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.8rem" }}>
                    {"\\frac{e^{x_i - c}}{\\sum e^{x_j - c}} = \\frac{e^{x_i} e^{-c}}{\\sum e^{x_j} e^{-c}} = \\frac{e^{x_i}}{\\sum e^{x_j}}"}
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Sıcaklık (Temperature) ile Ölçekleme:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Sıcaklık katsayısı, softmax işlemine girmeden önce ham skorları (logits) <code>T</code> değerine böler. <code>T \to 0</code> durumunda olasılık dağılımı tek bir kazanan kelimeye (argmax) çöker. <code>T \to \infty</code> durumunda ise dağılım tüm kelimelerin eşit şansa sahip olduğu homojen bir yapıya (uniform distribution) yaklaşır.
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

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

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("sm.interactive")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {rawValues.map((val, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" sx={{ width: 56, fontFamily: "monospace", color: "text.secondary" }}>
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
                  <Typography variant="body2" sx={{ width: 40, fontFamily: "monospace", color: "text.primary", textAlign: "right" }}>
                    {val.toFixed(1)}
                  </Typography>
                  <Box sx={{ width: 140, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component={motion.div}
                      sx={{
                        height: 20,
                        bgcolor: "primary.main",
                        borderRadius: 1,
                      }}
                      animate={{ width: `${probs[i] * 90}px` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <Typography variant="caption" sx={{ color: "primary.light", fontFamily: "monospace", fontWeight: "bold", whiteSpace: "nowrap" }}>
                      {(probs[i] * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography variant="caption" sx={{ color: "text.secondary", mt: 3, display: "block", fontFamily: "monospace" }}>
              {t("sm.sum")}{" "}
              <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>
                {probs.reduce((a, b) => a + b, 0).toFixed(4)}
              </Box>{" "}
              {t("sm.always")}
            </Typography>
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

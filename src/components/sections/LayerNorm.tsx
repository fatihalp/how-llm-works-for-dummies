"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Slider, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function calculateLayerNorm(values: number[]): { mean: number; variance: number; normalized: number[] } {
  const n = values.length;
  if (n === 0) return { mean: 0, variance: 0, normalized: [] };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  const eps = 0.00001;
  const normalized = values.map((v) => (v - mean) / Math.sqrt(variance + eps));
  return { mean, variance, normalized };
}

export default function LayerNorm({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [values, setValues] = useState([2.5, -1.0, 4.0, 0.5]);
  const { mean, variance, normalized } = calculateLayerNorm(values);

  const updateValue = (idx: number, val: number) => {
    const nextVals = [...values];
    nextVals[idx] = val;
    setValues(nextVals);
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
              {t("ln.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("ln.desc.0") }} 
            />
          </Box>

          <Paper 
            component={motion.div} 
            variants={item}
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.1)" : "rgba(0, 113, 227, 0.05)", 
              border: 1, 
              borderColor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.2)" : "rgba(0, 113, 227, 0.1)",
              display: "flex", 
              flexDirection: "column", 
              gap: 1.5
            }}
          >
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
              🎓 {t("ln.analogy")}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {t("ln.analogy.desc")}
            </Typography>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("ln.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("ln.desc.1") }} 
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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("ln.insight") }} />
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("ln.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("ln.desc.2") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {locale === "tr" ? "Etkileşimli Dengeleme: Ham Değerleri Ayarla" : "Interactive Normalization: Adjust Raw Values"}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {values.map((val, i) => (
                <Box key={i} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" sx={{ width: 64, fontFamily: "monospace", color: "text.secondary" }}>
                    Val {i + 1}
                  </Typography>
                  <Slider
                    min={-5}
                    max={5}
                    step={0.1}
                    value={val}
                    onChange={(_, newVal) => updateValue(i, newVal as number)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Box sx={{ display: "flex", gap: 3, width: 180, flexShrink: 0, fontFamily: "monospace", justifyContent: "end" }}>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      Raw: {val.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "primary.main", fontWeight: "bold" }}>
                      Norm: {normalized[i].toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Visual Bar Chart Comparisons */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, mt: 2 }}>
              <Paper variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 3 }}>
                  {t("ln.raw")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "end", justifyContent: "center", gap: 2, height: 112, pt: 1, width: "100%" }}>
                  {values.map((v, i) => {
                    const height = Math.min(100, Math.max(0, ((v + 5) / 10) * 100));
                    return (
                      <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, width: 48 }}>
                        <Box
                          sx={{
                            width: 32,
                            borderRadius: "4px 4px 0 0",
                            bgcolor: theme.palette.mode === "dark" ? "grey.700" : "grey.400",
                            height: `${height}%`,
                            minHeight: 4,
                            transition: "all 0.15s"
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem", fontFamily: "monospace" }}>
                          {v.toFixed(1)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 3 }}>
                  {t("ln.normalized")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "end", justifyContent: "center", gap: 2, height: 112, pt: 1, width: "100%" }}>
                  {normalized.map((v, i) => {
                    const height = Math.min(100, Math.max(0, ((v + 2.5) / 5) * 100));
                    return (
                      <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, width: 48 }}>
                        <Box
                          sx={{
                            width: 32,
                            borderRadius: "4px 4px 0 0",
                            bgcolor: "primary.main",
                            height: `${height}%`,
                            minHeight: 4,
                            transition: "all 0.15s"
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontSize: "0.75rem", fontFamily: "monospace" }}>
                          {v.toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, fontFamily: "monospace", fontSize: "0.85rem", color: "text.secondary" }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {locale === "tr" ? "Ortalama:" : "Calculated Mean (μ):"}{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>{mean.toFixed(3)}</Box>
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {locale === "tr" ? "Varyans:" : "Variance (σ²):"}{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>{variance.toFixed(3)}</Box>
              </Typography>
            </Box>
          </Paper>

          {/* Senior Developer Mode */}
          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    In deep neural networks, Layer Normalization (LayerNorm) is applied across the channel/feature dimensions to stabilize the distribution of activations during training.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Standard LayerNorm Formulation:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Given a vector <code>x \in \mathbb&#123;R&#125;^d</code> representing the feature activations of a single token:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"y = LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    where <code>\mu</code> and <code>\sigma^2</code> are the mean and variance computed over the feature dimensions of the single token:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.8rem" }}>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.light" }}>{"μ = (1/d) * Σ x_i"}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light" }}>{"σ² = (1/d) * Σ (x_i - μ)²"}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    <code>\gamma</code> (gain) and <code>\beta</code> (bias) are learnable parameters initialized to 1 and 0 respectively, which allow the network to restore representation capacity if necessary.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>RMSNorm Optimization:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Modern models (LLaMA, Gemma) replace standard LayerNorm with <strong>RMSNorm</strong>. It drops the mean subtraction step entirely, only rescaling by the Root Mean Square of the activations:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    This reduces computational complexity (no mean tracking or extra subtractions) and yields identical downstream task performance, speeding up GPU execution by 10-50% in the normalization kernels.
                  </Typography>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Derin yapay sinir ağlarında Katman Normalizasyonu (LayerNorm), eğitim boyunca aktivasyonların dağılımını sabitlemek için özellik/kanal boyutları boyunca uygulanır.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Standart LayerNorm Formülü:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Tek bir token&apos;a ait özellikleri temsil eden bir <code>x \in \mathbb&#123;R&#125;^d</code> vektörü için:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"y = LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Burada <code>\mu</code> ve <code>\sigma^2</code>, tek bir token&apos;ın kendi özellikleri üzerinden hesaplanan ortalaması ve varyansıdır:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.8rem" }}>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.light" }}>{"μ = (1/d) * Σ x_i"}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: "monospace", color: "primary.light" }}>{"σ² = (1/d) * Σ (x_i - μ)²"}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    <code>\gamma</code> (gain / ölçek) ve <code>\beta</code> (bias / kayma) sırasıyla 1 ve 0 ile başlayan öğrenilebilir parametrelerdir. Ağın gerekirse temsil gücünü geri kazanmasını sağlarlar.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>RMSNorm Optimizasyonu:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    LLaMA ve Gemma gibi modern modeller standart LayerNorm yerine <strong>RMSNorm</strong> kullanır. RMSNorm, ortalama çıkarma adımını tamamen atlar ve girdiyi sadece karekök ortalama değeriyle (Root Mean Square) böler:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Bu basitleştirme, hesaplama maliyetini düşürür (ortalama hesaplamaya ve çıkarma işlemlerine gerek kalmaz) ve benzer model performansı sağlarken GPU normalizasyon çekirdeklerinin %10 ila %50 daha hızlı çalışmasını sağlar.
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

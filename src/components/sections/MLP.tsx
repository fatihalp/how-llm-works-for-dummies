"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function relu(x: number) { return Math.max(0, x); }
function gelu(x: number) { return x * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x))); }

export default function MLP({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [inputVal, setInputVal] = useState(0.5);
  const range = Array.from({ length: 40 }, (_, i) => (i - 20) / 5);

  const Arrow = ({ delay = 0 }: { delay?: number }) => (
    <Box component={motion.div} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} sx={{ color: "text.secondary", fontSize: "1.5rem", textAlign: "center" }}>
      ↓
    </Box>
  );

  const Capsule = ({ children, color, borderColor, bgcolor, delay = 0 }: { children: React.ReactNode; color: string; borderColor: string; bgcolor: string; delay?: number }) => (
    <Box component={motion.div} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring" }} sx={{ px: 2.5, py: 1.5, borderRadius: 3, bgcolor, border: 1, borderColor }}>
      <Typography variant="body2" sx={{ color, fontWeight: "bold", textAlign: "center", whiteSpace: "nowrap", fontSize: "0.85rem" }}>
        {children}
      </Typography>
    </Box>
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
              {t("mlp.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("mlp.desc.0") }}
            />
          </Box>

          {/* Visual Flow: Capsule style */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("mlp.structure")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              {/* Step 1: Input */}
              <Capsule color="#60a5fa" borderColor="rgba(33, 150, 243, 0.4)" bgcolor="rgba(33, 150, 243, 0.08)" delay={0.1}>
                📥 {locale === "tr" ? "Giriş (768 sayı)" : "Input (768 numbers)"}
              </Capsule>

              <Arrow delay={0.2} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", mt: -1 }}>
                {locale === "tr" ? "W₁ ile çarp → 4 kat büyüt" : "× W₁ → expand 4×"}
              </Typography>

              {/* Step 2: Hidden expanded */}
              <Capsule color="#34d399" borderColor="rgba(76, 175, 80, 0.4)" bgcolor="rgba(76, 175, 80, 0.08)" delay={0.3}>
                🔍 {locale === "tr" ? "Detaylı İnceleme (3072 sayı)" : "Detailed Look (3072 numbers)"}
              </Capsule>

              {/* Visual: small dots showing some dimmed */}
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", justifyContent: "center" }}>
                {[...Array(20)].map((_, i) => (
                  <Box key={i} sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: i < 14 ? "#34d399" : "grey.700", opacity: i < 14 ? 0.7 : 0.3 }} />
                ))}
              </Box>

              <Arrow delay={0.45} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", mt: -1 }}>
                {locale === "tr" ? "GELU süzgeci → önemsizleri temizle" : "GELU filter → remove noise"}
              </Typography>

              {/* Step 3: After filter */}
              <Capsule color="#fbbf24" borderColor="rgba(255, 235, 59, 0.4)" bgcolor="rgba(255, 235, 59, 0.08)" delay={0.5}>
                🧹 {locale === "tr" ? "Süzgeçten Geçmiş" : "After Filtering"}
              </Capsule>

              {/* Visual: fewer dots, more intense */}
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} sx={{ display: "flex", gap: 0.8, flexWrap: "wrap", justifyContent: "center" }}>
                {[...Array(20)].map((_, i) => (
                  <Box key={i} sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: i < 8 ? "#fbbf24" : "grey.700", opacity: i < 8 ? 0.9 : 0.2 }} />
                ))}
              </Box>

              <Arrow delay={0.6} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic", mt: -1 }}>
                {locale === "tr" ? "W₂ ile çarp → eski boyuta dön" : "× W₂ → compress back"}
              </Typography>

              {/* Step 4: Output */}
              <Capsule color="#60a5fa" borderColor="rgba(33, 150, 243, 0.4)" bgcolor="rgba(33, 150, 243, 0.08)" delay={0.7}>
                📤 {locale === "tr" ? "Çıktı (768 sayı, anlamlı)" : "Output (768 numbers, meaningful)"}
              </Capsule>
            </Box>
          </Paper>

          {/* Summary card */}
          <Paper component={motion.div} variants={item} elevation={0} sx={{ p: 2.5, bgcolor: theme.palette.mode === "dark" ? "rgba(76, 175, 80, 0.08)" : "rgba(76, 175, 80, 0.04)", border: 1, borderColor: theme.palette.mode === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem", lineHeight: 1.7 }}>
              {locale === "tr"
                ? "💡 Özet: Gelen bilgi önce 4 kata çıkarılır (daha detaylı bakmak için), sonra GELU süzgecinden geçer (önemsiz kısımlar atılır), en son eski boyutuna sıkıştırılıp çıktı olarak gönderilir."
                : "💡 Summary: Input expands 4× (to examine details), passes through GELU filter (removes noise), then compresses back to original size and sent as output."}
            </Typography>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("mlp.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("mlp.desc.1") }}
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("mlp.gelu.title")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", mb: 3 }}>
              {t("mlp.gelu.desc")}
            </Typography>

            {/* Visual filter analogy */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[0.8, -0.3, 0.6, 0.9, -0.5, 0.4].map((v, i) => (
                  <Box key={i} sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: v > 0 ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "0.7rem", color: v > 0 ? "#34d399" : "#f44336", border: 1, borderColor: v > 0 ? "rgba(76, 175, 80, 0.4)" : "rgba(244, 67, 54, 0.3)" }}>
                    {v > 0 ? `+${v}` : v}
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold" }}>→</Typography>
              <Box sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: "rgba(0, 113, 227, 0.1)", border: 1, borderColor: "rgba(0, 113, 227, 0.3)" }}>
                <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontSize: "0.7rem" }}>
                  {locale === "tr" ? "GELU Süzgeci" : "GELU Filter"}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold" }}>→</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[0.78, 0.05, 0.55, 0.88, 0.02, 0.35].map((v, i) => (
                  <Box key={i} sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: v > 0.1 ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "0.65rem", color: v > 0.1 ? "#34d399" : "grey.600", border: 1, borderColor: v > 0.1 ? "rgba(76, 175, 80, 0.4)" : "grey.700" }}>
                    {v.toFixed(2)}
                  </Box>
                ))}
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "center", mb: 2 }}>
              {locale === "tr"
                ? "Sola: ham sayılar. Sağa: GELU'dan geçmiş hali. Negatif sayılar neredeyse sıfırlandı!"
                : "Left: raw values. Right: after GELU. Negative values are nearly zeroed out!"}
            </Typography>

            <Box sx={{ position: "relative", height: 180, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, overflow: "hidden", p: 2, border: 1, borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300" }}>
              <Box sx={{ position: "absolute", inset: 16, borderLeft: 1, borderBottom: 1, borderColor: "grey.700" }} />
              <svg style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)", position: "absolute", left: 16, top: 16 }} viewBox="0 0 200 100" preserveAspectRatio="none">
                <polyline
                  points={range.map((x, i) => {
                    const px = (i / (range.length - 1)) * 200;
                    const py = 100 - ((gelu(x) + 2) / 5) * 100;
                    return `${px},${py}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#0071e3"
                  strokeWidth="2.5"
                />
                <polyline
                  points={range.map((x, i) => {
                    const px = (i / (range.length - 1)) * 200;
                    const py = 100 - ((relu(x) + 2) / 5) * 100;
                    return `${px},${py}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              </svg>
              <Box sx={{ position: "absolute", bottom: 8, right: 16, display: "flex", gap: 3, fontSize: "0.75rem", fontFamily: "monospace" }}>
                <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontFamily: "monospace" }}>— GELU</Typography>
                <Typography variant="caption" sx={{ color: "success.light", fontWeight: "bold", fontFamily: "monospace" }}>--- ReLU</Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("mlp.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("mlp.desc.2") }}
            />
          </Box>

          {/* Animated pipeline flow */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
              {[
                { label: locale === "tr" ? "📥 Giriş" : "📥 Input", color: "#60a5fa" },
                { label: "📈 4×", color: "#34d399" },
                { label: "🧹 GELU", color: "#fbbf24" },
                { label: "📉 ¼×", color: "#f97316" },
                { label: locale === "tr" ? "📤 Çıktı" : "📤 Output", color: "#60a5fa" },
              ].map((step, i) => (
                <Box key={i} component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ px: 2, py: 1.5, borderRadius: 2, bgcolor: `${step.color}15`, border: 1, borderColor: `${step.color}40` }}>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold", color: step.color, fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {step.label}
                    </Typography>
                  </Box>
                  {i < 4 && <Typography variant="body2" sx={{ color: "text.secondary" }}>→</Typography>}
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: "monospace", textAlign: "center" }}>
                {locale === "tr"
                  ? "MLP(x) = W₂ · GELU(W₁ · x + b₁) + b₂     ←     Sadece 3 işlem!"
                  : "MLP(x) = W₂ · GELU(W₁ · x + b₁) + b₂     ←     Only 3 operations!"}
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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("mlp.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    In the classical Transformer block, the Feed-Forward Network (FFN) consists of two linear transformations with a non-linear activation function in between:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"FFN_GELU(x) = GELU(x · W₁ + b₁) · W₂ + b₂"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    where <code>W_1 \in \mathbb&#123;R&#125;^&#123;d_&#123;model&#125; \times d_&#123;ff&#125;&#125;</code> (typically <code>d_&#123;ff&#125; = 4 \cdot d_&#123;model&#125;</code>) and <code>W_2 \in \mathbb&#123;R&#125;^&#123;d_&#123;ff&#125; \times d_&#123;model&#125;&#125;</code>.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>The Shift to SwiGLU Gated Activations:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Modern state-of-the-art LLMs (like LLaMA-2/3, Mistral, Gemma, PaLM) discard GELU in favor of <strong>SwiGLU</strong> (Swish Gated Linear Unit). A Gated Linear Unit (GLU) is a neural network layer defined as the component-wise product of two linear transformations, one of which is gated by a sigmoid or other activation.
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    For SwiGLU, the Swish activation (specifically <strong>SiLU</strong>, where <code>\text&#123;SiLU&#125;(x) = x \cdot \sigma(x)</code>) is used as the gate:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"SwiGLU(x) = ( SiLU(x · W_gate) ⊗ (x · W_up) ) · W_down"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>where:</Typography>
                  <Box component="ul" sx={{ listStyle: "disc", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><code>W_&#123;\text&#123;gate&#125;&#125;</code> and <code>W_&#123;\text&#123;up&#125;&#125;</code> project the hidden vector into <code>d_&#123;ff&#125;</code> dimensions.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><code>\otimes</code> represents the element-wise (Hadamard) product.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><code>W_&#123;\text&#123;down&#125;&#125;</code> projects the gating output back down to <code>d_&#123;model&#125;</code>.</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Because SwiGLU introduces an additional projection matrix, to maintain the same number of parameters, the FFN hidden dimension is typically scaled down to approximately <code>\frac&#123;8&#125;&#123;3&#125; d_&#123;model&#125;</code> rather than <code>4 d_&#123;model&#125;</code>. SwiGLU provides significantly better empirical results in convergence speed and downstream task loss.
                  </Typography>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Klasik Transformer bloğunda, Beslemeli Ağ (Feed-Forward Network - FFN / MLP), aralarında doğrusal olmayan bir aktivasyon fonksiyonu barındıran iki adet doğrusal katmandan oluşur:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"FFN_GELU(x) = GELU(x · W₁ + b₁) · W₂ + b₂"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Burada <code>W_1 \in \mathbb&#123;R&#125;^&#123;d_&#123;model&#125; \times d_&#123;ff&#125;&#125;</code> (genellikle <code>d_&#123;ff&#125; = 4 \cdot d_&#123;model&#125;</code>) ve <code>W_2 \in \mathbb&#123;R&#125;^&#123;d_&#123;ff&#125; \times d_&#123;model&#125;&#125;</code> boyutlarındadır.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Gelişmiş SwiGLU Kapılı Aktivasyonlarına Geçiş:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Modern son teknoloji LLM&apos;ler (örn. LLaMA-2/3, Mistral, Gemma, PaLM), GELU yerine <strong>SwiGLU</strong> (Swish Gated Linear Unit) kapı mekanizmasını tercih ederler. Gated Linear Unit (GLU), girdinin iki ayrı doğrusal yansıtma matrisi ile çarpılıp, birinin aktivasyon fonksiyonundan (kapı) geçirilerek diğeriyle eleman bazında çarpılmasıdır.
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    SwiGLU formülasyonunda, kapı olarak Swish (yani <strong>SiLU</strong>, burada <code>\text&#123;SiLU&#125;(x) = x \cdot \sigma(x)</code>) kullanılır:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"SwiGLU(x) = ( SiLU(x · W_gate) ⊗ (x · W_up) ) · W_down"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>Burada:</Typography>
                  <Box component="ul" sx={{ listStyle: "disc", listStylePosition: "inside", pl: 2, display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><code>W_&#123;\text&#123;gate&#125;&#125;</code> ve <code>W_&#123;\text&#123;up&#125;&#125;</code> girdiyi <code>d_&#123;ff&#125;</code> boyutuna çıkarır.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><code>\otimes</code> Hadamard (eleman bazında) çarpımını temsil eder.</Typography>
                    <Typography component="li" variant="body2" sx={{ color: "text.secondary" }}><code>W_&#123;\text&#123;down&#125;&#125;</code> elde edilen vektörü tekrar ana model boyutu olan <code>d_&#123;model&#125;</code> seviyesine düşürür.</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    SwiGLU fazladan bir parametre matrisi (up projection) getirdiği için, parametre bütçesini sabit tutmak adına ara katman boyutu genellikle <code>4 d_&#123;model&#125;</code> yerine <code>\frac&#123;8&#125;&#123;3&#125; d_&#123;model&#125;</code> civarında tutulur. SwiGLU, karmaşık ilişkileri öğrenmede ve eğitim kaybını düşürmede klasik GELU&apos;ya göre çok daha yüksek başarı sağlamaktadır.
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

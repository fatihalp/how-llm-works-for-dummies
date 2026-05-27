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

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 4, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("mlp.structure")}
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3.5 }}>
              {/* Input layer */}
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} sx={{ display: "flex", gap: 1.5 }}>
                {[...Array(6)].map((_, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: "50%", 
                      bgcolor: "rgba(33, 150, 243, 0.15)", 
                      border: 1, 
                      borderColor: "rgba(33, 150, 243, 0.4)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.65rem", 
                      color: "primary.light",
                      fontFamily: "monospace"
                    }}
                  >
                    x{i+1}
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{t("mlp.input")}</Typography>

              <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace", fontStyle: "italic" }}>
                {t("mlp.multiply1")}
              </Typography>

              {/* Hidden layer (expanded) */}
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} sx={{ display: "flex", gap: 1 }}>
                {[...Array(12)].map((_, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: "50%", 
                      bgcolor: "rgba(76, 175, 80, 0.15)", 
                      border: 1, 
                      borderColor: "rgba(76, 175, 80, 0.4)" 
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{t("mlp.hidden")}</Typography>

              <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace", fontStyle: "italic" }}>
                {t("mlp.activation")}
              </Typography>

              {/* Hidden after activation */}
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} sx={{ display: "flex", gap: 1 }}>
                {[...Array(12)].map((_, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: "50%", 
                      border: 1, 
                      borderColor: i % 3 === 0 ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.6)",
                      bgcolor: i % 3 === 0 ? "rgba(76, 175, 80, 0.05)" : "rgba(76, 175, 80, 0.3)"
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{t("mlp.afteract")}</Typography>

              <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace", fontStyle: "italic" }}>
                {t("mlp.multiply2")}
              </Typography>

              {/* Output layer */}
              <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} sx={{ display: "flex", gap: 1.5 }}>
                {[...Array(6)].map((_, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: "50%", 
                      bgcolor: "rgba(33, 150, 243, 0.15)", 
                      border: 1, 
                      borderColor: "rgba(33, 150, 243, 0.4)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.65rem", 
                      color: "primary.light",
                      fontFamily: "monospace"
                    }}
                  >
                    y{i+1}
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{t("mlp.output")}</Typography>
            </Box>
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

            <Box sx={{ position: "relative", height: 180, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, overflow: "hidden", p: 2, border: 1, borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300" }}>
              {/* Axes */}
              <Box sx={{ position: "absolute", inset: 16, borderLeft: 1, borderBottom: 1, borderColor: "grey.700" }} />
              {/* GELU curve */}
              <svg className="absolute inset-4" style={{ width: "calc(100% - 32px)", height: "calc(100% - 32px)", position: "absolute", left: 16, top: 16 }} viewBox="0 0 200 100" preserveAspectRatio="none">
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

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("mlp.formula.title")}
            </Typography>
            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 3, borderRadius: 2, fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="h6" sx={{ color: "primary.main", fontFamily: "monospace", fontWeight: "bold" }}>
                MLP(x) = W₂ · GELU(W₁ · x + b₁) + b₂
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {t("mlp.formula.desc")}
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
                  <p>
                    In the classical Transformer block, the Feed-Forward Network (FFN) consists of two linear transformations with a non-linear activation function in between:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"FFN_GELU(x) = GELU(x · W₁ + b₁) · W₂ + b₂"}
                  </Box>
                  <p className="mt-2 text-slate-300">
                    where <code>W_1 \in \mathbb&#123;R&#125;^&#123;d_&#123;model&#125; \times d_&#123;ff&#125;&#125;</code> (typically <code>d_&#123;ff&#125; = 4 \cdot d_&#123;model&#125;</code>) and <code>W_2 \in \mathbb&#123;R&#125;^&#123;d_&#123;ff&#125; \times d_&#123;model&#125;&#125;</code>.
                  </p>
                  <p className="mt-2 font-semibold">The Shift to SwiGLU Gated Activations:</p>
                  <p className="text-slate-300 font-sans">
                    Modern state-of-the-art LLMs (like LLaMA-2/3, Mistral, Gemma, PaLM) discard GELU in favor of <strong>SwiGLU</strong> (Swish Gated Linear Unit). A Gated Linear Unit (GLU) is a neural network layer defined as the component-wise product of two linear transformations, one of which is gated by a sigmoid or other activation.
                  </p>
                  <p className="mt-2 text-slate-300 font-sans">
                    For SwiGLU, the Swish activation (specifically <strong>SiLU</strong>, where <code>\text&#123;SiLU&#125;(x) = x \cdot \sigma(x)</code>) is used as the gate:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"SwiGLU(x) = ( SiLU(x · W_gate) ⊗ (x · W_up) ) · W_down"}
                  </Box>
                  <p className="mt-2 text-slate-300">
                    where:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300 font-sans">
                    <li><code>W_&#123;\text&#123;gate&#125;&#125;</code> and <code>W_&#123;\text&#123;up&#125;&#125;</code> project the hidden vector into <code>d_&#123;ff&#125;</code> dimensions.</li>
                    <li><code>\otimes</code> represents the element-wise (Hadamard) product.</li>
                    <li><code>W_&#123;\text&#123;down&#125;&#125;</code> projects the gating output back down to <code>d_&#123;model&#125;</code>.</li>
                  </ul>
                  <p className="mt-2 text-slate-300 font-sans">
                    Because SwiGLU introduces an additional projection matrix, to maintain the same number of parameters, the FFN hidden dimension is typically scaled down to approximately <code>\frac&#123;8&#125;&#123;3&#125; d_&#123;model&#125;</code> rather than <code>4 d_&#123;model&#125;</code>. SwiGLU provides significantly better empirical results in convergence speed and downstream task loss.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    Klasik Transformer bloğunda, Beslemeli Ağ (Feed-Forward Network - FFN / MLP), aralarında doğrusal olmayan bir aktivasyon fonksiyonu barındıran iki adet doğrusal katmandan oluşur:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"FFN_GELU(x) = GELU(x · W₁ + b₁) · W₂ + b₂"}
                  </Box>
                  <p className="mt-2 text-slate-300">
                    Burada <code>W_1 \in \mathbb&#123;R&#125;^&#123;d_&#123;model&#125; \times d_&#123;ff&#125;&#125;</code> (genellikle <code>d_&#123;ff&#125; = 4 \cdot d_&#123;model&#125;</code>) ve <code>W_2 \in \mathbb&#123;R&#125;^&#123;d_&#123;ff&#125; \times d_&#123;model&#125;&#125;</code> boyutlarındadır.
                  </p>
                  <p className="mt-2 font-semibold">Gelişmiş SwiGLU Kapılı Aktivasyonlarına Geçiş:</p>
                  <p className="text-slate-300 font-sans">
                    Modern son teknoloji LLM&apos;ler (örn. LLaMA-2/3, Mistral, Gemma, PaLM), GELU yerine <strong>SwiGLU</strong> (Swish Gated Linear Unit) kapı mekanizmasını tercih ederler. Gated Linear Unit (GLU), girdinin iki ayrı doğrusal yansıtma matrisi ile çarpılıp, birinin aktivasyon fonksiyonundan (kapı) geçirilerek diğeriyle eleman bazında çarpılmasıdır.
                  </p>
                  <p className="mt-2 text-slate-300 font-sans">
                    SwiGLU formülasyonunda, kapı olarak Swish (yani <strong>SiLU</strong>, burada <code>\text&#123;SiLU&#125;(x) = x \cdot \sigma(x)</code>) kullanılır:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"SwiGLU(x) = ( SiLU(x · W_gate) ⊗ (x · W_up) ) · W_down"}
                  </Box>
                  <p className="mt-2 text-slate-300">
                    Burada:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300 font-sans">
                    <li><code>W_&#123;\text&#123;gate&#125;&#125;</code> ve <code>W_&#123;\text&#123;up&#125;&#125;</code> girdiyi <code>d_&#123;ff&#125;</code> boyutuna çıkarır.</li>
                    <li><code>\otimes</code> Hadamard (eleman bazında) çarpımını temsil eder.</li>
                    <li><code>W_&#123;\text&#123;down&#125;&#125;</code> elde edilen vektörü tekrar ana model boyutu olan <code>d_&#123;model&#125;</code> seviyesine düşürür.</li>
                  </ul>
                  <p className="mt-2 text-slate-300 font-sans">
                    SwiGLU fazladan bir parametre matrisi (up projection) getirdiği için, parametre bütçesini sabit tutmak adına ara katman boyutu genellikle <code>4 d_&#123;model&#125;</code> yerine <code>\frac&#123;8&#125;&#123;3&#125; d_&#123;model&#125;</code> civarında tutulur. SwiGLU, karmaşık ilişkileri öğrenmede ve eğitim kaybını düşürmede klasik GELU&apos;ya göre çok daha yüksek başarı sağlamaktadır.
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

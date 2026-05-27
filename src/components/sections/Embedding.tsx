"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Button, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const words = ["king", "queen", "man", "woman", "cat"];
const embeddings: Record<string, number[]> = {
  king:  [0.9, 0.1, 0.8, 0.7, -0.2, 0.5, 0.3, -0.1],
  queen: [0.85, 0.9, 0.75, 0.6, -0.15, 0.55, 0.35, -0.05],
  man:   [0.7, 0.05, 0.6, 0.5, -0.3, 0.4, 0.2, -0.2],
  woman: [0.65, 0.85, 0.55, 0.45, -0.25, 0.45, 0.25, -0.15],
  cat:   [-0.3, 0.1, -0.5, 0.2, 0.8, -0.4, 0.6, 0.7],
};

function getBarColor(value: number) {
  if (value > 0.5) return "#4caf50";
  if (value > 0) return "#2e7d32";
  if (value > -0.5) return "#c62828";
  return "#e53935";
}

const wordTranslations: Record<string, Record<string, string>> = {
  tr: { king: "kral", queen: "kraliçe", man: "erkek", woman: "kadın", cat: "kedi" },
  en: { king: "king", queen: "queen", man: "man", woman: "woman", cat: "cat" },
};

export default function Embedding({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [selected, setSelected] = useState("king");
  const vec = embeddings[selected];
  
  const displayWord = (w: string) => {
    return wordTranslations[locale]?.[w] || w;
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
              {t("embed.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("embed.desc.0") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("embed.select")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 4 }}>
              {words.map((w) => (
                <Button
                  key={w}
                  variant={selected === w ? "contained" : "outlined"}
                  onClick={() => setSelected(w)}
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                    px: 3,
                    py: 1,
                    boxShadow: selected === w ? "0 4px 12px rgba(0,113,227,0.2)" : "none",
                  }}
                >
                  {displayWord(w)}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary", fontSize: "0.95rem" }}>
                embedding[&quot;{displayWord(selected)}&quot;] = [{vec.map(v => v.toFixed(2)).join(", ")}]
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "end", gap: 1.5, height: 160, pt: 2 }}>
                {vec.map((v, i) => (
                  <Box
                    key={i}
                    component={motion.div}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "end",
                      height: "100%",
                      transformOrigin: "bottom"
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: "4px 4px 0 0",
                        bgcolor: getBarColor(v),
                        height: `${Math.abs(v) * 100}%`,
                        minHeight: 4,
                        transition: "all 0.2s"
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, fontFamily: "monospace" }}>
                      {v.toFixed(1)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", mt: 2, display: "block" }}>
                {t("embed.dims")}
              </Typography>
            </Box>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("embed.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("embed.desc.1") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("embed.relationships")}
            </Typography>
            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 3, borderRadius: 2, fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography component={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} sx={{ color: "#34d399", fontSize: "1.1rem", fontFamily: "monospace" }}>
                {t("embed.formula")}
              </Typography>
              <Typography component={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} sx={{ color: "#60a5fa", fontSize: "1.1rem", fontFamily: "monospace" }}>
                {t("embed.similar")}
              </Typography>
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("embed.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("embed.desc.2") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Box sx={{ position: "relative", height: 240, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, overflow: "hidden", border: 1, borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.300" }}>
              {Object.entries(embeddings).map(([word, vec], i) => {
                const x = ((vec[0] + 0.5) / 1.5) * 80 + 10;
                const y = ((vec[1] + 0.5) / 1.5) * 80 + 10;
                return (
                  <Box
                    key={word}
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    sx={{
                      position: "absolute",
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 14, 
                        height: 14, 
                        borderRadius: "50%", 
                        bgcolor: selected === word ? "primary.main" : "primary.light", 
                        ring: selected === word ? 3 : 0, 
                        ringColor: "primary.light",
                        boxShadow: selected === word ? "0 0 10px #0071e3" : "none",
                        transition: "all 0.2s" 
                      }} 
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, color: "text.primary", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                      {displayWord(word)}
                    </Typography>
                  </Box>
                );
              })}

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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("embed.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    In production, an embedding layer is represented by a parameter matrix <code>W_e</code> of shape <code>(V, d_model)</code>. The lookup is computationally optimized as a slice selection (equivalent to multiplying a one-hot vector representation of the token ID with the embedding weight matrix):
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"x_t = Embedding(t_t) = W_e[t_t, :]"}
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Position Embeddings:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Since Transformer&apos;s self-attention has no inherent sense of token order (permutation invariance), positional information must be injected. Modern architectures (like LLaMA-2/3, Mistral, Gemma) discard original additive sinusoidal position embeddings in favor of <strong>Rotary Position Embeddings (RoPE)</strong>.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>How RoPE Works:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Instead of adding a position vector to the token embedding, RoPE applies a rotation to the Query (Q) and Key (K) vectors in 2D planes. For a query vector <code>q</code> at position <code>m</code>:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"R_{Θ, m}^d q = diag(R_1, R_2, ..., R_{d/2}) q"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    where each <code>R_i</code> is a 2D rotation matrix rotating the <code>2i</code> and <code>2i+1</code> dimensions of the vector by angle <code>m \theta_i</code>. This preserves relative distances because the inner product of queries and keys depends only on their relative distance <code>m - n</code>.
                  </Typography>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Gelişmiş uygulamalarda gömme (embedding) katmanı, <code>(V, d_model)</code> boyutlarında bir parametre matrisi olan <code>W_e</code> ile temsil edilir. Gömme arama (lookup) işlemi, bilgisayarda doğrudan bir indeks erişimi (dilim seçimi) şeklinde yapılır:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"x_t = Embedding(t_t) = W_e[t_t, :]"}
                  </Box>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Pozisyon Kodlama (Position Embeddings):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Transformer&apos;ın öz-dikkat mekanizması yer değiştirme altında değişmez (permutation-invariant) olduğundan, kelimelerin sırasını modele bildirmek için konumsal bilgilerin eklenmesi gerekir. Modern mimariler (LLaMA-2/3, Mistral, Gemma gibi), eklemeli sinüzoidal pozisyon vektörleri yerine <strong>Döner Konumsal Gömme (Rotary Position Embeddings - RoPE)</strong> kullanır.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>RoPE Nasıl Çalışır?</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    RoPE, pozisyon vektörlerini doğrudan gömme vektörüne eklemek yerine, dikkat katmanındaki Sorgu (Q) ve Anahtar (K) vektörlerini iki boyutlu düzlemlerde döndürür. <code>m</code>. pozisyondaki bir <code>q</code> sorgu vektörü için rotasyon şu şekildedir:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"R_{Θ, m}^d q = diag(R_1, R_2, ..., R_{d/2}) q"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Burada her <code>R_i</code>, vektörün ilgili boyutlarını <code>m \theta_i</code> açısıyla döndüren 2B bir rotasyon matrisidir. Bu sayede sorgu ve anahtar vektörlerinin iç çarpımı, sadece kelimelerin birbirine olan bağıl mesafesine (<code>m - n</code>) bağlı hale gelir.
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

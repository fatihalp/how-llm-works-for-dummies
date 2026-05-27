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

export default function SelfAttention({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [showQKV, setShowQKV] = useState(false);

  const sentence = locale === "tr" ? sentenceTr : sentenceEn;
  const attentionWeights = locale === "tr" ? attentionWeightsTr : attentionWeightsEn;

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
                
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, alignItems: "end", height: 112, pt: 1 }}>
                  {sentence.map((word, i) => {
                    const weight = attentionWeights[hoveredWord]?.[i] || 0;
                    return (
                      <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, width: 64 }}>
                        <Box
                          sx={{
                            width: "100%",
                            borderRadius: "4px 4px 0 0",
                            bgcolor: "primary.main",
                            height: `${weight * 80}px`,
                            opacity: 0.3 + weight * 2,
                            transition: "all 0.2s"
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                          {word}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "primary.light", fontWeight: "bold", fontSize: "0.7rem", fontFamily: "monospace" }}>
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

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "between", mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
                {t("attn.qkv")}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowQKV(!showQKV)}
              >
                {showQKV ? t("attn.hide") : t("attn.show")}
              </Button>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2.5, mb: 3 }}>
              {[
                { name: t("attn.q"), desc: t("attn.q.desc"), borderColor: "rgba(33, 150, 243, 0.4)", bgcolor: "rgba(33, 150, 243, 0.05)", textColor: "#60a5fa" },
                { name: t("attn.k"), desc: t("attn.k.desc"), borderColor: "rgba(76, 175, 80, 0.4)", bgcolor: "rgba(76, 175, 80, 0.05)", textColor: "#34d399" },
                { name: t("attn.v"), desc: t("attn.v.desc"), borderColor: "rgba(255, 235, 59, 0.4)", bgcolor: "rgba(255, 235, 59, 0.05)", textColor: "#fbbf24" },
              ].map((qkv, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  sx={{
                    border: 1,
                    borderColor: qkv.borderColor,
                    bgcolor: qkv.bgcolor,
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: "bold", color: qkv.textColor }}>
                    {qkv.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                    {qkv.desc}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Collapse in={showQKV}>
              <Box 
                sx={{ 
                  bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", 
                  borderRadius: 2, 
                  p: 3, 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 1.5,
                  fontSize: "0.95rem"
                }}
              >
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step1") }} />
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step2") }} />
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step3") }} />
                <Typography variant="body2" sx={{ color: "text.primary" }} dangerouslySetInnerHTML={{ __html: t("attn.step4") }} />
                <Box sx={{ mt: 2, fontFamily: "monospace", fontSize: "0.85rem", color: "primary.light", bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.200", p: 2, borderRadius: 1.5 }}>
                  Attention(Q, K, V) = softmax(Q · K<sup>T</sup> / √d<sub>k</sub>) · V
                </Box>
              </Box>
            </Collapse>
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

          {/* Projection Explanation Embedded Card */}
          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
              🔀 {locale === "tr" ? "Çok Başlı Dikkat ve Yansıtma (Projection)" : "Multi-Head Attention & Projection"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7 }}>
              {locale === "tr" 
                ? "Yapay zeka sadece tek bir odaklanma noktası kullanmaz. Tıpkı bir cümlenin hem öznesini, hem yüklemini hem de sıfatını aynı anda incelemek gibi, sistem birden fazla 'dikkat başı' (attention head) çalıştırır. Her bir baş cümlenin farklı bir yönüne odaklanır. Son aşamada ise, tüm bu dikkat başlarından çıkan çıktılar uç uca birleştirilir ve doğrusal bir yansıtma matrisi (W_O) ile çarpılarak tek bir sonuca dönüştürülür."
                : "The AI doesn't just focus on one thing at a time. It uses multiple 'attention heads' in parallel, each focusing on a different aspect (e.g., syntax, tense, subject-verb relations). In the end, all attention outputs are concatenated and multiplied by a linear projection weight matrix (W_O) to map them back to the model's core dimension."}
            </Typography>
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
                  <p>
                    In Decoder-only models (e.g., GPT, LLaMA), self-attention is <strong>causal</strong>. The attention mechanism is prohibited from attending to future tokens. This is achieved by adding a causal mask matrix <code>M</code> where elements above the diagonal are set to <code>-\infty</code> before applying Softmax:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"Attention(Q, K, V) = Softmax( (Q · Kᵀ / √d_k) + M ) · V"}
                  </Box>
                  <p className="mt-2 font-sans text-slate-300">
                    where <code>M_&#123;i, j&#125; = 0</code> if <code>j \le i</code>, and <code>M_&#123;i, j&#125; = -\infty</code> if <code>j &gt; i</code>. The scaling factor <code>\sqrt&#123;d_k&#125;</code> prevents the dot products from growing too large in magnitude, which would push the softmax function into regions with extremely small gradients.
                  </p>
                  <p className="mt-2 font-semibold">Multi-Head Attention (MHA) & Projection:</p>
                  <p className="text-slate-300 font-sans">
                    To capture different types of contextual dependencies, we run <code>h</code> attention heads in parallel and concatenate their outputs before projecting:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · Wᴼ"}
                  </Box>
                  <p className="mt-2 font-sans text-slate-300">
                    where <code>W^O \in \mathbb&#123;R&#125;^&#123;h \cdot d_v \times d_&#123;model&#125;&#125;</code> mixes the information learned by different attention heads.
                  </p>
                  <p className="mt-2 font-semibold">Real-world Optimizations:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Grouped-Query Attention (GQA):</strong> Modern architectures (like LLaMA-3) share key/value projections across groups of query heads (e.g., 8 query heads per 1 KV head) to reduce memory bandwidth bottleneck in caching KV tensors during inference.</li>
                    <li><strong>FlashAttention:</strong> Rather than constructing the intermediate <code>N \times N</code> attention matrix in slow GPU High-Bandwidth Memory (HBM), FlashAttention computes attention block-by-block on GPU SRAM using online softmax and tiling, achieving 2x to 4x speedups.</li>
                  </ul>
                </>
              }
              contentTr={
                <>
                  <p>
                    Sadece Dekoder içeren modellerde (örn. GPT, LLaMA), öz-dikkat mekanizması <strong>nedenseldir (causal)</strong>. Yani bir kelimenin kendisinden sonraki kelimelere bakması maskelenerek engellenir. Bu, Softmax işleminden önce üst üçgen matris elemanlarının <code>-\infty</code> ile çarpılmasıyla (maske matrisi <code>M</code> eklenmesiyle) sağlanır:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"Attention(Q, K, V) = Softmax( (Q · Kᵀ / √d_k) + M ) · V"}
                  </Box>
                  <p className="mt-2 font-sans text-slate-300">
                    Burada <code>j &gt; i</code> ise <code>M_&#123;i, j&#125; = -\infty</code>, aksi halde <code>0</code>&apos;dır. <code>\sqrt&#123;d_k&#125;</code> ölçekleme faktörü, matris çarpımının büyümesini engeller; aksi halde softmax gradyanları sıfırlanıp sönümlenirdi (gradient vanishing).
                  </p>
                  <p className="mt-2 font-semibold">Çok Başlı Dikkat (Multi-Head Attention) ve Yansıtma:</p>
                  <p className="text-slate-300 font-sans">
                    Farklı konumsal ve anlamsal ilişkileri yakalamak için <code>h</code> tane dikkat kafası paralel çalıştırılır, çıktılar birleştirilir ve yansıtılır:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · Wᴼ"}
                  </Box>
                  <p className="mt-2 font-sans text-slate-300">
                    Burada <code>W^O \in \mathbb&#123;R&#125;^&#123;h \cdot d_v \times d_&#123;model&#125;&#125;</code> matrisi, tüm dikkat kafalarından gelen bilgileri harmanlayarak modelin ana boyutuna geri indirger.
                  </p>
                  <p className="mt-2 font-semibold">Gerçek Hayattaki Optimizasyonlar:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Grouped-Query Attention (GQA):</strong> LLaMA-3 gibi modern modeller, çıkarım (inference) sırasında KV-cache belleğinin darboğaz oluşturmasını engellemek için Key ve Value kafalarını gruplayarak paylaşır (örn. 8 Query kafasına 1 KV kafası).</li>
                    <li><strong>FlashAttention:</strong> <code>N \times N</code> boyutundaki devasa dikkat matrisini GPU ana belleğine (HBM) yazmak yerine, tiling ve çevrimiçi softmax teknikleriyle doğrudan GPU SRAM (hızlı bellek) üzerinde blok blok hesaplayarak 2 ila 4 kat hız kazandırır.</li>
                  </ul>
                </>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

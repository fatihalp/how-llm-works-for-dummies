"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, Slider, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function TransformerBlock({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [numLayers, setNumLayers] = useState(12);

  const layers = [
    { id: "ln1", label: t("nav.layernorm"), borderColor: "rgba(255, 235, 59, 0.4)", bgcolor: "rgba(255, 235, 59, 0.05)", textColor: "#fdeb3b" },
    { id: "attn", label: t("nav.attention"), borderColor: "rgba(33, 150, 243, 0.4)", bgcolor: "rgba(33, 150, 243, 0.05)", textColor: "#60a5fa" },
    { id: "res1", label: locale === "tr" ? "+ Artık Bağlantı" : "+ Residual", borderColor: "rgba(76, 175, 80, 0.4)", bgcolor: "rgba(76, 175, 80, 0.05)", textColor: "#34d399" },
    { id: "ln2", label: t("nav.layernorm"), borderColor: "rgba(255, 235, 59, 0.4)", bgcolor: "rgba(255, 235, 59, 0.05)", textColor: "#fdeb3b" },
    { id: "mlp", label: t("nav.mlp"), borderColor: "rgba(33, 150, 243, 0.4)", bgcolor: "rgba(33, 150, 243, 0.05)", textColor: "#60a5fa" },
    { id: "res2", label: locale === "tr" ? "+ Artık Bağlantı" : "+ Residual", borderColor: "rgba(76, 175, 80, 0.4)", bgcolor: "rgba(76, 175, 80, 0.05)", textColor: "#34d399" },
  ];

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
              {t("tf.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("tf.desc.0") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 4, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("tf.inside")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              {/* Input */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  color: "text.primary",
                  fontFamily: "monospace"
                }}
              >
                {t("tf.input")}
              </Box>
              <Box sx={{ width: 1, height: 16, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.400", alignSelf: "center", justifySelf: "center" }} style={{ width: 1 }} />

              {/* Layers */}
              {layers.map((layer, i) => (
                <Box key={layer.id + i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onMouseEnter={() => setActiveLayer(i)}
                    onMouseLeave={() => setActiveLayer(null)}
                    sx={{
                      px: 4,
                      py: 1.25,
                      borderRadius: 2,
                      border: 1,
                      borderColor: layer.borderColor,
                      bgcolor: layer.bgcolor,
                      color: theme.palette.mode === "dark" ? layer.textColor : "text.primary",
                      fontSize: "1rem",
                      fontWeight: "medium",
                      cursor: "pointer",
                      boxShadow: activeLayer === i ? `0 0 12px ${layer.textColor}` : "none",
                      transform: activeLayer === i ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.2s"
                    }}
                  >
                    {layer.label}
                  </Box>
                  {i < layers.length - 1 && <Box sx={{ width: 1, height: 12, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.400" }} style={{ width: 1 }} />}
                  {(layer.id === "res1" || layer.id === "res2") && (
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      sx={{
                        position: "absolute",
                        left: -80,
                        top: 10,
                        fontSize: "0.65rem",
                        color: "success.light",
                        fontStyle: "italic",
                        fontFamily: "monospace"
                      }}
                    >
                      {t("tf.skip")}
                    </Box>
                  )}
                </Box>
              ))}

              <Box sx={{ width: 1, height: 16, bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.400" }} style={{ width: 1 }} />
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  color: "text.primary",
                  fontFamily: "monospace"
                }}
              >
                {t("tf.output")}
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("tf.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("tf.desc.1") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
              ⚖️ {locale === "tr" ? "Normalizasyon (Dengeleme) Neden Şart?" : "Why Normalization is Critical?"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
              {locale === "tr"
                ? "Milyarlarca sayı katmanlar arasında çarpıla çarpıla ilerlerken sayılar çığ gibi büyüyebilir (Sonsuz - Infinity) ya da tamamen eriyip yok olabilir (Sıfır). Normalizasyon, her işlem öncesi sayıları yakalayıp ortalaması 0, standart sapması 1 olacak şekilde güvenli bir aralığa çeker. Bu işlem, modelin eğitimini dengede tutan görünmez bir emniyet kemeridir."
                : "As numbers flow through many layers, they undergo billions of multiplications. The outputs can explode (become Infinity) or vanish (become zero). Normalization steps in before attention and MLP layers to rescale the values, ensuring they stay within a stable numerical range."}
            </Typography>
            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light" }}>
              output = (x - mean) / sqrt(variance + ε)
            </Box>
          </Paper>

          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("tf.residual")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              {t("tf.residual.desc")}
            </Typography>
            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "success.light", display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>output = LayerNorm(x) → Attention → + x</Box>
              <Box>output = LayerNorm(x) → MLP → + x</Box>
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {t("tf.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("tf.desc.2") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "bold" }}>
              {t("tf.stacking")}
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                {t("tf.layers")}
              </Typography>
              <Slider
                min={2}
                max={96}
                value={numLayers}
                onChange={(_, val) => setNumLayers(val as number)}
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="subtitle2" sx={{ fontFamily: "monospace", width: 24, fontWeight: "bold" }}>
                {numLayers}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {Array.from({ length: numLayers }).map((_, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  sx={{
                    width: 28,
                    height: 36,
                    bg: theme.palette.mode === "dark" ? "linear-gradient(180deg, rgba(33,150,243,0.3) 0%, rgba(17,24,39,0.3) 100%)" : "linear-gradient(180deg, rgba(33,150,243,0.15) 0%, rgba(255,255,255,0.4) 100%)",
                    border: 1,
                    borderColor: "rgba(33, 150, 243, 0.25)",
                    borderRadius: 1,
                    fontSize: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    fontFamily: "monospace"
                  }}
                >
                  {i + 1}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, fontSize: "0.8rem", color: "text.secondary", fontFamily: "monospace" }}>
              <Typography variant="caption" sx={{ fontFamily: "monospace" }} dangerouslySetInnerHTML={{ __html: t("tf.models") }} />
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{t("tf.more")}</Typography>
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
            <Typography variant="body1" sx={{ color: "text.primary", fontSize: "1rem" }} dangerouslySetInnerHTML={{ __html: t("tf.insight") }} />
          </Paper>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    The standard Transformer formulation utilizes Layer Normalization (LayerNorm) and residual connections. The configuration of these blocks has changed in modern designs.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Post-LN vs Pre-LN:</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Original BERT/GPT models used <strong>Post-LN</strong>, where normalization is applied <em>after</em> the sub-layer addition:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"x_{l+1} = LayerNorm( x_l + SubLayer(x_l) )"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    This caused difficulty in training deep architectures because gradients near the input layer decayed exponentially. Modern architectures use <strong>Pre-LN</strong>:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"x_{l+1} = x_l + SubLayer( LayerNorm(x_l) )"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    This enables a direct identity path (the <em>residual stream</em>) for gradients to flow undisturbed back to the input layers, allowing stable training of models with hundreds of layers without warmup schedules.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>RMSNorm (Root Mean Square Normalization):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    To save GPU execution time, LLaMA-2/3 and Gemma replace traditional LayerNorm with <strong>RMSNorm</strong>. Standard LayerNorm requires computing both the mean and variance:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
                  </Box>
                </>
              }
              contentTr={
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Standart Transformer bloğunda Katman Normalizasyonu (LayerNorm) ve artık (residual) bağlantılar kullanılır. Ancak bu bileşenlerin dizilişi zamanla evrim geçirmiştir.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>Post-LN vs Pre-LN (Hizalama Farkı):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    İlk Transformer mimarilerinde norm işlemi alt katman işleminden <em>sonra</em> uygulanırdı (<strong>Post-LN</strong>):
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"x_{l+1} = LayerNorm( x_l + SubLayer(x_l) )"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Bu yöntem derin modellerin eğitilmesinde kararsızlıklara yol açıyordu çünkü gradyanlar geriye doğru giderken sönümleniyordu. Modern modeller (Llama, Gemma, GPT-4) <strong>Pre-LN</strong> kullanır:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"x_{l+1} = x_l + SubLayer( LayerNorm(x_l) )"}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", lineHeight: 1.6 }}>
                    Pre-LN sayesinde artık akış (<em>residual stream</em>) kesintisiz bir otoyol gibi çalışır. Gradyanlar ağın derinliklerinden ilk katmana kadar hiç bozulmadan akabilir.
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>RMSNorm (Karekök Ortalaması Normalizasyonu):</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    Hesaplama maliyetini düşürmek amacıyla LLaMA ve Gemma gibi modern modeller LayerNorm yerine <strong>RMSNorm</strong> kullanır. Standart LayerNorm hem ortalama (mean) hem de varyans hesaplamayı gerektirir:
                  </Typography>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
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

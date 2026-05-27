"use client";

import { useState, useEffect } from "react";
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
              <div>
                <span style={{ color: theme.palette.text.secondary }}>Giriş (Input): &quot;{locale === "tr" ? "Türkiye'nin başkenti" : "The capital of France is"}&quot;</span>
              </div>
              <div>
                <span style={{ color: theme.palette.text.secondary }}>Hedef (Target): </span>
                <span style={{ color: "#4caf50", fontWeight: "bold" }}>&quot;{locale === "tr" ? "Ankara" : "Paris"}&quot;</span>
              </div>
              <div>
                <span style={{ color: theme.palette.text.secondary }}>Tahmin (Predicted): </span>
                <span style={{ color: "#f44336", fontWeight: "bold" }}>&quot;{locale === "tr" ? "İstanbul" : "London"}&quot;</span>
                <span style={{ color: theme.palette.text.secondary }}> {locale === "tr" ? " → Yanlış! Ağırlıkları güncelle." : " → Wrong! Adjust weights."}</span>
              </div>
            </Box>
          </Paper>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {locale === "tr" ? "Büyük Veri İhtiyacı" : "Massive Data Requirements"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("train.desc.1") }} 
            />
          </Box>

          {/* Big Picture Pipeline */}
          <Paper 
            component={motion.div} 
            variants={item} 
            sx={{ 
              p: 3, 
              bg: theme.palette.mode === "dark" ? "linear-gradient(90deg, rgba(30,58,138,0.15) 0%, rgba(17,24,39,0.3) 100%)" : "linear-gradient(90deg, rgba(0,113,227,0.05) 0%, rgba(255,255,255,0.4) 100%)", 
              border: 1, 
              borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.300"
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: "bold" }}>
              {locale === "tr" ? "Transformer İşlem Akışı (Büyük Resim)" : "Transformer Pipeline (The Big Picture)"}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, fontSize: "0.75rem" }}>
              {[
                locale === "tr" ? "Metin Girişi" : "Input Text", "→", 
                locale === "tr" ? "Tokenize" : "Tokenize", "→", 
                locale === "tr" ? "Gömme (Embed)" : "Embed", "→",
                locale === "tr" ? "Dengeleme (Norm)" : "Norm", "→", 
                locale === "tr" ? "Öz-Dikkat (Attention)" : "Self-Attention", "→", 
                locale === "tr" ? "Yansıtma" : "Projection", "→", 
                locale === "tr" ? "Artık (Residual)" : "Residual", "→",
                locale === "tr" ? "Dengeleme (Norm)" : "Norm", "→", 
                locale === "tr" ? "MLP Katmanı" : "MLP", "→", 
                locale === "tr" ? "Artık (Residual)" : "Residual", "→",
                locale === "tr" ? "(×N Katman Tekrarı)" : "(×N layers)", "→", 
                locale === "tr" ? "Son Norm" : "Final Norm", "→", 
                locale === "tr" ? "Lineer + Softmax" : "Linear + Softmax", "→", 
                locale === "tr" ? "Sonraki Kelime" : "Next Token"
              ].map((s, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    fontFamily: "monospace",
                    fontWeight: s === "→" ? "bold" : "normal",
                    color: s === "→" ? "text.secondary" : "text.primary",
                    bgcolor: s === "→" ? "transparent" : (theme.palette.mode === "dark" ? "grey.900" : "grey.200"),
                    border: s === "→" ? "none" : 1,
                    borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300",
                    borderRadius: 1.5,
                    px: s === "→" ? 0.5 : 1.5,
                    py: s === "→" ? 0 : 0.75
                  }}
                >
                  {s}
                </Box>
              ))}
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

          {/* Loss animation */}
          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => { setEpoch(0); setLoss(4.5); setIsTraining(true); }}
                sx={{ px: 3 }}
              >
                {t("train.simulate")}
              </Button>
              <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                {t("train.epoch")} <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>{epoch}</Box> | {t("train.loss")} <Box component="span" sx={{ color: "primary.light", fontWeight: "bold" }}>{loss.toFixed(3)}</Box>
              </Typography>
            </Box>

            <Box sx={{ position: "relative", height: 160, bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", borderRadius: 2, overflow: "hidden", border: 1, borderColor: theme.palette.mode === "dark" ? "grey.850" : "grey.300" }}>
              <svg className="w-full h-full" style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0 }} viewBox="0 0 200 100" preserveAspectRatio="none">
                {lossHistory.length > 1 && (
                  <polyline
                    points={lossHistory.map((l, i) => {
                      const x = (i / 20) * 200;
                      const y = 100 - ((l - 0.2) / 4.5) * 90;
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke="#0071e3"
                    strokeWidth="2.5"
                  />
                )}
              </svg>
              <Typography variant="caption" sx={{ position: "absolute", top: 8, left: 8, color: "text.secondary", fontFamily: "monospace", fontSize: "0.7rem" }}>{t("train.lossup")}</Typography>
              <Typography variant="caption" sx={{ position: "absolute", bottom: 8, right: 8, color: "text.secondary", fontFamily: "monospace", fontSize: "0.7rem" }}>{t("train.steps")}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>{t("train.lossdesc")}</Typography>
          </Paper>

          {/* Senior Developer Mode */}
          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    Pre-training optimizes the model parameters <code>&theta;</code> by maximizing the likelihood of the training corpus. Mathematically, we minimize the cross-entropy loss function over sequence batches:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    L(\theta) = - \frac&#123;1&#125;&#123;N&#125; \sum_&#123;i=1&#125;^N \log P(x_i | x_&#123;&lt;i&#125;; &theta;)
                  </Box>
                  <p className="mt-2 font-semibold">Optimizer: AdamW</p>
                  <p className="text-slate-300 font-sans">
                    To update the parameters <code>&theta;</code>, we use the <strong>AdamW</strong> optimizer, which computes adaptive learning rates for individual parameters using estimates of the first (mean) and second (uncentered variance) moments of the gradients, with decoupled weight decay:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "left", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    <p>g_t = \nabla_\theta L(\theta_&#123;t-1&#125;)</p>
                    <p className="mt-1">m_t = \beta_1 m_&#123;t-1&#125; + (1-\beta_1) g_t \quad (\text&#123;First moment&#125;)</p>
                    <p className="mt-1">v_t = \beta_2 v_&#123;t-1&#125; + (1-\beta_2) g_t^2 \quad (\text&#123;Second moment&#125;)</p>
                    <p className="mt-1">\theta_t = \theta_&#123;t-1&#125; - \frac&#123;\alpha&#125;&#123;\sqrt&#123;v_t&#125; + \epsilon&#125; m_t - \lambda \theta_&#123;t-1&#125; \quad (\text&#123;Weight decay update&#125;)</p>
                  </Box>
                  <p className="mt-2 font-semibold">Training Phases:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Pre-training (Next Token Prediction):</strong> The model reads trillions of tokens from the web to learn grammar, syntax, facts, and reasoning patterns. Generates base model.</li>
                    <li><strong>Supervised Fine-Tuning (SFT):</strong> Tuned on high-quality demonstration conversations (queries and responses written by humans) to teach the model to act as a helpful chatbot.</li>
                    <li><strong>Alignment (RLHF/DPO):</strong> Uses **Reinforcement Learning from Human Feedback (RLHF)** via PPO or **Direct Preference Optimization (DPO)** to align model outputs with human preferences regarding truthfulness, safety, and utility.</li>
                  </ol>
                </>
              }
              contentTr={
                <>
                  <p>
                    Ön-eğitim (pre-training) aşamasında, model parametreleri <code>&theta;</code>, veri kümesindeki kelimelerin olasılığını en üst düzeye çıkaracak şekilde eğitilir. Matematiksel olarak çapraz entropi (cross-entropy) kaybı minimize edilir:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    L(\theta) = - \frac&#123;1&#125;&#123;N&#125; \sum_&#123;i=1&#125;^N \log P(x_i | x_&#123;&lt;i&#125;; &theta;)
                  </Box>
                  <p className="mt-2 font-semibold">Optimizasyon Algoritması: AdamW</p>
                  <p className="text-slate-300 font-sans">
                    Parametrelerin <code>&theta;</code> güncellenmesinde **AdamW** optimizasyon algoritması kullanılır. Bu algoritma, gradyanların birinci (ortalama) ve ikinci (varyans) momentlerini hesaplayarak parametre bazlı adaptif öğrenme adımları belirlerken, ağırlık sönümlemeyi (weight decay) decoupled olarak uygular:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "left", color: "primary.light", my: 2, overflowX: "auto", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    <p>g_t = \nabla_\theta L(\theta_&#123;t-1&#125;)</p>
                    <p className="mt-1">m_t = \beta_1 m_&#123;t-1&#125; + (1-\beta_1) g_t \quad (\text&#123;Birinci moment - ivme&#125;)</p>
                    <p className="mt-1">v_t = \beta_2 v_&#123;t-1&#125; + (1-\beta_2) g_t^2 \quad (\text&#123;İkinci moment - varyans&#125;)</p>
                    <p className="mt-1">\theta_t = \theta_&#123;t-1&#125; - \frac&#123;\alpha&#125;&#123;\sqrt&#123;v_t&#125; + \epsilon&#125; m_t - \lambda \theta_&#123;t-1&#125; \quad (\text&#123;Ağırlık sönümleme güncellemesi&#125;)</p>
                  </Box>
                  <p className="mt-2 font-semibold">Model Eğitim Aşamaları:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300 font-sans">
                    <li><strong>Ön-Eğitim (Pre-training):</strong> Trilyonlarca web verisi üzerinde bir sonraki token tahmini yaptırılır. Model dilin yapısını, genel kültür bilgilerini ve mantık kurallarını öğrenir (Taban Model oluşur).</li>
                    <li><strong>Denetimli İnce Ayar (Supervised Fine-Tuning - SFT):</strong> Modelin bir asistan gibi davranmasını sağlamak için, insan eliyle yazılmış soru-cevap veri setleri üzerinde ince ayar yapılır.</li>
                    <li><strong>İnsan Tercihleri ile Hizalama (RLHF/DPO):</strong> Modelin zararlı içerikler üretmesini önlemek, daha doğru ve faydalı olmasını sağlamak için **İnsan Geri Bildirimiyle Pekiştirmeli Öğrenme (RLHF)** veya **Direct Preference Optimization (DPO)** uygulanır.</li>
                  </ol>
                </>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
}

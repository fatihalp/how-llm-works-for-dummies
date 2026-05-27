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

          {/* Loss animation */}
          <Paper component={motion.div} variants={item} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {locale === "tr"
                  ? "Gerçek eğitimde model milyarlarca cümle okur. Her cümlede bir sonraki kelimeyi tahmin etmeye çalışır, yanlış yaparsa ağırlıklarını günceller."
                  : "During real training, the model reads billions of sentences. For each sentence, it predicts the next word; if wrong, it updates its weights."}
              </Typography>
              <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.950" : "grey.100", p: 1.5, borderRadius: 1.5, fontFamily: "monospace", fontSize: "0.8rem", color: "text.secondary", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <span>{locale === "tr" ? "📖 Veri: Milyarlarca cümle" : "📖 Data: Billions of sentences"}</span>
                <span>⚙️ {locale === "tr" ? "Parametre: 1 Milyar+" : "Params: 1B+"}</span>
                <span>🎯 {locale === "tr" ? "Amaç: Hata Payını Sıfırlamak" : "Goal: Minimize Loss"}</span>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => { setEpoch(0); setLoss(4.5); setIsTraining(true); }}
                sx={{ px: 3 }}
              >
                {t("train.simulate")}
              </Button>
              <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                {t("train.epoch")} <Box component="span" sx={{ color: "text.primary", fontWeight: "bold" }}>{epoch}</Box> / 20
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: loss > 2 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399") }} />
                <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                  {t("train.loss")} <Box component="span" sx={{ color: "primary.light", fontWeight: "bold" }}>{loss.toFixed(3)}</Box>
                </Typography>
              </Box>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, bgcolor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.08)" : "rgba(0, 113, 227, 0.04)", borderRadius: 2, border: 1, borderColor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.2)" : "rgba(0, 113, 227, 0.1)" }}>
              <Typography variant="h5" sx={{ lineHeight: 1 }}>
                {loss > 3 ? "🔴" : (loss > 1 ? "🟡" : "🟢")}
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: loss > 3 ? "#f87171" : (loss > 1 ? "#fbbf24" : "#34d399") }}>
                  {loss > 3
                    ? (locale === "tr" ? "Model henüz çok karışık, çoğu tahmini yanlış" : "Model is very confused, most predictions are wrong")
                    : (loss > 1
                      ? (locale === "tr" ? "Model öğreniyor, hata payı düşüyor" : "Model is learning, loss is decreasing")
                      : (locale === "tr" ? "Model iyi öğrendi! Tahminler giderek doğrulaşıyor" : "Model learned well! Predictions are getting accurate"))}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {t("train.lossdesc")}
                </Typography>
              </Box>
            </Box>
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

function PipelineAnimation({ locale, theme }: { locale: string; theme: any }) {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const sentence = locale === "tr" ? "Kedi" : "The";
  const fullSentence = {
    tr: ["Kedi", "halının", "üzerine", "oturdu"],
    en: ["The", "cat", "sat"],
  };
  const words = locale === "tr" ? fullSentence.tr : fullSentence.en;

  const stages = [
    { label: locale === "tr" ? "📝 Giriş Metni" : "📝 Input Text", desc: locale === "tr" ? `"${words.join(" ")}" cümlesi girilir.` : `Sentence "${words.join(" ")}" enters the model.` },
    { label: locale === "tr" ? "🔢 Tokenize Et" : "🔢 Tokenize", desc: locale === "tr" ? "Cümle küçük parçalara (token) ayrılır ve her birine bir sayı (ID) verilir." : "Sentence is split into tokens, each assigned a number (ID)." },
    { label: locale === "tr" ? "📊 Vektöre Çevir (Embedding)" : "📊 Embedding", desc: locale === "tr" ? "Her token ID, anlamını taşıyan bir sayı listesine (vektör) dönüştürülür." : "Each token ID is converted into a meaning-carrying vector." },
    { label: locale === "tr" ? "🧠 Transformer Blokları (×N)" : "🧠 Transformer Blocks (×N)", desc: locale === "tr" ? "Vektörler sırayla Dengeleme → Attention → MLP adımlarından geçer. Her blok kelimeler arası bağlamı ve anlamı derinleştirir." : "Vectors flow through Norm → Attention → MLP repeatedly. Each block deepens context and meaning." },
    { label: locale === "tr" ? "🎯 Karar Verme (Softmax)" : "🎯 Decision (Softmax)", desc: locale === "tr" ? "Son bloğun çıktısı Softmax'e girer. Tüm kelimelere birer olasılık yüzdesi atanır." : "Last block output enters Softmax. Every possible word gets a probability percentage." },
    { label: locale === "tr" ? "✨ Sonraki Kelimeyi Seç" : "✨ Pick Next Word", desc: locale === "tr" ? "En yüksek olasılıklı kelime seçilir, cümlenin sonuna eklenir ve döngü başa döner!" : "Highest-probability word is picked, appended to the sentence, and the loop repeats!" },
  ];

  const isPlayingRef = playing;

  useEffect(() => {
    if (playing && activeStep < stages.length) {
      const timer = setTimeout(() => {
        if (activeStep < stages.length - 1) {
          setActiveStep(activeStep + 1);
        } else {
          setPlaying(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [playing, activeStep, stages.length]);

  const toggle = useCallback(() => {
    if (activeStep >= stages.length - 1) {
      setActiveStep(0);
    }
    setPlaying(p => !p);
  }, [activeStep, stages.length]);

  const stageColors = [
    { border: "rgba(76, 175, 80, 0.4)", bg: "rgba(76, 175, 80, 0.1)", text: "#34d399" },
    { border: "rgba(33, 150, 243, 0.4)", bg: "rgba(33, 150, 243, 0.1)", text: "#60a5fa" },
    { border: "rgba(255, 235, 59, 0.4)", bg: "rgba(255, 235, 59, 0.1)", text: "#fdeb3b" },
    { border: "rgba(156, 39, 176, 0.4)", bg: "rgba(156, 39, 176, 0.1)", text: "#c084fc" },
    { border: "rgba(255, 152, 0, 0.4)", bg: "rgba(255, 152, 0, 0.1)", text: "#fb923c" },
    { border: "rgba(76, 175, 80, 0.4)", bg: "rgba(76, 175, 80, 0.1)", text: "#34d399" },
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
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {locale === "tr" ? "🔄 Bir Cümlenin Model İçindeki Yolculuğu" : "🔄 A Sentence's Journey Through the Model"}
        </Typography>
        <Button
          variant={playing ? "outlined" : "contained"}
          size="small"
          onClick={toggle}
          sx={{ px: 2, minWidth: 100 }}
        >
          {playing
            ? (locale === "tr" ? "⏸ Durdur" : "⏸ Pause")
            : (activeStep >= stages.length - 1
              ? (locale === "tr" ? "🔄 Baştan Başlat" : "🔄 Replay")
              : (locale === "tr" ? "▶ Başlat" : "▶ Play"))}
        </Button>
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
              animate={{
                opacity: isPast ? 0.6 : 1,
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: isActive ? colors.border : (isPast ? "grey.800" : "grey.750"),
                bgcolor: isActive ? colors.bg : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: isActive ? colors.text : (isPast ? "grey.700" : "grey.800"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: isActive ? "#000" : (isPast ? "#fff" : "grey.500"),
                  fontWeight: "bold",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {i + 1}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? colors.text : (isPast ? "grey.400" : "grey.500"),
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {stage.label}
                </Typography>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block", mt: 0.5, lineHeight: 1.4 }}
                    >
                      {stage.desc}
                    </Typography>
                  </motion.div>
                )}
              </Box>
              {isActive && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ color: colors.text, fontSize: "1.2rem" }}
                >
                  ●
                </motion.div>
              )}
              {isPast && (
                <Typography variant="body2" sx={{ color: "success.main", fontWeight: "bold" }}>
                  ✓
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 2, textAlign: "center", fontStyle: "italic" }}>
        {locale === "tr"
          ? "Her seferinde bir sonraki kelime tahmin edilir ve cümle uzar. Bu döngü milyonlarca kez tekrarlanır!"
          : "Each step predicts the next word. The sentence grows one word at a time. This loops millions of times during training!"}
      </Typography>
    </Paper>
  );
}

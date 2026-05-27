"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Box, Typography, Paper, useTheme } from "@mui/material";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Overview({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const theme = useTheme();

  const examples = locale === "tr" ? [
    { input: "Bir varmış, bir", output: "yokmuş", color: "#4caf50" },
    { input: "Türkiye'nin başkenti", output: "Ankara'dır", color: "#2196f3" },
    { input: "Kedi halının üzerine", output: "oturdu", color: "#ffeb3b" },
  ] : [
    { input: "The cat sat on the", output: "mat", color: "#4caf50" },
    { input: "Once upon a", output: "time", color: "#2196f3" },
    { input: "The capital of France is", output: "Paris", color: "#ffeb3b" },
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
            <Typography variant="h4" component="h3" gutterBottom sx={{ color: "text.primary", fontWeight: "bold" }}>
              {t("overview.title")}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("overview.desc.0") }} 
            />
          </Box>

          <Paper 
            component={motion.div} 
            variants={item}
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.1)" : "rgba(0, 113, 227, 0.05)", 
              borderColor: theme.palette.mode === "dark" ? "rgba(0, 113, 227, 0.3)" : "rgba(0, 113, 227, 0.2)",
              borderWidth: 1,
              borderStyle: "solid",
              display: "flex", 
              flexDirection: "column", 
              gap: 1 
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "primary.main", display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
              🚀 {locale === "tr" ? "Sözümüz Söz!" : "Our Promise!"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {t("overview.promise")}
            </Typography>
          </Paper>

          {/* Tarihçe & Ortamlarda satmalık bilgi */}
          <Box 
            component={motion.div} 
            variants={item}
            sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 1 }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                flex: "1 1 300px",
                p: 2.5, 
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)",
                borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.200",
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "primary.main", fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                📜 {locale === "tr" ? "Tarihçe" : "History"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {t("overview.history")}
              </Typography>
            </Paper>

            <Paper 
              elevation={0}
              sx={{ 
                flex: "1 1 300px",
                p: 2.5, 
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)",
                borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.200",
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "warning.main", fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                💡 {locale === "tr" ? "Ortamlarda Satmalık Bilgi" : "Fun Fact"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {t("overview.fact")}
              </Typography>
            </Paper>
          </Box>
        </>
      )}

      {slide === 1 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {locale === "tr" ? "Kelime Tamamlama" : "Smart Autocomplete"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("overview.desc.1") }} 
            />
          </Box>

          <Paper component={motion.div} variants={item} sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: "bold" }} variant="subtitle1" gutterBottom>
              {t("overview.autocomplete")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              {examples.map((ex, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                    p: 2,
                    borderRadius: 2,
                    border: 1,
                    borderColor: theme.palette.mode === "dark" ? "grey.800" : "grey.200"
                  }}
                >
                  <Typography variant="body1" sx={{ fontFamily: "monospace", color: "text.primary" }}>
                    &quot;{ex.input}
                  </Typography>
                  <Box
                    component={motion.span}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
                    sx={{
                      color: ex.color,
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "1rem"
                    }}
                  >
                    {ex.output}&quot;
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}

      {slide === 2 && (
        <>
          <Box component={motion.div} variants={item}>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" component="h3" gutterBottom>
              {locale === "tr" ? "Büyük Resim" : "The Big Picture"}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: t("overview.desc.2") }} 
            />
          </Box>

          <Box component={motion.div} variants={item}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("overview.next")}
            </Typography>
          </Box>

          <Box component={motion.div} variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    At a mathematical level, a Decoder-only Large Language Model (LLM) computes the conditional probability distribution of the next token given the sequence of previous tokens:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    P(x_t | x_1, x_2, ..., x_&#123;t-1&#125;; &theta;) = Softmax(Logits_t)
                  </Box>
                  <p className="mt-2">
                    where:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>x_i</strong> represents the token at index <em>i</em>.</li>
                    <li><strong>&theta;</strong> represents the model&apos;s learnable parameters (weights and biases of self-attention and MLP layers).</li>
                    <li><strong>Logits_t</strong> is the output of the final linear projection layer mapping back to the vocabulary dimension.</li>
                  </ul>
                  <p className="mt-3">
                    During training, we minimize the cross-entropy loss over a corpus of billions of tokens to optimize &theta;:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    L = - &Sigma;_t log P(x_t | x_&lt;t; &theta;)
                  </Box>
                  <p className="mt-2">
                    Modern architectures (like GPT-4, LLaMA, Claude) stack 32 to 128 layers of Transformer blocks containing multi-head causal attention and SwiGLU feed-forward networks, scaling up to hundreds of billions of parameters.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    Matematiksel düzeyde, sadece Dekoder (Decoder-only) içeren bir Büyük Dil Modeli (LLM), önceki token&apos;lar dizisi verildiğinde bir sonraki token&apos;ın koşullu olasılık dağılımını hesaplar:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    P(x_t | x_1, x_2, ..., x_&#123;t-1&#125;; &theta;) = Softmax(Logits_t)
                  </Box>
                  <p className="mt-2">
                    Burada:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>x_i</strong>, <em>i</em>. indeksteki token&apos;ı temsil eder.</li>
                    <li><strong>&theta;</strong>, modelin öğrenilebilir parametrelerini (öz-dikkat ve MLP katmanlarının ağırlıkları ve sapmaları) temsil eder.</li>
                    <li><strong>Logits_t</strong>, son doğrusal katmanın kelime haznesi (vocabulary) boyutuna yansıttığı ham skorlardır.</li>
                  </ul>
                  <p className="mt-3">
                    Eğitim sırasında, milyarlarca token&apos;lık bir veri kümesi üzerinde çapraz entropi (cross-entropy) kaybını minimize ederek &theta; parametrelerini optimize ederiz:
                  </p>
                  <Box sx={{ bgcolor: "grey.950", p: 2, borderRadius: 1.5, fontFamily: "monospace", textAlign: "center", color: "primary.light", my: 2, overflowX: "auto" }}>
                    L = - &Sigma;_t log P(x_t | x_&lt;t; &theta;)
                  </Box>
                  <p className="mt-2">
                    Modern mimariler (GPT-4, LLaMA, Claude), nedensel (causal) çok başlı öz-dikkat ve SwiGLU beslemeli ağları içeren 32 ila 128 adet Transformer bloğunu üst üste yığarak yüz milyarlarca parametreye ulaşır.
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

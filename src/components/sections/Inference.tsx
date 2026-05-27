"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";
import { Play, RotateCcw, Sparkles, BookOpen, ChevronRight, HelpCircle } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// Default training paragraphs
const defaultTexts: Record<string, string> = {
  tr: "kedi güneşli bir günde yeşil çimlerde mutlu mutlu oynuyordu. kedi gökyüzü altındaki yeşil çimlerde aniden durdu ve tatlı bir uykuya daldı. gökyüzü bugün çok güzeldi.",
  en: "the cat was playing happily on the green grass on a sunny day. the cat stopped suddenly on the green grass under the blue sky and fell asleep. the blue sky was very beautiful today."
};

// Helper tokenizer
function tokenizeText(text: string): string[] {
  return text.toLowerCase().match(/\b[a-zA-ZğüşıöçĞÜŞİÖÇ']+\b|[.,!?;]/g) || [];
}

export default function Inference({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();

  // Training text state
  const [trainingText, setTrainingText] = useState("");
  const [isEditingText, setIsEditingText] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);

  // Temperature slider state
  const [temperature, setTemperature] = useState(1.0);

  // Selected word for probability lookup visualization
  const [selectedLookupWord, setSelectedLookupWord] = useState("");

  // Generation state
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  // Initialize training text based on locale
  useEffect(() => {
    if (!hasUserEdited) {
      setTrainingText(defaultTexts[locale] || defaultTexts["en"]);
    }
  }, [locale, hasUserEdited]);

  // Parse text and train bigram model
  const { tokens, vocabulary, bigrams } = useMemo(() => {
    const tokens = tokenizeText(trainingText);
    const vocabSet = new Set(tokens);
    const vocabulary = Array.from(vocabSet).sort();

    // Map each token to its next token counts
    const bigrams: Record<string, Record<string, number>> = {};
    for (let i = 0; i < tokens.length - 1; i++) {
      const current = tokens[i];
      const next = tokens[i + 1];
      if (!bigrams[current]) {
        bigrams[current] = {};
      }
      bigrams[current][next] = (bigrams[current][next] || 0) + 1;
    }

    return { tokens, vocabulary, bigrams };
  }, [trainingText]);

  // Set default selected lookup word when vocabulary updates
  useEffect(() => {
    if (vocabulary.length > 0 && (!selectedLookupWord || !vocabulary.includes(selectedLookupWord))) {
      // Find a word that has transitions if possible
      const wordWithTransitions = vocabulary.find(w => bigrams[w] && Object.keys(bigrams[w]).length > 0);
      setSelectedLookupWord(wordWithTransitions || vocabulary[0]);
    }
  }, [vocabulary, bigrams, selectedLookupWord]);

  // Set default starting word for prompt when vocabulary updates
  useEffect(() => {
    if (vocabulary.length > 0 && !generationPrompt) {
      setGenerationPrompt(vocabulary[0]);
    }
  }, [vocabulary, generationPrompt]);

  // Calculate transition probabilities for a given word based on temperature
  const getTransitionProbabilities = (word: string, temp: number) => {
    const transitions = bigrams[word];
    if (!transitions) return [];

    const rawCounts = Object.entries(transitions); // [ [nextWord, count], ... ]
    
    // Apply temperature scaling: count^(1/T)
    const scaledExps = rawCounts.map(([nextWord, count]) => {
      // Avoid division by zero, cap temperature low-bound
      const tVal = Math.max(0.1, temp);
      return {
        word: nextWord,
        val: Math.pow(count, 1 / tVal)
      };
    });

    const sumVals = scaledExps.reduce((a, b) => a + b.val, 0);
    
    return scaledExps.map(item => ({
      word: item.word,
      probability: sumVals > 0 ? item.val / sumVals : 0,
      rawCount: transitions[item.word] || 0
    })).sort((a, b) => b.probability - a.probability);
  };

  // Live probabilities for the selected lookup word
  const transitionProbs = useMemo(() => {
    return getTransitionProbabilities(selectedLookupWord, temperature);
  }, [selectedLookupWord, bigrams, temperature]);

  // Next token sampler
  const sampleNextToken = (lastWord: string, temp: number): string | null => {
    const probs = getTransitionProbabilities(lastWord, temp);
    if (probs.length === 0) return null;

    // Standard cumulative random sampling
    const r = Math.random();
    let cumulative = 0;
    for (const item of probs) {
      cumulative += item.probability;
      if (r <= cumulative) {
        return item.word;
      }
    }
    return probs[0].word; // fallback
  };

  // Perform single step of next word prediction
  const handleGenerateStep = () => {
    const currentText = generatedTokens.length > 0 
      ? generatedTokens[generatedTokens.length - 1] 
      : generationPrompt.trim().toLowerCase();

    if (!currentText) return;

    // Tokenize current input to get the last word
    const inputTokens = tokenizeText(currentText);
    if (inputTokens.length === 0) return;

    const lastWord = inputTokens[inputTokens.length - 1];
    
    // If last token is punctuation, let's see if it has transitions, else pick random
    const nextToken = sampleNextToken(lastWord, temperature);

    if (nextToken) {
      if (generatedTokens.length === 0) {
        setGeneratedTokens([generationPrompt.trim(), nextToken]);
      } else {
        setGeneratedTokens([...generatedTokens, nextToken]);
      }
    } else {
      // Dead-end transition, append a message or stop
      const fallbackWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      if (generatedTokens.length === 0) {
        setGeneratedTokens([generationPrompt.trim(), `[${locale === "tr" ? "tıkanma - sıfırlanıyor" : "dead end - resetting"}]`, fallbackWord]);
      } else {
        setGeneratedTokens([...generatedTokens, `[${locale === "tr" ? "tıkanma" : "dead end"}]`, fallbackWord]);
      }
    }
  };

  // Auto generate multiple words
  useEffect(() => {
    if (isAutoGenerating) {
      const interval = setInterval(() => {
        const currentTokens = generatedTokens.length > 0 ? generatedTokens : [generationPrompt.trim().toLowerCase()];
        const lastWord = currentTokens[currentTokens.length - 1];
        const cleanedLastWord = lastWord.replace(/[.,!?;]/g, "");
        
        // Find next token
        const nextToken = sampleNextToken(cleanedLastWord || lastWord, temperature);
        if (nextToken && generatedTokens.length < 15) {
          if (generatedTokens.length === 0) {
            setGeneratedTokens([generationPrompt.trim(), nextToken]);
          } else {
            setGeneratedTokens([...generatedTokens, nextToken]);
          }
        } else {
          setIsAutoGenerating(false);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isAutoGenerating, generatedTokens, generationPrompt, temperature, vocabulary]);

  const resetGeneration = () => {
    setGeneratedTokens([]);
    setIsAutoGenerating(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-10">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("infer.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("infer.desc.0") }} />
          </motion.div>

          {/* Training Paragraph (Interactive Dataset) */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h4 className="text-md font-semibold text-white">
                  {locale === "tr" ? "Eğitim Verisi (Paragraf)" : "Training Data (Paragraph)"}
                </h4>
              </div>
              <button
                onClick={() => setIsEditingText(!isEditingText)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition cursor-pointer"
              >
                {isEditingText 
                  ? (locale === "tr" ? "Eğitimi Tamamla" : "Save & Retrain") 
                  : (locale === "tr" ? "Metni Düzenle" : "Edit Text")}
              </button>
            </div>

            {isEditingText ? (
              <textarea
                value={trainingText}
                onChange={(e) => {
                  setTrainingText(e.target.value);
                  setHasUserEdited(true);
                }}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition"
              />
            ) : (
              <p className="bg-slate-900/80 p-4 border border-slate-800/80 rounded-lg text-sm text-slate-300 font-mono leading-relaxed select-all">
                {trainingText}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <div>
                {locale === "tr" ? "Toplam Kelime:" : "Total Tokens (Running text):"}{" "}
                <span className="text-white font-bold font-mono">{tokens.length}</span>
              </div>
              <div>
                {locale === "tr" ? "Sözlük Boyutu (Benzersiz):" : "Vocabulary Size (Unique):"}{" "}
                <span className="text-blue-400 font-bold font-mono">{vocabulary.length}</span>
              </div>
              {hasUserEdited && (
                <button
                  onClick={() => {
                    setTrainingText(defaultTexts[locale]);
                    setHasUserEdited(false);
                    resetGeneration();
                  }}
                  className="text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  {locale === "tr" ? "Varsayılana Sıfırla" : "Reset to default"}
                </button>
              )}
            </div>
          </motion.div>

          {/* Comparison table */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">{t("infer.table.title")}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm font-bold text-blue-400 mb-3">{t("infer.col.training")}</p>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  <li>• {t("infer.t1")}</li>
                  <li>• {t("infer.t2")}</li>
                  <li>• {t("infer.t3")}</li>
                  <li>• {t("infer.t4")}</li>
                  <li>• {t("infer.t5")}</li>
                </ul>
              </div>
              <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm font-bold text-green-400 mb-3">{t("infer.col.inference")}</p>
                <ul className="text-xs text-slate-300 space-y-2 font-mono">
                  <li>• {t("infer.i1")}</li>
                  <li>• {t("infer.i2")}</li>
                  <li>• {t("infer.i3")}</li>
                  <li>• {t("infer.i4")}</li>
                  <li>• {t("infer.i5")}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">
              {locale === "tr" ? "Çıkarım ve Cümle Üretim Laboratuvarı" : "Inference & Sentence Playground"}
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("infer.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Model Parameters / Temperature */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {locale === "tr" ? "Model Parametreleri: Olasılık Dağılımları" : "Model Parameters: Probability Distribution"}
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  {locale === "tr"
                    ? "Sözlükten bir kelime seçin. Modelin bu kelimeden sonra hangi kelimelerin gelebileceğini nasıl öğrendiğini canlı olarak görün."
                    : "Select a word from vocabulary to inspect the model's learned transition probability distribution."}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-slate-300 font-mono">P( next_word |</span>
                  <select
                    value={selectedLookupWord}
                    onChange={(e) => setSelectedLookupWord(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {vocabulary.map(word => (
                      <option key={word} value={word}>{word}</option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-300 font-mono">)</span>
                </div>

                <div className="space-y-3 mt-2">
                  {transitionProbs.length > 0 ? (
                    transitionProbs.map((item, i) => (
                      <div key={item.word} className="flex items-center gap-3">
                        <span className="w-16 text-xs font-mono text-slate-300 truncate">{item.word}</span>
                        <div className="flex-1 h-3 bg-slate-900 rounded overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.probability * 100}%` }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className={`h-full rounded ${i === 0 ? "bg-blue-500" : "bg-slate-600"}`}
                          />
                        </div>
                        <span className="w-12 text-right text-xs font-mono text-blue-300">
                          {(item.probability * 100).toFixed(0)}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({item.rawCount}x)
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-6">
                      {locale === "tr" ? "Bu kelimeden sonra bir geçiş yok (cümle sonu)." : "No transitions found for this word (end of text)."}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {locale === "tr" ? "Olasılıkları Şekillendir: Sıcaklık (Temperature)" : "Shape Probabilities: Temperature Slider"}
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Temperature:</span>
                    <span className="text-blue-400 font-bold">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0.1 (Robotik)</span>
                    <span>2.0 (Yaratıcı / Çılgın)</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg text-xs space-y-2 mt-4">
                  <h5 className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                    {locale === "tr" ? "Sıcaklık Nasıl Etki Eder?" : "How does Temperature work?"}
                  </h5>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {temperature < 0.5 
                      ? (locale === "tr" 
                        ? "Düşük Sıcaklık: Olasılıkları keskinleştirir. En yüksek skorlu kelimenin kazanma şansını aşırı artırır, tahminleri robotik/tahmin edilebilir yapar." 
                        : "Low Temperature: Sharpens probabilities. The highest count candidate dominates, leading to deterministic, highly predictable predictions.")
                      : temperature > 1.2
                      ? (locale === "tr" 
                        ? "Yüksek Sıcaklık: Olasılıkları birbirine yakınlaştırır. Düşük olasılıklı kelimelerin seçilme şansını artırarak metin üretimini yaratıcı ve çılgın yapar." 
                        : "High Temperature: Softens probabilities. Flattens out distributions, allowing low-probability words to be selected, raising creativity or nonsense outputs.")
                      : (locale === "tr" 
                        ? "Dengeli Sıcaklık: Kelimelerin gerçek sıklıklarına göre doğal bir akışta örnekleme yapar." 
                        : "Balanced Temperature: Follows the natural training counts directly for a healthy, human-like generation flow.")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sentence Generation Playground */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    {locale === "tr" ? "Cümle Üretim Laboratuvarı" : "Autoregressive Sentence Generator"}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{locale === "tr" ? "Başlangıç:" : "Start Word:"}</span>
                    <select
                      value={generationPrompt}
                      onChange={(e) => {
                        setGenerationPrompt(e.target.value);
                        resetGeneration();
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {vocabulary.map(word => (
                        <option key={word} value={word}>{word}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Text screen display */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 min-h-[120px] font-mono text-sm leading-relaxed relative flex flex-wrap items-center gap-1.5">
                  {generatedTokens.length > 0 ? (
                    generatedTokens.map((tok, i) => {
                      const isPunct = /[.,!?;]/.test(tok);
                      const isLast = i === generatedTokens.length - 1;
                      return (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`${
                            isLast 
                              ? "text-blue-400 font-bold bg-blue-500/10 px-1 rounded border border-blue-500/20" 
                              : (tok.startsWith("[") ? "text-red-400 font-mono text-xs" : "text-slate-200")
                          }`}
                        >
                          {tok}{!isPunct && " "}
                        </motion.span>
                      );
                    })
                  ) : (
                    <span className="text-slate-500 italic font-sans text-xs">
                      {locale === "tr" ? "Başlamak için aşağıdaki butonları kullanın..." : "Use the controls below to start generating tokens..."}
                    </span>
                  )}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-blue-500 font-bold w-1 h-4 bg-blue-500 inline-block"
                  />
                </div>
              </div>

              {/* Generation controls */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleGenerateStep}
                  disabled={isAutoGenerating}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  {locale === "tr" ? "1 Kelime Üret" : "Generate 1 Word"}
                </button>
                <button
                  onClick={() => {
                    if (isAutoGenerating) {
                      setIsAutoGenerating(false);
                    } else {
                      if (generatedTokens.length === 0) {
                        setGeneratedTokens([generationPrompt.trim()]);
                      }
                      setIsAutoGenerating(true);
                    }
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isAutoGenerating 
                    ? (locale === "tr" ? "Durdur" : "Stop") 
                    : (locale === "tr" ? "Otomatik Üret" : "Auto-Generate")}
                </button>
                <button
                  onClick={resetGeneration}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition cursor-pointer border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {locale === "tr" ? "Temizle" : "Reset"}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-sm bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            <span dangerouslySetInnerHTML={{ __html: t("infer.insight") }} />
          </motion.div>

          {/* Senior Developer Mode */}
          <motion.div variants={item}>
            <SeniorDeveloperMode
              contentEn={
                <>
                  <p>
                    Serving Large Language Models at scale in production requires significant engineering optimizations. Because modern parameters scale from 7B to 400B+ parameters, naive float32/float16 inference leads to huge memory footprints and slow response times.
                  </p>
                  <p className="mt-2 font-semibold font-sans">1. Quantization (Model Compression):</p>
                  <p className="text-slate-300 font-sans">
                    Quantization maps continuous floating-point weights (FP16 or BF16) to discrete lower-precision numerical representations (INT8, FP8, INT4, or NF4):
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"W_q = round( W / S ) + Z"}
                  </div>
                  <p className="text-slate-300 mt-2 font-sans">
                    where <code>S</code> is a scale factor and <code>Z</code> is a zero-point offset. Advanced techniques like <strong>AWQ (Activation-aware Weight Quantization)</strong> and <strong>GPTQ</strong> protect salient weights (e.g. weights corresponding to high-activation tokens) from severe precision reduction, enabling 4-bit quantized models to perform with almost zero perplexity loss compared to their FP16 baselines, reducing GPU VRAM needs by 4x.
                  </p>
                  <p className="mt-2 font-semibold font-sans">2. Speculative Decoding:</p>
                  <p className="text-slate-300 font-sans">
                    Text generation is bounded by GPU memory bandwidth (loading weights into SRAM takes longer than computing outputs). **Speculative Decoding** solves this by running a small &quot;draft model&quot; (e.g., LLaMA-1.1B) to quickly generate <code>K</code> candidate tokens autoregressively. Then, the larger &quot;target model&quot; (e.g., LLaMA-70B) evaluates all <code>K</code> tokens in parallel in a single forward pass. Tokens that match the target model&apos;s probability distribution are accepted, achieving up to a 2x-3x speedup.
                  </p>
                  <p className="mt-2 font-semibold font-sans">3. PagedAttention (KV Cache Management):</p>
                  <p className="text-slate-300 font-sans">
                    In classical setups, GPU memory for the KV cache must be pre-allocated contiguously based on the maximum sequence length. This leads to up to 60-80% memory waste (&quot;internal fragmentation&quot;) because actual generations are shorter. **PagedAttention** (introduced in vLLM) partitions the KV cache into small, non-contiguous physical pages (similar to virtual memory in operating systems). Pages are allocated dynamically, allowing batch sizes to scale up to 4x, drastically increasing throughput.
                  </p>
                </>
              }
              contentTr={
                <>
                  <p>
                    Büyük Dil Modellerini endüstriyel boyutta sunmak (serving), büyük mühendislik optimizasyonları gerektirir. 7 milyardan 400 milyarın üzerine çıkan devasa parametre boyutları nedeniyle, ham float16 çıkarımı yüksek donanım maliyeti ve yavaş cevap süresine yol açar.
                  </p>
                  <p className="mt-2 font-semibold font-sans">1. Nicemleme (Quantization - Model Sıkıştırma):</p>
                  <p className="text-slate-300 font-sans">
                    Nicemleme işlemi, sürekli ondalıklı sayı ağırlıklarını (FP16 veya BF16) daha düşük hassasiyete sahip tamsayı veya küçük ondalık formatlara (INT8, FP8, INT4 veya NF4) yuvarlayarak eşleştirir:
                  </p>
                  <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                    {"W_q = round( W / S ) + Z"}
                  </div>
                  <p className="text-slate-300 mt-2 font-sans">
                    Burada <code>S</code> ölçek çarpanı, <code>Z</code> ise sıfır noktası kaymasıdır. <strong>AWQ (Activation-aware Weight Quantization)</strong> ve <strong>GPTQ</strong> gibi gelişmiş yöntemler, model kalitesi için kritik olan 'hassas ağırlıkları' (etkinleştirme değerleri yüksek olan kanalları) koruyarak 4-bit sıkıştırmada bile FP16 kalitesine yakın sonuçlar üretilmesini sağlar. Bu, VRAM ihtiyacını 4 kat azaltır.
                  </p>
                  <p className="mt-2 font-semibold font-sans">2. Spekülatif Kod Çözme (Speculative Decoding):</p>
                  <p className="text-slate-300 font-sans">
                    Çıkarım sırasında kelime üretimi GPU bellek bant genişliği ile sınırlıdır (ağırlıkları bellekten çekmek, onları işlemekten çok daha uzun sürer). **Spekülatif Kod Çözme**, bu darboğazı çözmek için daha küçük ve hızlı bir &quot;taslak model&quot; (örn. LLaMA-1.1B) kullanarak ardışık <code>K</code> adet kelime üretir. Büyük asıl model (örn. LLaMA-70B), bu <code>K</code> kelimeyi tek bir ileri geçişte (forward pass) paralel olarak doğrular. Doğrulanan kelimeler kabul edilir, böylece işlem hızı 2 ila 3 kat artırılmış olur.
                  </p>
                  <p className="mt-2 font-semibold font-sans">3. PagedAttention (KV Cache Yönetimi):</p>
                  <p className="text-slate-300 font-sans">
                    Geleneksel çıkarım motorlarında, KV cache bellek alanı her kullanıcı için maksimum bağlam uzunluğuna göre bitişik (contiguous) olarak ayrılırdı. Bu durum, gerçek üretilen metinler kısa kaldığında %60 ila %80 oranında bellek israfına (internal fragmentation) sebep oluyordu. **PagedAttention** (vLLM kütüphanesi ile popülerleşen), işletim sistemlerindeki sanal bellek gibi KV cache verisini küçük, bitişik olmayan bellek sayfalarına böler. Dinamik sayfa yönetimi sayesinde bellek israfı sıfıra yaklaşır ve sunucu kapasitesi (throughput) 4 katına kadar çıkabilir.
                  </p>
                </>
              }
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

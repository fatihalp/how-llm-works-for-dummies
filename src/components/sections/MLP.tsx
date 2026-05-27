"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function relu(x: number) { return Math.max(0, x); }
function gelu(x: number) { return x * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x))); }

export default function MLP({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [inputVal, setInputVal] = useState(0.5);
  const range = Array.from({ length: 40 }, (_, i) => (i - 20) / 5);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("mlp.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("mlp.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("mlp.structure")}</h4>
            <div className="flex flex-col items-center gap-4">
              {/* Input layer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-300">
                    x{i+1}
                  </div>
                ))}
              </motion.div>
              <span className="text-xs text-slate-400">{t("mlp.input")}</span>

              <div className="text-slate-500 text-xs font-mono">{t("mlp.multiply1")}</div>

              {/* Hidden layer (expanded) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-1.5"
              >
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-green-500/30 border border-green-500/50" />
                ))}
              </motion.div>
              <span className="text-xs text-slate-400">{t("mlp.hidden")}</span>

              <div className="text-slate-500 text-xs font-mono">{t("mlp.activation")}</div>

              {/* Hidden after activation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-1.5"
              >
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border ${i % 3 === 0 ? "bg-green-500/10 border-green-500/20" : "bg-green-500/40 border-green-500/60"}`} />
                ))}
              </motion.div>
              <span className="text-xs text-slate-400">{t("mlp.afteract")}</span>

              <div className="text-slate-500 text-xs font-mono">{t("mlp.multiply2")}</div>

              {/* Output layer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-2"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-300">
                    y{i+1}
                  </div>
                ))}
              </motion.div>
              <span className="text-xs text-slate-400">{t("mlp.output")}</span>
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("mlp.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("mlp.desc.1") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("mlp.gelu.title")}</h4>
            <p className="text-slate-300 text-sm mb-4">
              {t("mlp.gelu.desc")}
            </p>

            <div className="relative h-44 bg-slate-900 rounded-lg overflow-hidden p-4 border border-slate-850">
              {/* Axes */}
              <div className="absolute inset-4 border-l border-b border-slate-700" />
              {/* GELU curve */}
              <svg className="absolute inset-4" viewBox="0 0 200 100" preserveAspectRatio="none">
                <polyline
                  points={range.map((x, i) => {
                    const px = (i / (range.length - 1)) * 200;
                    const py = 100 - ((gelu(x) + 2) / 5) * 100;
                    return `${px},${py}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#0071e3"
                  strokeWidth="2"
                />
                <polyline
                  points={range.map((x, i) => {
                    const px = (i / (range.length - 1)) * 200;
                    const py = 100 - ((relu(x) + 2) / 5) * 100;
                    return `${px},${py}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </svg>
              <div className="absolute bottom-2 right-4 flex gap-4 text-xs font-mono">
                <span className="text-blue-400">— GELU</span>
                <span className="text-green-400">--- ReLU</span>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("mlp.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("mlp.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("mlp.formula.title")}</h4>
            <div className="bg-slate-900 rounded-lg p-5 font-mono text-base space-y-2.5">
              <p className="text-green-400">MLP(x) = W₂ · GELU(W₁ · x + b₁) + b₂</p>
              <p className="text-slate-500 text-xs">{t("mlp.formula.desc")}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("mlp.insight") }} />
          </motion.div>

      <motion.div variants={item}>
        <SeniorDeveloperMode
          contentEn={
            <>
              <p>
                In the classical Transformer block, the Feed-Forward Network (FFN) consists of two linear transformations with a non-linear activation function in between:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"FFN_GELU(x) = GELU(x · W₁ + b₁) · W₂ + b₂"}
              </div>
              <p className="mt-2 text-slate-300">
                where <code>W_1 \in \mathbb&#123;R&#125;^&#123;d_&#123;model&#125; \times d_&#123;ff&#125;&#125;</code> (typically <code>d_&#123;ff&#125; = 4 \cdot d_&#123;model&#125;</code>) and <code>W_2 \in \mathbb&#123;R&#125;^&#123;d_&#123;ff&#125; \times d_&#123;model&#125;&#125;</code>.
              </p>
              <p className="mt-2 font-semibold">The Shift to SwiGLU Gated Activations:</p>
              <p className="text-slate-300">
                Modern state-of-the-art LLMs (like LLaMA-2/3, Mistral, Gemma, PaLM) discard GELU in favor of <strong>SwiGLU</strong> (Swish Gated Linear Unit). A Gated Linear Unit (GLU) is a neural network layer defined as the component-wise product of two linear transformations, one of which is gated by a sigmoid or other activation.
              </p>
              <p className="mt-2 text-slate-300">
                For SwiGLU, the Swish activation (specifically <strong>SiLU</strong>, where <code>\text&#123;SiLU&#125;(x) = x \cdot \sigma(x)</code>) is used as the gate:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"SwiGLU(x) = ( SiLU(x · W_gate) ⊗ (x · W_up) ) · W_down"}
              </div>
              <p className="mt-2 text-slate-300">
                where:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li><code>W_&#123;\text&#123;gate&#125;&#125;</code> and <code>W_&#123;\text&#123;up&#125;&#125;</code> project the hidden vector into <code>d_&#123;ff&#125;</code> dimensions.</li>
                <li><code>\otimes</code> represents the element-wise (Hadamard) product.</li>
                <li><code>W_&#123;\text&#123;down&#125;&#125;</code> projects the gating output back down to <code>d_&#123;model&#125;</code>.</li>
              </ul>
              <p className="mt-2 text-slate-300">
                Because SwiGLU introduces an additional projection matrix, to maintain the same number of parameters, the FFN hidden dimension is typically scaled down to approximately <code>\frac&#123;8&#125;&#123;3&#125; d_&#123;model&#125;</code> rather than <code>4 d_&#123;model&#125;</code>. SwiGLU provides significantly better empirical results in convergence speed and downstream task loss.
              </p>
            </>
          }
          contentTr={
            <>
              <p>
                Klasik Transformer bloğunda, Beslemeli Ağ (Feed-Forward Network - FFN / MLP), aralarında doğrusal olmayan bir aktivasyon fonksiyonu barındıran iki adet doğrusal katmandan oluşur:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"FFN_GELU(x) = GELU(x · W₁ + b₁) · W₂ + b₂"}
              </div>
              <p className="mt-2 text-slate-300">
                Burada <code>W_1 \in \mathbb&#123;R&#125;^&#123;d_&#123;model&#125; \times d_&#123;ff&#125;&#125;</code> (genellikle <code>d_&#123;ff&#125; = 4 \cdot d_&#123;model&#125;</code>) and <code>W_2 \in \mathbb&#123;R&#125;^&#123;d_&#123;ff&#125; \times d_&#123;model&#125;&#125;</code> boyutlarındadır.
              </p>
              <p className="mt-2 font-semibold">Gelişmiş SwiGLU Kapılı Aktivasyonlarına Geçiş:</p>
              <p className="text-slate-300">
                Modern son teknoloji LLM&apos;ler (örn. LLaMA-2/3, Mistral, Gemma, PaLM), GELU yerine <strong>SwiGLU</strong> (Swish Gated Linear Unit) kapı mekanizmasını tercih ederler. Gated Linear Unit (GLU), girdinin iki ayrı doğrusal yansıtma matrisi ile çarpılıp, birinin aktivasyon fonksiyonundan (kapı) geçirilerek diğeriyle eleman bazında çarpılmasıdır.
              </p>
              <p className="mt-2 text-slate-300">
                SwiGLU formülasyonunda, kapı olarak Swish (yani <strong>SiLU</strong>, burada <code>\text&#123;SiLU&#125;(x) = x \cdot \sigma(x)</code>) kullanılır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"SwiGLU(x) = ( SiLU(x · W_gate) ⊗ (x · W_up) ) · W_down"}
              </div>
              <p className="mt-2 text-slate-300">
                Burada:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li><code>W_&#123;\text&#123;gate&#125;&#125;</code> ve <code>W_&#123;\text&#123;up&#125;&#125;</code> girdiyi <code>d_&#123;ff&#125;</code> boyutuna çıkarır.</li>
                <li><code>\otimes</code> Hadamard (eleman bazında) çarpımını temsil eder.</li>
                <li><code>W_&#123;\text&#123;down&#125;&#125;</code> elde edilen vektörü tekrar ana model boyutu olan <code>d_&#123;model&#125;</code> seviyesine düşürür.</li>
              </ul>
              <p className="mt-2 text-slate-300">
                SwiGLU fazladan bir parametre matrisi (up projection) getirdiği için, parametre bütçesini sabit tutmak adına ara katman boyutu genellikle <code>4 d_&#123;model&#125;</code> yerine <code>\frac&#123;8&#125;&#123;3&#125; d_&#123;model&#125;</code> civarında tutulur. SwiGLU, karmaşık ilişkileri öğrenmede ve eğitim kaybını düşürmede klasik GELU&apos;ya göre çok daha yüksek başarı sağlamaktadır.
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import SeniorDeveloperMode from "@/components/SeniorDeveloperMode";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function TransformerBlock({ slide = 0 }: { slide?: number }) {
  const { t, locale } = useI18n();
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [numLayers, setNumLayers] = useState(12);

  const layers = [
    { id: "ln1", label: t("nav.layernorm"), color: "bg-yellow-500/20 border-yellow-500/50", textColor: "text-yellow-300" },
    { id: "attn", label: t("nav.attention"), color: "bg-blue-500/20 border-blue-500/50", textColor: "text-blue-300" },
    { id: "res1", label: locale === "tr" ? "+ Artık Bağlantı" : "+ Residual", color: "bg-green-500/20 border-green-500/50", textColor: "text-green-300" },
    { id: "ln2", label: t("nav.layernorm"), color: "bg-yellow-500/20 border-yellow-500/50", textColor: "text-yellow-300" },
    { id: "mlp", label: t("nav.mlp"), color: "bg-blue-500/20 border-blue-500/50", textColor: "text-blue-300" },
    { id: "res2", label: locale === "tr" ? "+ Artık Bağlantı" : "+ Residual", color: "bg-green-500/20 border-green-500/50", textColor: "text-green-300" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {slide === 0 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("tf.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("tf.desc.0") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">{t("tf.inside")}</h4>

            <div className="flex flex-col items-center gap-2">
              {/* Input */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 font-mono"
              >
                {t("tf.input")}
              </motion.div>
              <div className="w-px h-4 bg-slate-600" />

              {/* Layers */}
              {layers.map((layer, i) => (
                <motion.div key={layer.id + i} className="flex flex-col items-center relative">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onMouseEnter={() => setActiveLayer(i)}
                    onMouseLeave={() => setActiveLayer(null)}
                    className={`px-6 py-2.5 rounded-lg border text-base font-medium cursor-pointer transition-all ${layer.color} ${layer.textColor} ${
                      activeLayer === i ? "ring-2 ring-white/30 scale-105" : ""
                    }`}
                  >
                    {layer.label}
                  </motion.div>
                  {i < layers.length - 1 && <div className="w-px h-3 bg-slate-600" />}
                  {(layer.id === "res1" || layer.id === "res2") && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="absolute -left-20 top-2.5 text-[9px] text-green-400 italic font-mono"
                    >
                      {t("tf.skip")}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              <div className="w-px h-4 bg-slate-600" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 font-mono"
              >
                {t("tf.output")}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}

      {slide === 1 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("tf.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("tf.desc.1") }} />
          </motion.div>

          {/* LayerNorm detailed card embedded */}
          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
            <h4 className="text-md font-semibold text-white">⚖️ {locale === "tr" ? "Normalizasyon (Dengeleme) Neden Şart?" : "Why Normalization is Critical?"}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {locale === "tr"
                ? "Milyarlarca sayı katmanlar arasında çarpıla çarpıla ilerlerken sayılar çığ gibi büyüyebilir (Sonsuz - Infinity) ya da tamamen eriyip yok olabilir (Sıfır). Normalizasyon, her işlem öncesi sayıları yakalayıp ortalaması 0, standart sapması 1 olacak şekilde güvenli bir aralığa çeker. Bu işlem, modelin eğitimini dengede tutan görünmez bir emniyet kemeridir."
                : "As numbers flow through many layers, they undergo billions of multiplications. The outputs can explode (become Infinity) or vanish (become zero). Normalization steps in before attention and MLP layers to rescale the values, ensuring they stay within a stable numerical range."}
            </p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-center">
              <p className="text-blue-400">output = (x - mean) / sqrt(variance + ε)</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("tf.residual")}</h4>
            <p className="text-slate-300 text-sm mb-3">
              {t("tf.residual.desc")}
            </p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-center">
              <p className="text-green-400">output = LayerNorm(x) → Attention → + x</p>
              <p className="text-green-400">output = LayerNorm(x) → MLP → + x</p>
            </div>
          </motion.div>
        </>
      )}

      {slide === 2 && (
        <>
          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-white mb-3">{t("tf.title")}</h3>
            <p className="text-slate-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: t("tf.desc.2") }} />
          </motion.div>

          <motion.div variants={item} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-4">
              {t("tf.stacking")}
            </h4>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs text-slate-400">{t("tf.layers")}</span>
              <input
                type="range"
                min={2}
                max={96}
                value={numLayers}
                onChange={(e) => setNumLayers(Number(e.target.value))}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-white font-mono w-8">{numLayers}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {Array.from({ length: numLayers }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="w-6 h-8 bg-gradient-to-b from-blue-500/40 to-slate-500/40 border border-blue-500/30 rounded text-[8px] flex items-center justify-center text-slate-400"
                >
                  {i + 1}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-400 space-y-1 font-mono">
              <p dangerouslySetInnerHTML={{ __html: t("tf.models") }} />
              <p>{t("tf.more")}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="text-slate-400 text-base bg-blue-900/20 border border-blue-800/30 rounded-lg p-5">
            <span dangerouslySetInnerHTML={{ __html: t("tf.insight") }} />
          </motion.div>

      <motion.div variants={item}>
        <SeniorDeveloperMode
          contentEn={
            <>
              <p>
                The standard Transformer formulation utilizes Layer Normalization (LayerNorm) and residual connections. The configuration of these blocks has changed in modern designs.
              </p>
              <p className="mt-2 font-semibold">Post-LN vs Pre-LN:</p>
              <p className="text-slate-300">
                Original BERT/GPT models used <strong>Post-LN</strong>, where normalization is applied <em>after</em> the sub-layer addition:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"x_{l+1} = LayerNorm( x_l + SubLayer(x_l) )"}
              </div>
              <p className="text-slate-300 mt-2">
                This caused difficulty in training deep architectures because gradients near the input layer decayed exponentially. Modern architectures use <strong>Pre-LN</strong>:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"x_{l+1} = x_l + SubLayer( LayerNorm(x_l) )"}
              </div>
              <p className="text-slate-300 mt-2">
                This enables a direct identity path (the <em>residual stream</em>) for gradients to flow undisturbed back to the input layers, allowing stable training of models with hundreds of layers without warmup schedules.
              </p>
              <p className="mt-2 font-semibold">RMSNorm (Root Mean Square Normalization):</p>
              <p className="text-slate-300">
                To save GPU execution time, LLaMA-2/3 and Gemma replace traditional LayerNorm with <strong>RMSNorm</strong>. Standard LayerNorm requires computing both the mean and variance:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
              </div>
              <p className="text-slate-300 mt-2">
                RMSNorm simplifies this by assuming the mean <code>\mu = 0</code>, normalization is done by dividing only by the root mean square:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
              </div>
              <p className="text-slate-300 mt-2">
                By omitting the mean calculation and division steps, RMSNorm achieves 10%-50% computational efficiency gains on GPUs without sacrificing model accuracy.
              </p>
            </>
          }
          contentTr={
            <>
              <p>
                Standart Transformer bloğunda Katman Normalizasyonu (LayerNorm) ve artık (residual) bağlantılar kullanılır. Ancak bu bileşenlerin dizilişi zamanla evrim geçirmiştir.
              </p>
              <p className="mt-2 font-semibold">Post-LN vs Pre-LN (Hizalama Farkı):</p>
              <p className="text-slate-300">
                İlk Transformer mimarilerinde norm işlemi alt katman işleminden <em>sonra</em> uygulanırdı (<strong>Post-LN</strong>):
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"x_{l+1} = LayerNorm( x_l + SubLayer(x_l) )"}
              </div>
              <p className="text-slate-300 mt-2">
                Bu yöntem derin modellerin eğitilmesinde kararsızlıklara yol açıyordu çünkü gradyanlar geriye doğru giderken sönümleniyordu. Modern modeller (Llama, Gemma, GPT-4) <strong>Pre-LN</strong> kullanır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"x_{l+1} = x_l + SubLayer( LayerNorm(x_l) )"}
              </div>
              <p className="text-slate-300 mt-2">
                Pre-LN sayesinde artık akış (<em>residual stream</em>) kesintisiz bir otoyol gibi çalışır. Gradyanlar ağın derinliklerinden ilk katmana kadar hiç bozulmadan akabilir.
              </p>
              <p className="mt-2 font-semibold">RMSNorm (Karekök Ortalaması Normalizasyonu):</p>
              <p className="text-slate-300">
                Hesaplama maliyetini düşürmek amacıyla LLaMA ve Gemma gibi modern modeller LayerNorm yerine <strong>RMSNorm</strong> kullanır. Standart LayerNorm hem ortalama (mean) hem de varyans hesaplamayı gerektirir:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"LN(x) = ( (x - μ) / √(σ² + ε) ) · γ + β"}
              </div>
              <p className="text-slate-300 mt-2">
                RMSNorm ise ortalamayı <code>\mu = 0</code> kabul eder, bu sayede işlem adımlarını ciddi oranda azaltır:
              </p>
              <div className="bg-slate-950 p-3 rounded my-2 font-mono text-center text-blue-400 overflow-x-auto">
                {"RMSNorm(x_i) = ( x_i / √( (1/d) * Σ x_j² + ε ) ) * γ_i"}
              </div>
              <p className="text-slate-300 mt-2">
                Ortalama çıkarma adımının atlanması, GPU bellek band genişliğinde kazanç sağlar ve model kalitesinde hiçbir kayıp yaşatmadan eğitimi ve çıkarımı hızlandırır.
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

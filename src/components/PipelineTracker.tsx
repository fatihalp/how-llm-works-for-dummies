"use client";

import { useI18n } from "@/i18n/context";

export default function PipelineTracker({ activeStep }: { activeStep: string }) {
  const { locale } = useI18n();

  const pipelineSteps = [
    { id: "tokenization", labelTr: "Tokenlama", labelEn: "Tokenize" },
    { id: "embedding", labelTr: "Gömme", labelEn: "Embed" },
    { id: "layernorm", labelTr: "Katman Normu", labelEn: "Layer Norm" },
    { id: "attention", labelTr: "Öz-Dikkat", labelEn: "Self-Attention" },
    { id: "projection", labelTr: "Yansıtma", labelEn: "Projection" },
    { id: "mlp", labelTr: "Mantık Katmanı", labelEn: "MLP" },
    { id: "softmax", labelTr: "Karar Verme", labelEn: "Softmax" },
    { id: "output", labelTr: "Çıktı Seçimi", labelEn: "Output" },
  ];

  return (
    <div className="w-full bg-slate-800/30 rounded-xl p-3 border border-slate-700/50 mb-6 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 min-w-[760px] justify-between text-[10px] font-mono select-none">
        {pipelineSteps.map((step, idx) => {
          const isActive = activeStep === step.id;
          const label = locale === "tr" ? step.labelTr : step.labelEn;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full border transition-all ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white font-bold"
                    : "bg-slate-800/40 border-slate-700/40 text-slate-500"
                }`}
              >
                {idx + 1}. {label}
              </span>
              {idx < pipelineSteps.length - 1 && <span className="text-slate-600">→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

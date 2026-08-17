import React from 'react';
import { ShieldCheck, Layers, Activity, Flame, Cpu, CheckCircle2 } from 'lucide-react';

export const QualityTestingLab: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-5xl mx-auto font-sans text-xs space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
        <div className="p-2.5 rounded-xl bg-[#1E4E8C]/10 text-[#1E4E8C] border border-[#1E4E8C]/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 font-mono">
            Испытательная Лаборатория &amp; Стандарты Качества Luxor
          </h2>
          <p className="text-gray-500 text-xs">
            Метрологический контроль, спектральный анализ металлов и стендовые испытания ISO/TS 16949
          </p>
        </div>
      </div>

      {/* Grid of Key Testing Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test 1: Metallurgy */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E4E8C] flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>1. Оптико-эмиссионная спектрометрия</span>
            </span>
            <span className="text-[10px] bg-gray-200 text-gray-700 font-mono px-2 py-0.5 rounded">ISO 6892-1</span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            Каждая плавка чугуна и полиамида PA66-GF30 проходит спектральный анализ для гарантии точности геометрии и теплопроводности.
          </p>
          <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-[11px] text-gray-900 flex items-center justify-between font-mono">
            <span>Допуск твердости:</span>
            <strong className="text-[#1E4E8C]">210 - 240 HBW</strong>
          </div>
        </div>

        {/* Test 2: Salt Spray Corrosion */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E4E8C] flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>2. Камера соляного тумана (720 часов)</span>
            </span>
            <span className="text-[10px] bg-gray-200 text-gray-700 font-mono px-2 py-0.5 rounded">DIN 50021</span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            Антикоррозионное покрытие проходит испытание непрерывным распылением 5% раствора NaCl при 35°C.
          </p>
          <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-[11px] text-gray-900 flex items-center justify-between font-mono">
            <span>Стойкость к коррозии:</span>
            <strong className="text-emerald-600">&gt; 720 часов</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

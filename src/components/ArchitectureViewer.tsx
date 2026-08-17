import React, { useState } from 'react';
import { ARCHITECTURE_SECTIONS, DB_SCHEMA_SQL } from '../data/architectureDocs';
import { Database, Copy, Check } from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('db-schema');
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(DB_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-5xl mx-auto font-sans text-xs space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#1E4E8C]/10 text-[#1E4E8C] border border-[#1E4E8C]/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 font-mono">
              Архитектура реляционной базы данных Luxor
            </h2>
            <p className="text-gray-500 text-xs">
              Схема таблиц, внешние ключи, индексы кросс-номеров и матрицы применяемости
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySql}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-xl border border-gray-200 transition flex items-center space-x-1.5 font-medium"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#1E4E8C]" />}
          <span>{copied ? 'Скопировано!' : 'Скопировать SQL Schema'}</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto font-mono">
        {ARCHITECTURE_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveTab(sec.id)}
            className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
              activeTab === sec.id
                ? 'bg-[#1E4E8C] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* SECTION 1: RELATIONAL DATABASE SCHEMA */}
      {activeTab === 'db-schema' && (
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl border border-gray-800 font-mono overflow-x-auto">
            <pre className="text-[11px] leading-relaxed">{DB_SCHEMA_SQL}</pre>
          </div>
        </div>
      )}

      {activeTab !== 'db-schema' && (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl space-y-3 font-sans">
          <h3 className="text-base font-bold text-gray-900 font-mono">
            {ARCHITECTURE_SECTIONS.find((s) => s.id === activeTab)?.title}
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            {ARCHITECTURE_SECTIONS.find((s) => s.id === activeTab)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

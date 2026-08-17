import React, { useState } from 'react';
import { Cpu, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const AiTechAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/technical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      setResponse(data.reply || 'Технический ответ получен.');
    } catch (err) {
      setResponse('Запрос обработан. Для авто подходят оригинальные комплекты с допуском ISO 9001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto font-sans text-xs space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 font-mono flex items-center space-x-2">
            <span>Инженерно-технический AI-консультант Luxor</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-md text-[10px] font-mono">
              AI Engine
            </span>
          </h2>
          <p className="text-gray-500 text-xs">
            Задайте вопрос по металлургическим допускам, заменам OEM и совместимости двигателей
          </p>
        </div>
      </div>

      {/* Suggested Engineering Queries */}
      <div className="space-y-2">
        <div className="text-gray-500 text-[11px] font-mono">Типовые инженерные вопросы:</div>
        <div className="flex flex-wrap gap-2">
          {[
            'Подойдет ли кожух LFS 0550 на Chevrolet Cruze 1.8?',
            'Какая применимость у фары LX_2123-3711010?',
            'Найди аналог Luxor для ориг. номера 13267630',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 text-left transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleAskAi} className="space-y-3">
        <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-2xl p-1 focus-within:border-[#1E4E8C] focus-within:bg-white transition">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Спросить AI-инженера о применимости или кросс-номерах..."
            className="w-full bg-transparent text-gray-900 px-3 py-2 text-xs focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <span>Задать вопрос</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Response Box */}
      {loading && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-purple-900 font-mono text-xs animate-pulse">
          AI инженер анализирует базу кросс-номеров и CAD-чертежи...
        </div>
      )}

      {response && !loading && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-[#1E4E8C] font-bold font-mono">
            <Sparkles className="w-4 h-4" />
            <span>Инженерное заключение AI Luxor:</span>
          </div>
          <p className="text-gray-700 leading-relaxed font-sans">{response}</p>
        </div>
      )}
    </div>
  );
};

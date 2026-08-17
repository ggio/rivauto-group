import React, { useState } from 'react';
import { CadDimension, LuxorPart } from '../types/catalog';
import { Maximize2, Download, Info, CheckCircle2 } from 'lucide-react';

interface BlueprintViewerProps {
  part: LuxorPart;
}

export const BlueprintViewer: React.FC<BlueprintViewerProps> = ({ part }) => {
  const [selectedDim, setSelectedDim] = useState<CadDimension | null>(part?.dimensions?.[0] || null);
  const [activeTab, setActiveTab] = useState<'2d' | '3d' | 'specs'>('2d');

  if (!part) return null;

  return (
    <div className="bg-[#0B0D10] border border-[#2A303C] rounded-xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-[#16191E] px-4 py-3 border-b border-[#2A303C] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#D4AF37]">
            Чертеж CAD / Техническая Эпликация #{part.sku}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#1E232B] text-[10px] font-mono text-gray-400 border border-[#2A303C]">
            DIN/ISO 2768-mK
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-[#0B0D10] p-1 rounded-lg border border-[#2A303C] flex space-x-1">
            <button
              onClick={() => setActiveTab('2d')}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                activeTab === '2d'
                  ? 'bg-[#D4AF37] text-black font-semibold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              2D Чертеж (CAD)
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                activeTab === '3d'
                  ? 'bg-[#D4AF37] text-black font-semibold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              3D Рендер
            </button>
          </div>

          <button
            onClick={() => alert(`Скачивание CAD векторных данных (.STEP / .DXF) для ${part.sku}`)}
            className="p-1.5 bg-[#1E232B] hover:bg-[#2A303C] text-gray-300 rounded border border-[#2A303C] transition flex items-center space-x-1 text-xs font-mono"
            title="Скачать STEP/DXF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">STEP / DXF</span>
          </button>
        </div>
      </div>

      {/* Blueprint Canvas Container */}
      <div className="relative min-h-[380px] sm:min-h-[440px] bg-[#07090C] p-4 flex flex-col justify-between select-none">
        {/* Engineering Blueprint Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1d2533 1px, transparent 1px),
              linear-gradient(to bottom, #1d2533 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* View Mode 2D CAD vs 3D Render */}
        {activeTab === '2d' ? (
          <div className="relative z-10 w-full h-[320px] sm:h-[360px] flex items-center justify-center">
            {/* SVG Vector Drawing depending on part.drawingType */}
            <svg
              viewBox="0 0 600 400"
              className="w-full h-full max-w-[540px] max-h-[360px] drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <defs>
                <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#1E232B" strokeWidth="2" />
                </pattern>
              </defs>

              {/* RENDER SPECIFIC PART VECTOR */}
              {part.drawingType === 'BrakeDisc2D' && (
                <g stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeLinecap="round">
                  {/* Outer Disc Diameter */}
                  <circle cx="300" cy="200" r="140" stroke="#D4AF37" strokeWidth="2" fill="url(#hatch)" opacity="0.6" />
                  <circle cx="300" cy="200" r="140" stroke="#D4AF37" strokeWidth="2.5" />

                  {/* Friction Surface Inner Ring */}
                  <circle cx="300" cy="200" r="95" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Hat Diameter */}
                  <circle cx="300" cy="200" r="60" stroke="#D4AF37" strokeWidth="2" fill="#0B0D10" />

                  {/* Center Bore (CB) */}
                  <circle cx="300" cy="200" r="30" stroke="#D4AF37" strokeWidth="2" fill="#07090C" />

                  {/* PCD Bolt Holes (5x112) */}
                  {[0, 72, 144, 216, 288].map((angle, idx) => {
                    const rad = (angle * Math.PI) / 180;
                    const bx = 300 + 44 * Math.cos(rad);
                    const by = 200 + 44 * Math.sin(rad);
                    return (
                      <g key={idx}>
                        <circle cx={bx} cy={by} r="6" stroke="#E2E8F0" strokeWidth="1.5" fill="#16191E" />
                        <line x1={bx - 9} y1={by} x2={bx + 9} y2={by} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2 2" />
                        <line x1={bx} y1={by - 9} x2={bx} y2={by + 9} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2 2" />
                      </g>
                    );
                  })}

                  {/* Ventilated Vanes Drill Holes */}
                  {[15, 45, 105, 135, 195, 225, 285, 315].map((angle, idx) => {
                    const rad = (angle * Math.PI) / 180;
                    const dx = 300 + 115 * Math.cos(rad);
                    const dy = 200 + 115 * Math.sin(rad);
                    return <circle key={idx} cx={dx} cy={dy} r="3" fill="#D4AF37" opacity="0.8" />;
                  })}

                  {/* Center Axes Lines */}
                  <line x1="120" y1="200" x2="480" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="10 4 2 4" />
                  <line x1="300" y1="40" x2="300" y2="360" stroke="#334155" strokeWidth="1" strokeDasharray="10 4 2 4" />

                  {/* Dimension Callout Lines & Arrows */}
                  <g stroke="#38BDF8" strokeWidth="1">
                    {/* Outer Dia Dimension Line A */}
                    <line x1="160" y1="40" x2="440" y2="40" stroke="#38BDF8" markerEnd="url(#arrow)" />
                    <line x1="160" y1="35" x2="160" y2="60" stroke="#38BDF8" />
                    <line x1="440" y1="35" x2="440" y2="60" stroke="#38BDF8" />
                  </g>
                </g>
              )}

              {part.drawingType === 'BrakePad2D' && (
                <g stroke="#D4AF37" strokeWidth="1.8" fill="none">
                  {/* Brake Pad Backplate */}
                  <path
                    d="M 180 140 C 220 120, 380 120, 420 140 L 450 180 L 450 250 C 420 270, 180 270, 150 250 L 150 180 Z"
                    fill="#16191E"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                  />
                  {/* Friction Material Inset */}
                  <path
                    d="M 195 152 C 230 135, 370 135, 405 152 L 430 185 L 430 238 C 405 255, 195 255, 170 238 L 170 185 Z"
                    fill="url(#hatch)"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                  />
                  {/* Wear Sensor Slot */}
                  <circle cx="300" cy="130" r="8" fill="#0B0D10" stroke="#F5A623" strokeWidth="2" />
                  <line x1="300" y1="130" x2="300" y2="90" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              )}

              {part.drawingType !== 'BrakeDisc2D' && part.drawingType !== 'BrakePad2D' && (
                <g stroke="#D4AF37" strokeWidth="1.8" fill="none">
                  {/* Generic Precision CAD Outline */}
                  <rect x="180" y="100" width="240" height="200" rx="12" fill="#16191E" stroke="#D4AF37" strokeWidth="2" />
                  <circle cx="300" cy="200" r="60" fill="url(#hatch)" stroke="#38BDF8" strokeWidth="1.5" />
                  <circle cx="300" cy="200" r="30" fill="#0B0D10" stroke="#D4AF37" strokeWidth="2" />
                  <line x1="140" y1="200" x2="460" y2="200" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="300" y1="60" x2="300" y2="340" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />
                </g>
              )}

              {/* Interactive Callout Markers on Drawing */}
              {part.dimensions.map((dim) => {
                const isSelected = selectedDim?.id === dim.id;
                const posX = (dim.calloutPosition.x / 100) * 600;
                const posY = (dim.calloutPosition.y / 100) * 400;

                return (
                  <g
                    key={dim.id}
                    onClick={() => setSelectedDim(dim)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <circle
                      cx={posX}
                      cy={posY}
                      r={isSelected ? '14' : '11'}
                      fill={isSelected ? '#D4AF37' : '#16191E'}
                      stroke={isSelected ? '#FFFFFF' : '#D4AF37'}
                      strokeWidth="2"
                    />
                    <text
                      x={posX}
                      y={posY + 4}
                      textAnchor="middle"
                      fill={isSelected ? '#000000' : '#D4AF37'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {dim.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* 3D Render Mode View */
          <div className="relative z-10 w-full h-[320px] sm:h-[360px] flex flex-col items-center justify-center text-center p-6 bg-[#0F1217] rounded-lg border border-[#2A303C]">
            <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37] animate-spin" style={{ animationDuration: '20s' }} />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2A303C] to-[#16191E] border border-[#D4AF37] flex items-center justify-center shadow-2xl">
                <span className="font-mono text-2xl font-bold text-[#D4AF37]">3D</span>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              3D CAD Инспекция Высокого Разрешения
            </h4>
            <p className="text-xs text-gray-400 max-w-md">
              Векторная трехмерная геометрия изделия #{part.sku}. Используется сплав {part.materialCode}. Допуск обработки соответствуют спецификации OEM.
            </p>
          </div>
        )}

        {/* CAD Stamp Block Bottom Right */}
        <div className="relative z-10 bg-[#16191E]/90 backdrop-blur-md p-3 rounded-lg border border-[#2A303C] flex flex-wrap items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-mono">
            <div>
              <div className="text-gray-500 uppercase text-[9px]">Материал</div>
              <div className="text-white font-semibold truncate max-w-[140px]">{part.materialCode}</div>
            </div>
            <div>
              <div className="text-gray-500 uppercase text-[9px]">Масса нетто</div>
              <div className="text-[#D4AF37] font-semibold">{part.weightKg} кг</div>
            </div>
            <div>
              <div className="text-gray-500 uppercase text-[9px]">Покрытие</div>
              <div className="text-gray-300 truncate max-w-[130px]">{part.surfaceFinish || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-500 uppercase text-[9px]">Штрихкод EAN</div>
              <div className="text-gray-300">{part.eanBarcode}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Dimension Detail Bar */}
      {selectedDim && (
        <div className="bg-[#16191E] p-3 border-t border-[#2A303C] flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded bg-[#D4AF37] text-black font-bold flex items-center justify-center">
              {selectedDim.code}
            </span>
            <span className="text-gray-300 font-medium">{selectedDim.label}:</span>
            <span className="text-[#D4AF37] font-bold text-sm">
              {selectedDim.value} {selectedDim.unit}
            </span>
            {selectedDim.tolerance && (
              <span className="text-gray-400 text-[11px] bg-[#0B0D10] px-2 py-0.5 rounded border border-[#2A303C]">
                Допуск: {selectedDim.tolerance}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-emerald-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Лазерный контроль допусков ISO 2768</span>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { LuxorPart } from '../types/catalog';
import { X, FileText, Download, CheckCircle2, ShieldCheck, Hash, Car, Layers, Award, Printer, ShoppingCart } from 'lucide-react';
import { PartImage } from './PartImage';

interface ProductDetailModalProps {
  part: LuxorPart | null;
  onClose: () => void;
  currencySymbol?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ part, onClose, currencySymbol = '₸' }) => {
  const [activeTab, setActiveTab] = useState<'fitment' | 'cross' | 'specs' | 'certs'>('cross');
  const [fitmentSearch, setFitmentSearch] = useState('');

  if (!part) return null;

  const filteredFitments = part.fitments.filter(
    (f) =>
      f.make.toLowerCase().includes(fitmentSearch.toLowerCase()) ||
      f.model.toLowerCase().includes(fitmentSearch.toLowerCase()) ||
      f.engineCode.toLowerCase().includes(fitmentSearch.toLowerCase())
  );

  const displayPrice = part.priceRub || 2750;
  const oldPrice = part.oldPriceRub || Math.round(displayPrice * 1.15);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-gray-200 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-[#1E4E8C]/10 text-[#1E4E8C] border border-[#1E4E8C]/20 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold">
                {part.itemCode || part.sku}
              </span>
              <span className="text-xs font-mono text-gray-600 bg-gray-200 px-2 py-0.5 rounded-md">
                {part.productLine}
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                {part.inStockStatus}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{part.title}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition"
              title="Печать технического паспорта"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white hover:bg-rose-500 hover:text-white text-gray-700 rounded-xl border border-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Product Preview Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="md:col-span-4 h-40 bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-center">
              <PartImage type={part.category + ' ' + part.title} imageUrl={part.imageUrl} className="max-h-36 max-w-full object-contain" />
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Ориентировочная оптовая цена:</div>
                  <div className="text-2xl font-black font-mono text-gray-900">
                    {displayPrice.toLocaleString('ru-RU')} {currencySymbol}{' '}
                    {oldPrice > displayPrice && (
                      <span className="text-xs font-normal text-gray-400 line-through ml-2">
                        {oldPrice.toLocaleString('ru-RU')} {currencySymbol}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Добавить в B2B заказ</span>
                </button>
              </div>

              <p className="text-gray-600 leading-relaxed">{part.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-500">Масса:</span> <strong className="text-gray-900">{part.weightKg} кг</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-500">Штрихкод:</span> <strong className="text-gray-900">{part.eanBarcode}</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-500">Склад:</span> <strong className="text-gray-900">{part.warehouseLocation}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 overflow-x-auto font-mono">
            <button
              onClick={() => setActiveTab('cross')}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap font-bold ${
                activeTab === 'cross'
                  ? 'bg-[#1E4E8C] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Кросс-номера ({part.crossReferences.length})
            </button>
            <button
              onClick={() => setActiveTab('fitment')}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap font-bold ${
                activeTab === 'fitment'
                  ? 'bg-[#1E4E8C] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Применяемость ({part.fitments.length})
            </button>
          </div>

          {/* Tab 1: Cross References */}
          {activeTab === 'cross' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {part.crossReferences.map((cr) => (
                  <div key={cr.id} className="bg-gray-50 border border-gray-200 p-3 rounded-xl font-mono">
                    <div className="text-xs text-[#1E4E8C] font-bold">{cr.brand} ({cr.type})</div>
                    <div className="text-sm font-black text-gray-900">{cr.oemNumber}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Fitments */}
          {activeTab === 'fitment' && (
            <div className="space-y-3">
              <input
                type="text"
                value={fitmentSearch}
                onChange={(e) => setFitmentSearch(e.target.value)}
                placeholder="Фильтр по авто или двигателю..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#1E4E8C]"
              />
              <div className="space-y-2">
                {filteredFitments.map((fit) => (
                  <div key={fit.id} className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{fit.make} {fit.model}</div>
                      <div className="text-gray-500 text-[11px] font-mono">
                        Мотор: {fit.engineCode} | {fit.powerHp} л.с. ({fit.yearStart}-{fit.yearEnd || 'наст.'})
                      </div>
                    </div>
                    <span className="bg-[#1E4E8C]/10 text-[#1E4E8C] px-2.5 py-1 rounded-md text-[11px] font-mono font-bold">
                      {fit.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

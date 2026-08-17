import React, { useState } from 'react';
import { LuxorPart } from '../types/catalog';
import { Copy, Star, Check, Edit, Trash2 } from 'lucide-react';
import { PartImage } from './PartImage';

interface ProductCardProps {
  part: LuxorPart;
  onOpenDetail: (part: LuxorPart) => void;
  isAdmin?: boolean;
  onEditPart?: (part: LuxorPart) => void;
  onDeletePart?: (partId: string) => void;
  currencySymbol?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  part,
  onOpenDetail,
  isAdmin,
  onEditPart,
  onDeletePart,
  currencySymbol = '₸',
}) => {
  const [copied, setCopied] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = part.itemCode || part.sku;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
  };

  const displayPrice = part.priceRub || 2750;
  const oldPrice = part.oldPriceRub || Math.round(displayPrice * 1.15);

  return (
    <div
      onClick={() => onOpenDetail(part)}
      className="bg-white border border-gray-200/90 hover:border-[#1E4E8C] rounded-2xl p-4 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative font-sans"
    >
      {/* Top Image Canvas */}
      <div className="bg-white h-48 w-full rounded-xl border border-gray-100 p-3 flex items-center justify-center relative overflow-hidden mb-3 group-hover:scale-[1.02] transition-transform duration-200">
        <PartImage type={part.category + ' ' + part.title} imageUrl={part.imageUrl} className="max-h-40 max-w-full object-contain" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          <span className="bg-[#1E4E8C]/10 text-[#1E4E8C] text-[10px] font-bold px-2 py-0.5 rounded-md font-mono border border-[#1E4E8C]/20">
            {part.productLine || 'LUXOR'}
          </span>
        </div>

        {/* Admin Quick Action Controls */}
        {isAdmin ? (
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            {onEditPart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPart(part);
                }}
                className="p-1.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition shadow-xs"
                title="Редактировать товар (Админ)"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDeletePart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Удалить товар "${part.title}"?`)) {
                    onDeletePart(part.id);
                  }
                }}
                className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition shadow-xs"
                title="Удалить товар (Админ)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleToggleStar}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition ${
              isStarred ? 'bg-amber-100 text-amber-500' : 'bg-gray-100/80 text-gray-400 hover:text-amber-500'
            }`}
            title="В избранное"
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2 flex-1">
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1E4E8C] transition leading-tight line-clamp-2">
          {part.title}
        </h3>

        {/* Item Code & Copy Row */}
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-600">
          <span className="text-gray-500">Код товара:</span>
          <strong className="text-gray-900 font-bold">{part.itemCode || part.sku}</strong>
          <button
            onClick={handleCopyCode}
            className="text-gray-400 hover:text-[#1E4E8C] transition p-0.5"
            title="Скопировать артикул"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* OEM Cross Reference Badges */}
        <div>
          <div className="text-[11px] text-gray-500 mb-1 font-medium">OEM номер:</div>
          <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
            {part.crossReferences.slice(0, 3).map((cr) => (
              <span
                key={cr.id}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-mono px-2 py-0.5 rounded-md border border-gray-200/60"
              >
                {cr.oemNumber}
              </span>
            ))}
            {part.crossReferences.length > 3 && (
              <span className="bg-gray-100 text-gray-500 text-[10px] font-mono px-1.5 py-0.5 rounded-md">
                +{part.crossReferences.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Price & Button */}
      <div className="pt-4 mt-3 border-t border-gray-100 flex items-end justify-between gap-2">
        <div>
          {oldPrice > displayPrice && (
            <div className="text-[11px] text-gray-400 line-through font-mono">
              {oldPrice.toLocaleString('ru-RU')} {currencySymbol}
            </div>
          )}
          <div className="text-base font-extrabold text-[#0F172A] font-mono leading-none">
            {displayPrice.toLocaleString('ru-RU')} <span className="text-sm font-bold">{currencySymbol}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(part);
          }}
          className="bg-[#1B4E9B] hover:bg-[#153D7A] active:bg-[#0F2D5C] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center space-x-1.5"
        >
          <span>В корзину</span>
        </button>
      </div>
    </div>
  );
};

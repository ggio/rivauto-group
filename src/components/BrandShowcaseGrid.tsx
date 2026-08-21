import React, { useState, useRef } from 'react';
import { BrandItem } from '../types/catalog';
import { INITIAL_BRANDS } from '../data/mockBrands';
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Edit2, X, Upload, Sliders, Image, Sparkles } from 'lucide-react';
import { SiteAppearanceSettings } from '../types/theme';

interface BrandShowcaseGridProps {
  brands: BrandItem[];
  selectedBrandId: string;
  onSelectBrand: (brandId: string) => void;
  customImages?: {
    dextra?: string;
    kaido?: string;
    katsumoto?: string;
    luxor?: string;
  };
  cardHeight?: 'compact' | 'medium' | 'tall';
  customHeightPx?: number;
  badgeText?: string;
  titleText?: string;
  titleFont?: 'mono' | 'sans' | 'serif' | 'unbounded' | 'oswald' | 'russo' | 'montserrat' | 'custom';
  customFontFamily?: string;
  isAdmin?: boolean;
  onUpdateAppearanceSettings?: (updated: Partial<SiteAppearanceSettings>) => void;
  onOpenManageBrands?: () => void;
  onUpdateBrand?: (brandId: string, updatedFields: Partial<BrandItem>) => void;
}

export const BrandShowcaseGrid: React.FC<BrandShowcaseGridProps> = ({
  brands,
  selectedBrandId,
  onSelectBrand,
  customImages,
  cardHeight = 'medium',
  customHeightPx,
  badgeText = 'Официальный портфель брендов RIVAUTO GROUP',
  titleText = 'Собственные Торговые Марки',
  titleFont = 'mono',
  customFontFamily = '',
  isAdmin = false,
  onUpdateAppearanceSettings,
  onOpenManageBrands,
  onUpdateBrand,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal Form State
  const [formTitle, setFormTitle] = useState(titleText);
  const [formBadge, setFormBadge] = useState(badgeText);
  const [formHeightPx, setFormHeightPx] = useState(customHeightPx || 260);
  const [formTitleFont, setFormTitleFont] = useState(titleFont);
  const [formCustomFontFamily, setFormCustomFontFamily] = useState(customFontFamily);

  const [dextraImg, setDextraImg] = useState(customImages?.dextra || '');
  const [kaidoImg, setKaidoImg] = useState(customImages?.kaido || '');
  const [katsumotoImg, setKatsumotoImg] = useState(customImages?.katsumoto || '');
  const [luxorImg, setLuxorImg] = useState(customImages?.luxor || '');

  // Local Brand Details State for Quick Editing
  const [brandEdits, setBrandEdits] = useState<{ [key: string]: { tagline: string; subtitle: string; badgeText: string } }>(() => {
    const initial: { [key: string]: { tagline: string; subtitle: string; badgeText: string } } = {};
    brands.forEach((b) => {
      initial[b.id] = {
        tagline: b.tagline || '',
        subtitle: b.subtitle || '',
        badgeText: b.badgeText || '',
      };
    });
    return initial;
  });

  const dextraFileRef = useRef<HTMLInputElement>(null);
  const kaidoFileRef = useRef<HTMLInputElement>(null);
  const katsumotoFileRef = useRef<HTMLInputElement>(null);
  const luxorFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File, setter: (val: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      // 1. Immediately set raw DataURL for instant visual feedback in UI
      setter(dataUrl);

      // 2. Compress image via HTML Canvas to fit cleanly into storage (<150KB)
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 700; // Optimal resolution for card background thumbnails

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
            setter(compressedDataUrl);
          }
        } catch (err) {
          console.error('Error compressing uploaded image:', err);
        }
      };
      img.onerror = () => {
        // Fallback: keep uncompressed dataUrl if canvas fails
        setter(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateAppearanceSettings) {
      onUpdateAppearanceSettings({
        brandGridTitleText: formTitle,
        brandGridBadgeText: formBadge,
        brandGridTitleFont: formTitleFont,
        brandGridCustomFontFamily: formCustomFontFamily,
        customBrandCardHeightPx: formHeightPx,
        dextraBgImage: dextraImg,
        kaidoBgImage: kaidoImg,
        katsumotoBgImage: katsumotoImg,
        luxorBgImage: luxorImg,
      });
    }

    // Save individual brand edits if handler provided
    if (onUpdateBrand) {
      Object.keys(brandEdits).forEach((bId) => {
        onUpdateBrand(bId, brandEdits[bId]);
      });
    }

    setIsEditModalOpen(false);
  };

  const getTitleFontClass = (fontKey?: string) => {
    switch (fontKey) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'unbounded': return "font-['Unbounded',sans-serif]";
      case 'oswald': return "font-['Oswald',sans-serif]";
      case 'russo': return "font-['Russo_One',sans-serif]";
      case 'montserrat': return "font-['Montserrat',sans-serif]";
      case 'custom': return '';
      case 'mono':
      default:
        return 'font-mono';
    }
  };

  const minHeightClass = 
    cardHeight === 'compact' ? 'min-h-[220px]' :
    cardHeight === 'tall' ? 'min-h-[320px]' : 'min-h-[260px]';

  const cardMinHeightStyle = customHeightPx ? { minHeight: `${customHeightPx}px` } : undefined;

  return (
    <div className="space-y-6 relative">
      {/* Title Header with Green Accent & Metallic Style */}
      <div className="text-center space-y-2 py-4 relative group">
        <div className="flex items-center justify-center space-x-3">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase ${getTitleFontClass(titleFont)}`}
            style={titleFont === 'custom' && customFontFamily ? { fontFamily: customFontFamily } : undefined}
          >
            {titleText}
          </h2>

          {/* EDIT BUTTON (ADMIN ONLY) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setFormTitle(titleText);
                setFormBadge(badgeText);
                setFormTitleFont(titleFont);
                setFormCustomFontFamily(customFontFamily);
                setFormHeightPx(customHeightPx || 260);
                setDextraImg(customImages?.dextra || '');
                setKaidoImg(customImages?.kaido || '');
                setKatsumotoImg(customImages?.katsumoto || '');
                setLuxorImg(customImages?.luxor || '');

                const refreshedBrandEdits: { [key: string]: { tagline: string; subtitle: string; badgeText: string } } = {};
                brands.forEach((b) => {
                  refreshedBrandEdits[b.id] = {
                    tagline: b.tagline || '',
                    subtitle: b.subtitle || '',
                    badgeText: b.badgeText || '',
                  };
                });
                setBrandEdits(refreshedBrandEdits);

                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md transition hover:scale-105"
              title="Редактировать параметры блока 'Собственные торговые марки'"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Редактировать блок</span>
            </button>
          )}
        </div>

        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent mx-auto rounded-full mt-2" />
      </div>

      {/* 4 Brands in ONE LINE Responsive Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {(brands && brands.length > 0 ? brands : INITIAL_BRANDS).map((brand) => {
          const isSelected = selectedBrandId === brand.id;

          if (brand.id === 'dextra') {
            const customImg = customImages?.dextra;
            return (
              <div
                key={brand.id}
                onClick={() => onSelectBrand('dextra')}
                className={`group cursor-pointer rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 aspect-[148/210] flex flex-col justify-between ${
                  customImg ? 'bg-transparent' : 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]'
                } ${
                  isSelected ? 'ring-2 ring-amber-500 scale-[1.02]' : ''
                }`}
                style={cardMinHeightStyle}
              >
                {customImg && (
                  <img
                    src={customImg}
                    alt="Dextra background"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                )}
                <div className={`flex flex-col justify-end h-full ${minHeightClass} relative z-10`}>
                  {/* Bottom Action */}
                  <div className="flex items-center justify-end text-xs mt-auto">
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-amber-400 font-black text-xs font-mono group-hover:bg-amber-400 group-hover:text-slate-950 transition flex items-center space-x-1.5 shadow-md flex-shrink-0 border border-amber-400/30">
                      <span>Открыть</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          if (brand.id === 'kaido') {
            const customImg = customImages?.kaido;
            return (
              <div
                key={brand.id}
                onClick={() => onSelectBrand('kaido')}
                className={`group cursor-pointer rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 aspect-[148/210] flex flex-col justify-between ${
                  customImg ? 'bg-transparent' : 'bg-gradient-to-br from-[#FFF5F5] via-[#FFE4E6] to-[#FECDD3]'
                } ${
                  isSelected ? 'ring-2 ring-rose-500 scale-[1.02]' : ''
                }`}
                style={cardMinHeightStyle}
              >
                {customImg && (
                  <img
                    src={customImg}
                    alt="Kaido background"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                )}
                <div className={`flex flex-col justify-end h-full ${minHeightClass} relative z-10`}>
                  {/* Bottom Action */}
                  <div className="flex items-center justify-end text-xs mt-auto">
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-amber-400 font-black text-xs font-mono group-hover:bg-amber-400 group-hover:text-slate-950 transition flex items-center space-x-1.5 shadow-md flex-shrink-0 border border-amber-400/30">
                      <span>Открыть</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          if (brand.id === 'katsumoto') {
            const customImg = customImages?.katsumoto;
            return (
              <div
                key={brand.id}
                onClick={() => onSelectBrand('katsumoto')}
                className={`group cursor-pointer rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 aspect-[148/210] flex flex-col justify-between ${
                  customImg ? 'bg-transparent' : 'bg-gradient-to-br from-[#FAFAFA] via-[#F4F4F5] to-[#E4E4E7]'
                } ${
                  isSelected ? 'ring-2 ring-red-600 scale-[1.02]' : ''
                }`}
                style={cardMinHeightStyle}
              >
                {customImg && (
                  <img
                    src={customImg}
                    alt="Katsumoto background"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                )}
                <div className={`flex flex-col justify-end h-full ${minHeightClass} relative z-10`}>
                  {/* Bottom Action */}
                  <div className="flex items-center justify-end text-xs mt-auto">
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-amber-400 font-black text-xs font-mono group-hover:bg-amber-400 group-hover:text-slate-950 transition flex items-center space-x-1.5 shadow-md flex-shrink-0 border border-amber-400/30">
                      <span>Открыть</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // LUXOR Card
          const customLuxorImg = customImages?.luxor;
          return (
            <div
              key={brand.id}
              onClick={() => onSelectBrand('luxor')}
              className={`group cursor-pointer rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 aspect-[148/210] flex flex-col justify-between ${
                customLuxorImg ? 'bg-transparent' : 'bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]'
              } ${
                isSelected ? 'ring-2 ring-sky-500 scale-[1.02]' : ''
              }`}
              style={cardMinHeightStyle}
            >
              {customLuxorImg && (
                <img
                  src={customLuxorImg}
                  alt="Luxor background"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
              )}
              <div className={`flex flex-col justify-end h-full ${minHeightClass} relative z-10`}>
                {/* Bottom Action */}
                <div className="flex items-center justify-end text-xs mt-auto">
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-amber-400 font-black text-xs font-mono group-hover:bg-amber-400 group-hover:text-slate-950 transition flex items-center space-x-1.5 shadow-md flex-shrink-0 border border-amber-400/30">
                    <span>Открыть</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BLOCK EDITING MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2 text-amber-600 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Настройка отображения</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-mono uppercase mt-0.5">
                Редактирование блока «Собственные Торговые Марки»
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Здесь вы можете изменить заголовок блока, высоту карточек, их фоновые изображения и текстовое наполнение брендов.
              </p>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-6">
              {/* SECTION 1: BLOCK HEADINGS & FONT */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                  <span>1. Заголовок блока и выбор шрифта</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Главный заголовок блока:
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Собственные Торговые Марки"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Шрифт заголовка блока:
                    </label>
                    <select
                      value={formTitleFont}
                      onChange={(e) => setFormTitleFont(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="mono">Monospace (Системный моноширинный)</option>
                      <option value="sans">Sans-serif (Plus Jakarta Sans)</option>
                      <option value="serif">Serif (Playfair / С засечками)</option>
                      <option value="unbounded">Unbounded (Футуристичный)</option>
                      <option value="oswald">Oswald (Плотный заголовочный)</option>
                      <option value="russo">Russo One (Русский мощный плакатный)</option>
                      <option value="montserrat">Montserrat (Чистый геометрический)</option>
                      <option value="custom">Свой CSS font-family...</option>
                    </select>
                  </div>
                </div>

                {formTitleFont === 'custom' && (
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Укажите ваш CSS font-family (например, "Roboto", "Manrope", Arial, sans-serif):
                    </label>
                    <input
                      type="text"
                      value={formCustomFontFamily}
                      onChange={(e) => setFormCustomFontFamily(e.target.value)}
                      placeholder="'Roboto', sans-serif"
                      className="w-full px-3 py-2 border border-amber-300 rounded-xl text-xs font-mono bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 2: CARD SIZES AND BACKGROUND IMAGES (РАЗМЕРЫ И ФОН КАРТОЧЕК БРЕНДОВ) */}
              <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-amber-700" />
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-amber-950">
                      2. Размеры и фон карточек брендов (Пропорции А5: 148 × 210 мм)
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/90 px-2.5 py-1 rounded-lg border border-amber-300">
                    Формат: А5 (148 × 210 мм)
                  </span>
                </div>

                {/* Card Height & A5 Presets */}
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 font-mono">
                      Пропорции и минимальная высота карточек брендов (А5):
                    </label>
                    <div className="flex space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setFormHeightPx(260)}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-mono font-bold rounded"
                      >
                        А5 Стандарт (260px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormHeightPx(350)}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-mono font-bold rounded"
                      >
                        А5 Крупный (350px)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="180"
                      max="450"
                      step="10"
                      value={formHeightPx}
                      onChange={(e) => setFormHeightPx(parseInt(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-2 bg-amber-100 rounded-lg"
                    />
                    <input
                      type="number"
                      min="150"
                      max="600"
                      value={formHeightPx}
                      onChange={(e) => setFormHeightPx(parseInt(e.target.value) || 260)}
                      className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono font-bold text-center"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Компактный А5 (180px)</span>
                    <span>Классический А5 (260px / 148×210 мм)</span>
                    <span>Высокий А5 (450px)</span>
                  </div>
                </div>

                {/* Background Images for Brand Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                      <Image className="w-3.5 h-3.5 text-amber-700" />
                      <span>Фоновые изображения карточек брендов (Загрузка с ПК или URL):</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dextra Background */}
                    <div className="p-3 bg-white border border-amber-300 rounded-xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900 font-mono">
                        <span>Фон DEXTRA</span>
                        {dextraImg && (
                          <button
                            type="button"
                            onClick={() => setDextraImg('')}
                            className="text-[10px] text-rose-600 hover:underline"
                          >
                            Очистить
                          </button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={dextraImg}
                          onChange={(e) => setDextraImg(e.target.value)}
                          placeholder="URL или загрузите с ПК..."
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => dextraFileRef.current?.click()}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center space-x-1 shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить с ПК</span>
                        </button>
                        <input
                          type="file"
                          ref={dextraFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setDextraImg);
                            e.target.value = '';
                          }}
                        />
                      </div>
                      {dextraImg && (
                        <div className="relative h-12 rounded-lg overflow-hidden border border-amber-300">
                          <img src={dextraImg} alt="Dextra bg" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Kaido Background */}
                    <div className="p-3 bg-white border border-rose-300 rounded-xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-bold text-rose-900 font-mono">
                        <span>Фон KAIDO</span>
                        {kaidoImg && (
                          <button
                            type="button"
                            onClick={() => setKaidoImg('')}
                            className="text-[10px] text-rose-600 hover:underline"
                          >
                            Очистить
                          </button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={kaidoImg}
                          onChange={(e) => setKaidoImg(e.target.value)}
                          placeholder="URL или загрузите с ПК..."
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => kaidoFileRef.current?.click()}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center space-x-1 shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить с ПК</span>
                        </button>
                        <input
                          type="file"
                          ref={kaidoFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setKaidoImg);
                            e.target.value = '';
                          }}
                        />
                      </div>
                      {kaidoImg && (
                        <div className="relative h-12 rounded-lg overflow-hidden border border-rose-300">
                          <img src={kaidoImg} alt="Kaido bg" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Katsumoto Background */}
                    <div className="p-3 bg-white border border-red-300 rounded-xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-bold text-red-900 font-mono">
                        <span>Фон KATSUMOTO</span>
                        {katsumotoImg && (
                          <button
                            type="button"
                            onClick={() => setKatsumotoImg('')}
                            className="text-[10px] text-rose-600 hover:underline"
                          >
                            Очистить
                          </button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={katsumotoImg}
                          onChange={(e) => setKatsumotoImg(e.target.value)}
                          placeholder="URL или загрузите с ПК..."
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => katsumotoFileRef.current?.click()}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center space-x-1 shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить с ПК</span>
                        </button>
                        <input
                          type="file"
                          ref={katsumotoFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setKatsumotoImg);
                            e.target.value = '';
                          }}
                        />
                      </div>
                      {katsumotoImg && (
                        <div className="relative h-12 rounded-lg overflow-hidden border border-red-300">
                          <img src={katsumotoImg} alt="Katsumoto bg" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Luxor Background */}
                    <div className="p-3 bg-white border border-sky-300 rounded-xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-900 font-mono">
                        <span>Фон LUXOR</span>
                        {luxorImg && (
                          <button
                            type="button"
                            onClick={() => setLuxorImg('')}
                            className="text-[10px] text-rose-600 hover:underline"
                          >
                            Очистить
                          </button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={luxorImg}
                          onChange={(e) => setLuxorImg(e.target.value)}
                          placeholder="URL или загрузите с ПК..."
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => luxorFileRef.current?.click()}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center space-x-1 shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить с ПК</span>
                        </button>
                        <input
                          type="file"
                          ref={luxorFileRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setLuxorImg);
                            e.target.value = '';
                          }}
                        />
                      </div>
                      {luxorImg && (
                        <div className="relative h-12 rounded-lg overflow-hidden border border-sky-300">
                          <img src={luxorImg} alt="Luxor bg" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: EDIT BRAND TEXTS */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                    4. Текстовое описание карточек брендов
                  </h4>
                  {onOpenManageBrands && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        onOpenManageBrands();
                      }}
                      className="text-xs text-amber-700 hover:text-amber-900 font-mono font-bold underline"
                    >
                      ⚙️ Полное управление брендами &rarr;
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {brands.map((b) => (
                    <div key={b.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="text-xs font-black font-mono text-slate-900 uppercase flex items-center justify-between">
                        <span>{b.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">ID: {b.id}</span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500">Бейдж:</label>
                        <input
                          type="text"
                          value={brandEdits[b.id]?.badgeText ?? b.badgeText}
                          onChange={(e) =>
                            setBrandEdits({
                              ...brandEdits,
                              [b.id]: {
                                tagline: brandEdits[b.id]?.tagline ?? b.tagline,
                                subtitle: brandEdits[b.id]?.subtitle ?? b.subtitle,
                                badgeText: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500">Таглайн:</label>
                        <input
                          type="text"
                          value={brandEdits[b.id]?.tagline ?? b.tagline}
                          onChange={(e) =>
                            setBrandEdits({
                              ...brandEdits,
                              [b.id]: {
                                tagline: e.target.value,
                                subtitle: brandEdits[b.id]?.subtitle ?? b.subtitle,
                                badgeText: brandEdits[b.id]?.badgeText ?? b.badgeText,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500">Подзаголовок / Описание:</label>
                        <input
                          type="text"
                          value={brandEdits[b.id]?.subtitle ?? b.subtitle}
                          onChange={(e) =>
                            setBrandEdits({
                              ...brandEdits,
                              [b.id]: {
                                tagline: brandEdits[b.id]?.tagline ?? b.tagline,
                                subtitle: e.target.value,
                                badgeText: brandEdits[b.id]?.badgeText ?? b.badgeText,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold rounded-xl transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-black uppercase rounded-xl transition shadow-lg"
                >
                  Сохранить изменения блока
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

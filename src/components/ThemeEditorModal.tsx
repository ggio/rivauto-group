import React, { useState, useEffect } from 'react';
import { SiteAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS } from '../types/theme';
import { BrandLogoBadge } from './BrandLogoBadge';
import { SCREENSHOTS_LIST } from './ScreenshotsGalleryModal';
import { 
  Palette, Type, Layout, Image as ImageIcon, Sparkles, X, Save, RefreshCw, 
  Check, Sliders, Layers, Eye, Smartphone, Monitor, Upload, Ruler, FileImage, Trash2, Info,
  AlignLeft, AlignCenter, AlignRight, Home, Download, Database, ShieldCheck, HardDriveDownload, Archive, Camera, FolderDown
} from 'lucide-react';

interface ThemeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteAppearanceSettings;
  onSaveSettings: (newSettings: SiteAppearanceSettings) => void;
}

// Helper for local image file processing
const handleFileUpload = (
  file: File, 
  onSuccess: (dataUrl: string) => void
) => {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите файл изображения (PNG, JPG, WEBP, SVG, GIF)');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      onSuccess(e.target.result as string);
    }
  };
  reader.readAsDataURL(file);
};

export const ThemeEditorModal: React.FC<ThemeEditorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'kaido' | 'katsumoto' | 'luxor' | 'dextra' | 'fonts' | 'images' | 'styles' | 'specs' | 'backup'>('text');
  const [form, setForm] = useState<SiteAppearanceSettings>({ ...settings });
  const [backupStatus, setBackupStatus] = useState<string>('');

  // Sync form state when modal is opened or settings change
  useEffect(() => {
    if (isOpen) {
      setForm({ ...settings });
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleFileUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) callback(url);
    };
    reader.readAsDataURL(file);
  };

  const renderBrandTabContent = (
    brandId: 'kaido' | 'katsumoto' | 'luxor' | 'dextra',
    brandName: string,
    colorScheme: { bg: string; border: string; text: string; badgeBg: string }
  ) => {
    const heroKey = `${brandId}HeroBanner` as keyof SiteAppearanceSettings;
    const cardKey = `${brandId}BgImage` as keyof SiteAppearanceSettings;
    const headerLogoKey = `${brandId}HeaderLogoUrl` as keyof SiteAppearanceSettings;
    const bannerLogoKey = `${brandId}BannerLogoUrl` as keyof SiteAppearanceSettings;
    const legacyLogoKey = `${brandId}LogoUrl` as keyof SiteAppearanceSettings;

    const titleSizeKey = `${brandId}BannerTitleFontSize` as keyof SiteAppearanceSettings;
    const descSizeKey = `${brandId}BannerDescFontSize` as keyof SiteAppearanceSettings;
    const overlayKey = `${brandId}BannerOverlayOpacity` as keyof SiteAppearanceSettings;
    const alignKey = `${brandId}BannerTextAlign` as keyof SiteAppearanceSettings;
    const paddingKey = `${brandId}BannerPaddingY` as keyof SiteAppearanceSettings;
    const logoHeightKey = `${brandId}BannerLogoHeight` as keyof SiteAppearanceSettings;
    const hideTitleKey = `${brandId}HideBannerTitle` as keyof SiteAppearanceSettings;
    const textColorKey = `${brandId}TextColor` as keyof SiteAppearanceSettings;

    const heroVal = (form[heroKey] as string) || '';
    const cardVal = (form[cardKey] as string) || '';
    
    // Header Logo with legacy fallback
    const headerLogoVal = (form[headerLogoKey] as string) || (form[legacyLogoKey] as string) || '';
    // Banner Floating PNG Logo with legacy fallback
    const bannerLogoVal = (form[bannerLogoKey] as string) || (form[legacyLogoKey] as string) || '';

    const titleSizeVal = (form[titleSizeKey] as number) ?? form.bannerTitleFontSize ?? 44;
    const descSizeVal = (form[descSizeKey] as number) ?? form.bannerDescFontSize ?? 16;
    const overlayVal = (form[overlayKey] as number) ?? form.bannerOverlayOpacity ?? 65;
    const alignVal = (form[alignKey] as 'left' | 'center' | 'right') ?? form.bannerTextAlign ?? 'left';
    const paddingVal = (form[paddingKey] as number) ?? form.bannerPaddingY ?? 48;
    const logoHeightVal = (form[logoHeightKey] as number) ?? form.bannerLogoHeight ?? 60;
    const hideTitleVal = (form[hideTitleKey] as boolean) ?? form.hideBannerTitle ?? false;
    const textColorVal = (form[textColorKey] as string) || '#ffffff';

    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        {/* Header Banner */}
        <div className={`${colorScheme.bg} border ${colorScheme.border} rounded-2xl p-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${colorScheme.badgeBg} text-white font-black font-mono text-sm`}>
              {brandId.toUpperCase()}
            </div>
            <div>
              <h4 className={`font-black font-mono text-sm ${colorScheme.text} uppercase tracking-wider`}>
                Управление дизайном, Текстами & Картинками ({brandName})
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Персональные настройки высоты баннера, шрифтов, раздельной загрузки кнопки в шапке и PNG логотипа на баннере для бренда {brandName}.
              </p>
            </div>
          </div>
        </div>

        {/* 1. РАЗМЕРЫ ВСТУПЛЕНИЯ (ГЛАВНОГО БАННЕРА): ВЫСОТА И ШРИФТЫ */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h5 className="font-mono font-bold text-xs text-amber-300 uppercase tracking-wider">
              1. Размеры Вступления (Главного Баннера): Высота & Шрифты ({brandName})
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {/* Banner Padding / Height */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Высота баннера:</span>
                <strong className="text-amber-400">{paddingVal * 2 + 100}px</strong>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                value={paddingVal}
                onChange={(e) => setForm({ ...form, [paddingKey]: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Title Font Size */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Крупность заголовка:</span>
                <strong className="text-amber-400">{titleSizeVal}px</strong>
              </div>
              <input
                type="range"
                min="24"
                max="72"
                value={titleSizeVal}
                onChange={(e) => setForm({ ...form, [titleSizeKey]: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Description Font Size */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Шрифт описания:</span>
                <strong className="text-sky-400">{descSizeVal}px</strong>
              </div>
              <input
                type="range"
                min="12"
                max="28"
                value={descSizeVal}
                onChange={(e) => setForm({ ...form, [descSizeKey]: Number(e.target.value) })}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Logo Size */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Размер логотипа на баннере:</span>
                <strong className="text-emerald-400">{logoHeightVal}px</strong>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                value={logoHeightVal}
                onChange={(e) => setForm({ ...form, [logoHeightKey]: Number(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Dark Overlay Opacity */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Тень фона (затемнение):</span>
                <strong className="text-rose-400">{overlayVal}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={overlayVal}
                onChange={(e) => setForm({ ...form, [overlayKey]: Number(e.target.value) })}
                className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Text Color Picker */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Цвет текста заголовка и описания:</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="color"
                    value={textColorVal}
                    onChange={(e) => setForm({ ...form, [textColorKey]: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <strong className="text-amber-400 uppercase font-mono text-[11px]">{textColorVal}</strong>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { color: '#ffffff', label: 'Белый' },
                  { color: '#f8fafc', label: 'Светлый' },
                  { color: '#fbbf24', label: 'Янтарь' },
                  { color: '#38bdf8', label: 'Голубой' },
                  { color: '#f43f5e', label: 'Красный' },
                  { color: '#0f172a', label: 'Темный' },
                ].map(({ color, label }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, [textColorKey]: color })}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition ${
                      textColorVal === color ? 'ring-2 ring-amber-400' : ''
                    }`}
                    title={`${label} (${color})`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. РАЗДЕЛЬНАЯ ЗАГРУЗКА: КНОПКА В ШАПКЕ vs PNG ЛОГОТИП НА ГЛАВНОМ БАННЕРЕ */}
        <div className="space-y-4">
          {/* Sub-item A: Кнопка бренда в верхней шапке сайта */}
          <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-mono font-bold text-xs text-gray-950 uppercase">
                    2.1. Загрузка Кнопки бренда в Шапке Сайта ({brandName})
                  </h5>
                  <p className="text-[11px] text-gray-500">
                    Изображение для компактной кнопки переключения в верхней строке навигации (рядом со значками DEXTRA, KAIDO, KATSUMOTO, LUXOR).
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
                Только Шапка
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-2.5">
                <label className="block text-xs font-bold text-gray-800">
                  Загрузите файл кнопки в шапке {brandName} с компьютера (PNG, SVG, WEBP, JPG):
                </label>
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs flex-shrink-0">
                    <Upload className="w-4 h-4 text-indigo-200" />
                    <span>Загрузить кнопку с ПК</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url) => setForm({ 
                            ...form, 
                            [headerLogoKey]: url,
                            // If legacy field empty, keep synced
                            [legacyLogoKey]: form[legacyLogoKey] || url 
                          }));
                        }
                      }}
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Или вставьте URL файла кнопки..."
                    value={headerLogoVal}
                    onChange={(e) => setForm({ ...form, [headerLogoKey]: e.target.value })}
                    className="w-full border border-indigo-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />

                  {headerLogoVal && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, [headerLogoKey]: '' })}
                      className="p-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition border border-red-300 flex-shrink-0"
                      title="Удалить / Сбросить к вектору"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview for Header Button */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 flex flex-col items-center justify-center min-h-[85px]">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Вид кнопки в шапке:
                </span>
                <div className="h-9 px-2 rounded-xl bg-black border border-slate-700 flex items-center justify-center">
                  <BrandLogoBadge brandId={brandId} customLogoUrl={headerLogoVal} forceCustom={!!headerLogoVal} className="h-7 w-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Sub-item B: Прозрачный PNG Логотип на главном баннере бренда */}
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-mono font-bold text-xs text-gray-950 uppercase">
                    2.2. Загрузка PNG Логотипа на Главном Баннере ({brandName})
                  </h5>
                  <p className="text-[11px] text-gray-500">
                    Большой логотип (PNG с прозрачным фоном, SVG, WEBP), который отображается внутри вступительного баннера бренда с возможностью перетаскивания и настройки высоты.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                Только Баннер
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-2.5">
                <label className="block text-xs font-bold text-gray-800">
                  Загрузите файл PNG логотипа баннера {brandName} с компьютера:
                </label>
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-xs flex-shrink-0">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Загрузить логотип баннера с ПК</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url) => setForm({ 
                            ...form, 
                            [bannerLogoKey]: url,
                            // If legacy field empty, keep synced
                            [legacyLogoKey]: form[legacyLogoKey] || url
                          }));
                        }
                      }}
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Или вставьте URL-адрес PNG логотипа..."
                    value={bannerLogoVal}
                    onChange={(e) => setForm({ ...form, [bannerLogoKey]: e.target.value })}
                    className="w-full border border-emerald-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />

                  {bannerLogoVal && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, [bannerLogoKey]: '' })}
                      className="p-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition border border-red-300 flex-shrink-0"
                      title="Удалить логотип с баннера"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview for Banner Floating Logo */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 flex flex-col items-center justify-center min-h-[85px]">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Вид логотипа на баннере:
                </span>
                <div className="h-12 px-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                  {bannerLogoVal ? (
                    <img src={bannerLogoVal} alt={`${brandName} Banner Logo`} className="h-9 w-auto object-contain filter drop-shadow-md" />
                  ) : (
                    <BrandLogoBadge brandId={brandId} customLogoUrl={headerLogoVal} className="h-8 w-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. КАРТИНКИ БРЕНДА: БАННЕР СТРАНИЦЫ VS КАРТОЧКА НА ГЛАВНОЙ */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-amber-200 pb-2">
            <ImageIcon className="w-4 h-4 text-amber-700" />
            <h5 className="font-mono font-bold text-xs text-amber-950 uppercase">
              3. Раздельные Картинки: Главный баннер бренда VS Карточка на Главной
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dedicated Page Hero Banner Image */}
            <div className="bg-white p-4 rounded-xl border border-amber-300 space-y-2 shadow-xs">
              <label className="block text-xs font-bold text-amber-950 font-mono uppercase">
                🖼️ Главный фоновый баннер на странице бренда {brandName}
              </label>
              <p className="text-[11px] text-gray-600">
                Большое фоновое изображение шапки, которое отображается вверху на личной странице бренда.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <label className="cursor-pointer bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0">
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>Загрузить баннер</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => setForm({ ...form, [heroKey]: url }));
                      }
                    }}
                  />
                </label>
                <input
                  type="url"
                  placeholder="URL баннера..."
                  value={heroVal}
                  onChange={(e) => setForm({ ...form, [heroKey]: e.target.value })}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              {heroVal && (
                <div className="pt-1">
                  <img src={heroVal} alt="Hero Banner" className="w-full h-16 object-cover rounded-lg border border-amber-300" />
                </div>
              )}
            </div>

            {/* Dedicated Main Page Card Background Image */}
            <div className="bg-white p-4 rounded-xl border border-amber-300 space-y-2 shadow-xs">
              <label className="block text-xs font-bold text-amber-950 font-mono uppercase">
                🎴 Картинка карточки в блоке 'Собственные торговые марки' (Главная)
              </label>
              <p className="text-[11px] text-gray-600">
                Изображение для 1 из 4 вертикальных карточек на Главной странице сайта.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1.5 flex-shrink-0">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Загрузить карточку</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => setForm({ ...form, [cardKey]: url }));
                      }
                    }}
                  />
                </label>
                <input
                  type="url"
                  placeholder="URL карточки..."
                  value={cardVal}
                  onChange={(e) => setForm({ ...form, [cardKey]: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              {cardVal && (
                <div className="pt-1">
                  <img src={cardVal} alt="Card Background" className="w-full h-16 object-cover rounded-lg border border-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. РАЗМЕЩЕНИЕ ЗАГОЛОВКА И КОНТЕНТА НА ГЛАВНОМ БАННЕРЕ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
            <AlignLeft className="w-4 h-4 text-purple-600" />
            <h5 className="font-mono font-bold text-xs text-gray-900 uppercase">
              4. Размещение заголовка и контента на Главном баннере ({brandName})
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Alignment Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">Выравнивание всего контента и логотипа:</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [alignKey]: 'left' })}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border transition ${
                    alignVal === 'left' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-gray-300'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Слева</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, [alignKey]: 'center' })}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border transition ${
                    alignVal === 'center' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-gray-300'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                  <span>По центру</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, [alignKey]: 'right' })}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border transition ${
                    alignVal === 'right' ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-gray-300'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                  <span>Справа</span>
                </button>
              </div>
            </div>

            {/* Hide/Show Title Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">Отображение названия бренда на баннере:</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, [hideTitleKey]: !hideTitleVal })}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition border ${
                  hideTitleVal
                    ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                }`}
              >
                <span>{hideTitleVal ? '🙈 Название бренда СКРЫТО на баннере' : '👁️ Название бренда ОТОБРАЖАЕТСЯ на баннере'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Сбросить все настройки оформления и текста к исходным заводским значению?')) {
      setForm(DEFAULT_APPEARANCE_SETTINGS);
      onSaveSettings(DEFAULT_APPEARANCE_SETTINGS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black font-mono tracking-tight text-white">
                  Управление дизайном, Текстами & Картинками (CMS Админ)
                </h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold uppercase rounded-md">
                  PRO EDIT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Загрузка картинок с ПК/телефона, настройка шрифтов, текстов и точные размеры элементов (px и мм)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-2 border-b border-gray-200 flex items-center space-x-2 font-mono text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'text'
                ? 'bg-white text-slate-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            <Type className="w-4 h-4 text-emerald-600" />
            <span>1. Главные Тексты</span>
          </button>

          {/* KAIDO TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('kaido')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'kaido'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 font-extrabold'
            }`}
          >
            <Sliders className="w-4 h-4 text-rose-500" />
            <span>🔴 KAIDO (Дизайн & Баннер)</span>
          </button>

          {/* KATSUMOTO TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('katsumoto')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'katsumoto'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 font-extrabold'
            }`}
          >
            <Sliders className="w-4 h-4 text-red-500" />
            <span>🈹 KATSUMOTO (Дизайн & Баннер)</span>
          </button>

          {/* LUXOR TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('luxor')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'luxor'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 font-extrabold'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>👑 LUXOR (Дизайн & Баннер)</span>
          </button>

          {/* DEXTRA TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('dextra')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'dextra'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 font-extrabold'
            }`}
          >
            <Sliders className="w-4 h-4 text-sky-500" />
            <span>⚙️ DEXTRA (Дизайн & Баннер)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fonts')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'fonts'
                ? 'bg-white text-slate-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Шрифты & Цвета</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-white text-slate-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-sky-600" />
            <span>Загрузка Картинок</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('styles')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'styles'
                ? 'bg-white text-slate-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>Стили и Размеры</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100 font-extrabold'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>📐 Справочник (px & мм)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-indigo-600 text-white shadow-xs font-black'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 font-extrabold'
            }`}
          >
            <Archive className="w-4 h-4 text-indigo-600" />
            <span>💾 Полный Бэкап & Экспорт (JSON)</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-sans">
          {/* BRAND DEDICATED TABS */}
          {activeTab === 'kaido' && renderBrandTabContent(
            'kaido',
            'KAIDO (Япония)',
            { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-950', badgeBg: 'bg-rose-600' }
          )}

          {activeTab === 'katsumoto' && renderBrandTabContent(
            'katsumoto',
            'KATSUMOTO (Япония)',
            { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-950', badgeBg: 'bg-red-600' }
          )}

          {activeTab === 'luxor' && renderBrandTabContent(
            'luxor',
            'LUXOR (Корея)',
            { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-950', badgeBg: 'bg-amber-500' }
          )}

          {activeTab === 'dextra' && renderBrandTabContent(
            'dextra',
            'DEXTRA (Германия)',
            { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-950', badgeBg: 'bg-sky-600' }
          )}
          {/* TAB 1: TEXTS & CAPTIONS */}
          {activeTab === 'text' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 flex items-start space-x-3">
                <Type className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-mono">Глобальные тексты портала</h4>
                  <p className="text-[11px] text-emerald-800">
                    Измените любые названия, бегущие строки, главные заголовки и описания сайта.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Название Холдинга / Сайта (Шапка)
                </label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Название кнопки «Вся Группа» в шапке (Навигация)
                </label>
                <input
                  type="text"
                  placeholder="Вся Группа"
                  value={form.allGroupNavTitle || ''}
                  onChange={(e) => setForm({ ...form, allGroupNavTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-xs"
                />
              </div>

              {/* Form & Shape of "All Group" button */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900 font-mono text-xs">
                    🎨 Форма, Цвета и Стиль кнопки «Вся Группа»
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                    Живой предпросмотр
                  </span>
                </div>

                {/* Shape Selector */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Форма кнопки (Закругление):</span>
                  <div className="grid grid-cols-5 gap-1.5 text-xs">
                    {[
                      { id: 'rounded-none', label: 'Острые', badge: '0px' },
                      { id: 'rounded-lg', label: 'Сглаженные', badge: '8px' },
                      { id: 'rounded-xl', label: 'Стандарт', badge: '12px' },
                      { id: 'rounded-2xl', label: 'Мягкие', badge: '16px' },
                      { id: 'rounded-full', label: 'Овал / Pill', badge: '50%' },
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => setForm({ ...form, allGroupBtnShape: shape.id as any })}
                        className={`p-2 border text-center transition font-mono ${shape.id} ${
                          (form.allGroupBtnShape || 'rounded-xl') === shape.id
                            ? 'bg-slate-900 text-emerald-400 border-slate-900 font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[10px] truncate">{shape.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Цветовая гамма и стиль:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    {[
                      { id: 'dark-emerald', label: 'Угольно-изумрудный', class: 'bg-slate-900 text-emerald-400' },
                      { id: 'emerald', label: 'Яркий Изумруд', class: 'bg-emerald-600 text-white' },
                      { id: 'blue-navy', label: 'Темно-синий OES', class: 'bg-blue-900 text-sky-200' },
                      { id: 'gradient', label: 'Градиент Сине-Зеленый', class: 'bg-gradient-to-r from-emerald-600 to-sky-700 text-white' },
                      { id: 'amber-gold', label: 'Золотой Янтарь', class: 'bg-amber-500 text-slate-950' },
                      { id: 'rose-red', label: 'Рубиновый Красный', class: 'bg-rose-700 text-white' },
                      { id: 'outline', label: 'Контур с рамкой', class: 'border-2 border-slate-900 text-slate-900 bg-white' },
                      { id: 'custom', label: 'Собственные цвета', class: 'bg-slate-200 text-slate-900' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, allGroupBtnTheme: t.id as any })}
                        className={`p-2 rounded-xl text-left border transition text-[11px] font-bold ${t.class} ${
                          (form.allGroupBtnTheme || 'dark-emerald') === t.id
                            ? 'ring-2 ring-emerald-500 ring-offset-1 border-transparent shadow-xs'
                            : 'border-slate-300 opacity-90 hover:opacity-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers if 'custom' theme is selected */}
                {form.allGroupBtnTheme === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-slate-300">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Цвет фона кнопки:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={form.allGroupBtnCustomBg || '#0f172a'}
                          onChange={(e) => setForm({ ...form, allGroupBtnCustomBg: e.target.value })}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.allGroupBtnCustomBg || '#0f172a'}
                          onChange={(e) => setForm({ ...form, allGroupBtnCustomBg: e.target.value })}
                          className="w-full px-2 py-1 text-xs font-mono border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Цвет текста кнопки:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={form.allGroupBtnCustomText || '#34d399'}
                          onChange={(e) => setForm({ ...form, allGroupBtnCustomText: e.target.value })}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.allGroupBtnCustomText || '#34d399'}
                          onChange={(e) => setForm({ ...form, allGroupBtnCustomText: e.target.value })}
                          className="w-full px-2 py-1 text-xs font-mono border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Custom Image/Logo View for "Вся Группа" Button from PC */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 font-mono">
                      🖼️ Загрузить индивидуальный логотип / вид кнопки с ПК (PNG / SVG):
                    </span>
                    {form.allGroupLogoUrl && (
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">✓ Загружено</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={form.allGroupLogoUrl || ''}
                      onChange={(e) => setForm({ ...form, allGroupLogoUrl: e.target.value })}
                      placeholder="Ссылка или выберите файл с ПК"
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-slate-50 font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Загрузить с ПК</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => setForm({ ...form, allGroupLogoUrl: url }));
                          }
                        }}
                      />
                    </label>
                    {form.allGroupLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, allGroupLogoUrl: '' })}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition shrink-0"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Live Button Preview */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 font-mono">Вид кнопки в шапке:</span>
                  <div
                    style={
                      form.allGroupBtnTheme === 'custom'
                        ? { backgroundColor: form.allGroupBtnCustomBg || '#0f172a', color: form.allGroupBtnCustomText || '#34d399' }
                        : {}
                    }
                    className={`flex items-center space-x-1.5 px-4 py-2 font-mono text-xs font-bold shadow-xs transition ${form.allGroupBtnShape || 'rounded-xl'} ${
                      form.allGroupBtnTheme === 'emerald'
                        ? 'bg-emerald-600 text-white'
                        : form.allGroupBtnTheme === 'blue-navy'
                        ? 'bg-blue-900 text-sky-200'
                        : form.allGroupBtnTheme === 'gradient'
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white'
                        : form.allGroupBtnTheme === 'amber-gold'
                        ? 'bg-amber-500 text-slate-950'
                        : form.allGroupBtnTheme === 'outline'
                        ? 'border-2 border-slate-900 text-slate-900 bg-transparent'
                        : form.allGroupBtnTheme === 'rose-red'
                        ? 'bg-rose-700 text-white'
                        : form.allGroupBtnTheme === 'custom'
                        ? ''
                        : 'bg-slate-900 text-emerald-400'
                    }`}
                  >
                    {form.allGroupLogoUrl ? (
                      <img src={form.allGroupLogoUrl} alt="Вся Группа" className="h-5 w-auto object-contain flex-shrink-0" />
                    ) : (
                      <Home className="w-4 h-4" />
                    )}
                    <span>{form.allGroupNavTitle || 'Вся Группа'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Логотип в шапке сайта
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center space-x-2 shadow-xs">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Загрузить PNG с компьютера</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              alert('Размер файла превышает 3 МБ. Пожалуйста, выберите меньший файл.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setForm({ ...form, siteLogoUrl: event.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {form.siteLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, siteLogoUrl: '' })}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 rounded bg-rose-50 border border-rose-200 transition"
                      >
                        Сбросить логотип
                      </button>
                    )}
                  </div>

                  {form.siteLogoUrl ? (
                    <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center space-x-3">
                      <span className="text-xs font-bold text-slate-500 font-mono">Предпросмотр:</span>
                      <img src={form.siteLogoUrl} alt="Logo preview" className="h-8 w-auto object-contain bg-white p-1 rounded border border-slate-200" />
                    </div>
                  ) : null}

                  <input
                    type="text"
                    placeholder="Или вставьте URL картинки (https://...)"
                    value={form.siteLogoUrl || ''}
                    onChange={(e) => setForm({ ...form, siteLogoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-500">
                    Оставьте пустым для использования стандартного векторного логотипа RIVAUTO GROUP.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Подзаголовок / Слоган портала
                </label>
                <input
                  type="text"
                  value={form.siteTagline}
                  onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Заголовок блока "Популярные позиции всех брендов"
                </label>
                <input
                  type="text"
                  placeholder="ПОПУЛЯРНЫЕ ПОЗИЦИИ ВСЕХ БРЕНДОВ"
                  value={form.popularBlockTitle || ''}
                  onChange={(e) => setForm({ ...form, popularBlockTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                <label className="block font-bold text-slate-900 font-mono text-xs uppercase tracking-wider">
                  🇰🇿 Валюта отображения цен в каталоге
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {['₸', 'тенге', '₸ (тенге)', 'Руб.', '$'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setForm({ ...form, currencySymbol: sym })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                        (form.currencySymbol || '₸') === sym
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Своя валюта (например: ₸ или тенге)"
                  value={form.currencySymbol || '₸'}
                  onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold bg-white text-xs font-mono"
                />
                <p className="text-[11px] text-slate-600">
                  Эта валюта отображается во всех карточках товаров, популярном блоке и детальных паспортах деталей.
                </p>
              </div>

              {/* External Brand Links Redirects */}
              <div className="p-3.5 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-3">
                <label className="block font-bold text-slate-900 font-mono text-xs uppercase tracking-wider">
                  🔗 Перенаправление на внешние сайты брендов (DEXTRA, KAIDO и др.)
                </label>
                <p className="text-[11px] text-slate-600">
                  Если указать URL адрес (например, <code className="bg-sky-100 text-sky-800 px-1 rounded">https://dextra-auto.ru</code>), при клике на бренд DEXTRA пользователь сразу перейдет на внешний сайт.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 font-mono mb-1">
                      Ссылка для бренда DEXTRA:
                    </label>
                    <input
                      type="url"
                      placeholder="https://dextra-auto.ru"
                      value={form.dextraExternalUrl || ''}
                      onChange={(e) => setForm({ ...form, dextraExternalUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 font-mono mb-1">
                      Ссылка для бренда KAIDO:
                    </label>
                    <input
                      type="url"
                      placeholder="https://kaido-parts.ru"
                      value={form.kaidoExternalUrl || ''}
                      onChange={(e) => setForm({ ...form, kaidoExternalUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 font-mono mb-1">
                      Ссылка для бренда KATSUMOTO:
                    </label>
                    <input
                      type="url"
                      placeholder="https://katsumoto.ru"
                      value={form.katsumotoExternalUrl || ''}
                      onChange={(e) => setForm({ ...form, katsumotoExternalUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 font-mono mb-1">
                      Ссылка для бренда LUXOR:
                    </label>
                    <input
                      type="url"
                      placeholder="https://luxor-parts.ru"
                      value={form.luxorExternalUrl || ''}
                      onChange={(e) => setForm({ ...form, luxorExternalUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Текст верхней информационной полосы (Бегущая строка / Акция)
                </label>
                <input
                  type="text"
                  value={form.topNoticeText}
                  onChange={(e) => setForm({ ...form, topNoticeText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Главный заголовок на Главной странице (Hero Headline)
                </label>
                <textarea
                  rows={2}
                  value={form.heroHeadline}
                  onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Главный подзаголовок на Главной странице (Hero Subheadline)
                </label>
                <textarea
                  rows={2}
                  value={form.heroSubheadline}
                  onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Hero Size Controls (Banner Height & Typography Sizes) */}
              <div className="pt-3 border-t border-gray-200 space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-emerald-700" />
                  <label className="block font-bold text-slate-900 font-mono text-xs uppercase tracking-wider">
                    📐 Размеры Вступления (Главного Баннера): Высота & Шрифты
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hero Banner Height */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Высота Баннера Вступления:</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {form.heroBannerHeightPx || 420} px / {Math.round((form.heroBannerHeightPx || 420) * 0.2646)} мм
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="250"
                        max="700"
                        step="10"
                        value={form.heroBannerHeightPx || 420}
                        onChange={(e) => setForm({ ...form, heroBannerHeightPx: parseInt(e.target.value) || 420 })}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="200"
                        max="900"
                        value={form.heroBannerHeightPx || 420}
                        onChange={(e) => setForm({ ...form, heroBannerHeightPx: parseInt(e.target.value) || 420 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Title Font Size */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Размер шрифта Заголовка:</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {form.heroTitleFontSizePx || 40} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="20"
                        max="64"
                        step="2"
                        value={form.heroTitleFontSizePx || 40}
                        onChange={(e) => setForm({ ...form, heroTitleFontSizePx: parseInt(e.target.value) || 40 })}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="16"
                        max="80"
                        value={form.heroTitleFontSizePx || 40}
                        onChange={(e) => setForm({ ...form, heroTitleFontSizePx: parseInt(e.target.value) || 40 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Subtitle Font Size */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Размер шрифта Подзаголовка:</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {form.heroSubtitleFontSizePx || 15} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="12"
                        max="28"
                        step="1"
                        value={form.heroSubtitleFontSizePx || 15}
                        onChange={(e) => setForm({ ...form, heroSubtitleFontSizePx: parseInt(e.target.value) || 15 })}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="10"
                        max="36"
                        value={form.heroSubtitleFontSizePx || 15}
                        onChange={(e) => setForm({ ...form, heroSubtitleFontSizePx: parseInt(e.target.value) || 15 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Vertical Padding */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Вертикальные отступы баннера:</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {form.heroPaddingYPx || 40} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="16"
                        max="120"
                        step="4"
                        value={form.heroPaddingYPx || 40}
                        onChange={(e) => setForm({ ...form, heroPaddingYPx: parseInt(e.target.value) || 40 })}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="8"
                        max="160"
                        value={form.heroPaddingYPx || 40}
                        onChange={(e) => setForm({ ...form, heroPaddingYPx: parseInt(e.target.value) || 40 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Text X Offset (Drag Position X) */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Смещение Текста X:</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {form.heroTextOffsetX || 0} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="-400"
                        max="400"
                        step="5"
                        value={form.heroTextOffsetX || 0}
                        onChange={(e) => setForm({ ...form, heroTextOffsetX: parseInt(e.target.value) || 0 })}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="-600"
                        max="600"
                        value={form.heroTextOffsetX || 0}
                        onChange={(e) => setForm({ ...form, heroTextOffsetX: parseInt(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Text Y Offset (Drag Position Y) */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Смещение Текста Y:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {form.heroTextOffsetY || 0} px
                        </span>
                        {(form.heroTextOffsetX !== 0 || form.heroTextOffsetY !== 0) && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, heroTextOffsetX: 0, heroTextOffsetY: 0 })}
                            className="text-[11px] text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded font-bold transition"
                          >
                            Сброс (0,0)
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="-250"
                        max="250"
                        step="5"
                        value={form.heroTextOffsetY || 0}
                        onChange={(e) => setForm({ ...form, heroTextOffsetY: parseInt(e.target.value) || 0 })}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="-400"
                        max="400"
                        value={form.heroTextOffsetY || 0}
                        onChange={(e) => setForm({ ...form, heroTextOffsetY: parseInt(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Search X Offset */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Смещение Поиска X:</span>
                      <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {form.heroSearchOffsetX || 0} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="-400"
                        max="400"
                        step="5"
                        value={form.heroSearchOffsetX || 0}
                        onChange={(e) => setForm({ ...form, heroSearchOffsetX: parseInt(e.target.value) || 0 })}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="-600"
                        max="600"
                        value={form.heroSearchOffsetX || 0}
                        onChange={(e) => setForm({ ...form, heroSearchOffsetX: parseInt(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Search Y Offset */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Смещение Поиска Y:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {form.heroSearchOffsetY || 0} px
                        </span>
                        {(form.heroSearchOffsetX !== 0 || form.heroSearchOffsetY !== 0) && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, heroSearchOffsetX: 0, heroSearchOffsetY: 0 })}
                            className="text-[11px] text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded font-bold transition"
                          >
                            Сброс (0,0)
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="-250"
                        max="250"
                        step="5"
                        value={form.heroSearchOffsetY || 0}
                        onChange={(e) => setForm({ ...form, heroSearchOffsetY: parseInt(e.target.value) || 0 })}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="-400"
                        max="400"
                        value={form.heroSearchOffsetY || 0}
                        onChange={(e) => setForm({ ...form, heroSearchOffsetY: parseInt(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Hero PNG Logo Settings */}
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 flex items-center space-x-2">
                      <span>🖼️ Прозрачный PNG Логотип на баннере</span>
                    </h5>
                    {form.heroLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, heroLogoUrl: '' })}
                        className="text-[11px] text-red-600 hover:text-red-800 font-mono font-bold underline"
                      >
                        Удалить логотип
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-700">
                        PNG Логотип (или прозрачный знак):
                      </label>
                      <label className="cursor-pointer text-[11px] font-mono font-bold text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded-lg transition inline-flex items-center space-x-1">
                        <span>📁 Загрузить с ПК</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                if (dataUrl) setForm({ ...form, heroLogoUrl: dataUrl });
                              };
                              reader.readAsDataURL(file);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={form.heroLogoUrl || ''}
                      onChange={(e) => setForm({ ...form, heroLogoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png или загрузите с ПК"
                      className="w-full px-3 py-1.5 border border-purple-300 rounded-xl text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      💡 На баннере появляется интерактивный безрамочный блок. Вы можете прямо перетаскивать его мышью, изменять его размер и прозрачность.
                    </p>
                  </div>

                  {form.heroLogoUrl && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* Logo Width */}
                      <div className="p-2.5 bg-white rounded-xl border border-purple-200 space-y-1">
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span className="text-slate-800">Размер (ширина):</span>
                          <span className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                            {form.heroLogoWidthPx || 200} px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="600"
                          step="10"
                          value={form.heroLogoWidthPx || 200}
                          onChange={(e) => setForm({ ...form, heroLogoWidthPx: parseInt(e.target.value) || 200 })}
                          className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                        />
                      </div>

                      {/* Logo Opacity */}
                      <div className="p-2.5 bg-white rounded-xl border border-purple-200 space-y-1">
                        <div className="flex justify-between items-center text-xs font-mono font-bold">
                          <span className="text-slate-800">Прозрачность:</span>
                          <span className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                            {form.heroLogoOpacity ?? 100}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={form.heroLogoOpacity ?? 100}
                          onChange={(e) => setForm({ ...form, heroLogoOpacity: parseInt(e.target.value) || 100 })}
                          className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                        />
                      </div>

                      {/* Position Reset */}
                      <div className="p-2.5 bg-white rounded-xl border border-purple-200 flex flex-col justify-between">
                        <span className="text-xs font-mono font-bold text-slate-800">Позиция логотипа:</span>
                        <div className="text-[11px] font-mono text-slate-500">
                          X: {form.heroLogoOffsetX || 0}px | Y: {form.heroLogoOffsetY || 0}px
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, heroLogoOffsetX: 0, heroLogoOffsetY: 0 })}
                          className="w-full py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-mono text-[11px] font-bold rounded-lg transition mt-1"
                        >
                          Сбросить позицию (0,0)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Alignment Control */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-slate-800 font-mono mb-1.5 text-xs uppercase tracking-wider">
                  Размещение заголовка и контента на Главном баннере:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'left', label: 'Слева', icon: AlignLeft },
                    { id: 'center', label: 'По центру', icon: AlignCenter },
                    { id: 'right', label: 'Справа', icon: AlignRight },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = (form.heroTextAlignment || 'center') === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm({ ...form, heroTextAlignment: item.id as any })}
                        className={`p-2.5 border-2 rounded-xl flex items-center justify-center space-x-2 transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                            : 'border-gray-200 bg-white text-slate-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-gray-500'}`} />
                        <span className="text-xs font-mono">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-2">
                <label className="block font-bold text-slate-800 font-mono text-sm">
                  Управление видимостью кнопок и блоков Главного баннера:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={!form.hideHeroSubheadline}
                      onChange={(e) => setForm({ ...form, hideHeroSubheadline: !e.target.checked })}
                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">Отображать подзаголовок</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={!form.hideHeroSearch}
                      onChange={(e) => setForm({ ...form, hideHeroSearch: !e.target.checked })}
                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">Кнопка & Строка поиска (OEM)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={!form.hideHeroStats}
                      onChange={(e) => setForm({ ...form, hideHeroStats: !e.target.checked })}
                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">Блок карточек статистики</span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={!form.hideHeroBadge}
                      onChange={(e) => setForm({ ...form, hideHeroBadge: !e.target.checked })}
                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">Верхняя плашка RIVAUTO GROUP</span>
                  </label>
                </div>
              </div>

              {/* B2B / Wholesale Form Customization */}
              <div className="pt-4 border-t border-gray-200 space-y-3 bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🤝</span>
                    <h4 className="font-bold font-mono text-slate-900 text-sm uppercase tracking-tight">
                      Блок «Оптовое сотрудничество с RIVAUTO GROUP» (Форма B2B)
                    </h4>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1 rounded-xl border border-amber-300">
                    <input
                      type="checkbox"
                      checked={!form.wholesaleHideBlock}
                      onChange={(e) => setForm({ ...form, wholesaleHideBlock: !e.target.checked })}
                      className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800 font-mono">Отображать блок на сайте</span>
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-1 text-xs">
                    Заголовок оптового блока:
                  </label>
                  <input
                    type="text"
                    placeholder="ОПТОВОЕ СОТРУДНИЧЕСТВО С RIVAUTO GROUP"
                    value={form.wholesaleTitle || ''}
                    onChange={(e) => setForm({ ...form, wholesaleTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono font-bold bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-1 text-xs">
                    Подзаголовок / Описание предложения:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Получите прямой прайс-лист для дистрибьюторов на 4 бренда: DEXTRA, KAIDO, KATSUMOTO, LUXOR."
                    value={form.wholesaleSubtitle || ''}
                    onChange={(e) => setForm({ ...form, wholesaleSubtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 font-mono mb-1 text-xs">
                      Текст кнопки отправки:
                    </label>
                    <input
                      type="text"
                      placeholder="ЗАПРОСИТЬ КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ"
                      value={form.wholesaleButtonText || ''}
                      onChange={(e) => setForm({ ...form, wholesaleButtonText: e.target.value })}
                      className="w-full px-3 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono font-bold bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 font-mono mb-1 text-xs">
                      Текст успешной отправки заявки:
                    </label>
                    <input
                      type="text"
                      placeholder="Заявка успешно отправлена! Наш отдел оптовых продаж свяжется с вами в течение 15 минут."
                      value={form.wholesaleSuccessText || ''}
                      onChange={(e) => setForm({ ...form, wholesaleSuccessText: e.target.value })}
                      className="w-full px-3 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FONTS & COLOR THEMES */}
          {activeTab === 'fonts' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-mono">Выбор Гарнитуры Шрифтов и Цветовой Палитры</h4>
                  <p className="text-[11px] text-amber-800">
                    Настройте типографику сайта и основной цвет элементов управления.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-1">
                    Шрифт Заголовков (Heading Font)
                  </label>
                  <select
                    value={form.headingFont}
                    onChange={(e) => setForm({ ...form, headingFont: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value="mono">JetBrains Mono / Technical Monospace (Индустриальный Моно)</option>
                    <option value="jakarta">Plus Jakarta Sans (Современный Геометрический)</option>
                    <option value="playfair">Playfair Display (Премиум Классика Serif)</option>
                    <option value="unbounded">Unbounded / Modern Bold</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-1">
                    Основной Шрифт Текста (Body Font)
                  </label>
                  <select
                    value={form.bodyFont}
                    onChange={(e) => setForm({ ...form, bodyFont: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value="jakarta">Plus Jakarta Sans (Рекомендуемый)</option>
                    <option value="inter">Inter (Лаконичный Дисплейный)</option>
                    <option value="roboto">Roboto (Классика)</option>
                    <option value="system">Системный шрифт (System UI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 font-mono mb-2">
                  Основной Акцентный Цвет Кнопок и Акцентов (Primary Theme)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'emerald', name: 'Изумрудный', class: 'bg-emerald-600 text-white' },
                    { id: 'blue', name: 'Индустриальный Синий', class: 'bg-blue-600 text-white' },
                    { id: 'indigo', name: 'Королевский Индиго', class: 'bg-indigo-600 text-white' },
                    { id: 'amber', name: 'Янтарный Золотой', class: 'bg-amber-500 text-slate-950' },
                    { id: 'slate', name: 'Черный Графит', class: 'bg-slate-900 text-white' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm({ ...form, primaryThemeColor: c.id as any })}
                      className={`p-3 rounded-2xl border-2 font-bold font-mono text-[11px] flex items-center justify-between transition ${
                        form.primaryThemeColor === c.id
                          ? 'border-slate-900 ring-4 ring-emerald-400/30 scale-105'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`w-4 h-4 rounded-full ${c.class} inline-block shadow-xs`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES & BANNERS */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sky-900 flex items-start space-x-3">
                <ImageIcon className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-mono text-sm">Загрузка локальных фото с компьютера/телефона или веб-ссылок</h4>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Вы можете загрузить файл напрямую с вашего компьютера (PNG, JPG, WEBP, SVG) или вставить прямую URL-ссылку.
                  </p>
                </div>
              </div>

              {/* Hero Banner Upload */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block font-bold text-slate-900 font-mono text-sm">
                    1. Главный Баннер Сайта (Hero Banner Background)
                  </label>
                  <div className="flex items-center space-x-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-bold rounded-md">
                      1920 × 600 px
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-md">
                      508.0 × 158.8 мм
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                      Соотношение 16:5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition">
                        <Upload className="w-4 h-4" />
                        <span>Загрузить PNG с компьютера</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setForm({ ...form, heroBannerBgUrl: url }));
                          }}
                        />
                      </label>
                      <span className="text-gray-400 font-mono text-xs">или ссылка:</span>
                    </div>

                    <input
                      type="url"
                      placeholder="Или вставьте URL-адрес картинки (https://...)"
                      value={form.heroBannerBgUrl}
                      onChange={(e) => setForm({ ...form, heroBannerBgUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-2 h-24 relative bg-slate-950 overflow-hidden">
                    {form.heroBannerBgUrl ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={form.heroBannerBgUrl}
                          alt="Hero preview"
                          className="w-full h-full object-cover rounded-xl transition-opacity"
                          style={{ opacity: (form.heroBannerOpacity ?? 80) / 100 }}
                        />
                        <div 
                          className="absolute inset-0 bg-slate-950 rounded-xl pointer-events-none"
                          style={{ opacity: (form.heroBannerOverlayDarkness ?? 50) / 100 }}
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, heroBannerBgUrl: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100 transition z-10"
                          title="Удалить картинку"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-[11px] font-mono">
                        <FileImage className="w-6 h-6 mx-auto text-gray-300 mb-1" />
                        <span>Превью пусто</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Transparency & Dark Overlay Controls */}
                <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Banner Image Opacity */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-800">1. Прозрачность фонового фото:</span>
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded-md">
                        {form.heroBannerOpacity ?? 80}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={form.heroBannerOpacity ?? 80}
                      onChange={(e) => setForm({ ...form, heroBannerOpacity: Number(e.target.value) })}
                      className="w-full accent-sky-600 cursor-pointer"
                    />

                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="text-gray-400">10% (Прозрачно)</span>
                      <div className="flex space-x-1">
                        {[30, 50, 80, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setForm({ ...form, heroBannerOpacity: val })}
                            className={`px-1.5 py-0.5 rounded border ${
                              (form.heroBannerOpacity ?? 80) === val
                                ? 'bg-sky-600 text-white border-sky-600 font-bold'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                      <span className="text-gray-400">100% (Ярко)</span>
                    </div>
                  </div>

                  {/* Dark Scrim Overlay */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-800">2. Затемнение фона (для чёткости текста):</span>
                      <span className="px-2 py-0.5 bg-slate-900 text-white font-bold rounded-md">
                        {form.heroBannerOverlayDarkness ?? 50}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="95"
                      step="5"
                      value={form.heroBannerOverlayDarkness ?? 50}
                      onChange={(e) => setForm({ ...form, heroBannerOverlayDarkness: Number(e.target.value) })}
                      className="w-full accent-slate-800 cursor-pointer"
                    />

                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="text-gray-400">0% (Без затемнения)</span>
                      <div className="flex space-x-1">
                        {[0, 30, 50, 80].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setForm({ ...form, heroBannerOverlayDarkness: val })}
                            className={`px-1.5 py-0.5 rounded border ${
                              (form.heroBannerOverlayDarkness ?? 50) === val
                                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                      <span className="text-gray-400">95% (Тёмный)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Brands Cards Images */}
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold font-mono text-slate-900 text-sm">
                    2. Размеры и фон карточек брендов (DEXTRA, KAIDO, KATSUMOTO, LUXOR)
                  </h4>
                  <div className="text-xs font-mono text-slate-600">
                    Формат карточек: <span className="font-bold text-slate-900">Пропорции А5</span> (<span className="font-bold text-emerald-700">148 × 210 мм</span>)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Brand DEXTRA */}
                  <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 font-mono text-xs">Бренд DEXTRA</span>
                      <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                        380 × 260 px (100.5 × 68.8 мм)
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition w-full">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить PNG с компьютера</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setForm({ ...form, dextraBgImage: url }));
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Или вставьте URL-адрес картинки (https://...)"
                        value={form.dextraBgImage || ''}
                        onChange={(e) => setForm({ ...form, dextraBgImage: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-amber-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    {form.dextraBgImage && (
                      <div className="relative h-16 rounded-xl overflow-hidden border border-amber-300">
                        <img src={form.dextraBgImage} alt="Dextra" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, dextraBgImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Brand KAIDO */}
                  <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 font-mono text-xs">Бренд KAIDO</span>
                      <span className="text-[10px] font-mono bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">
                        380 × 260 px (100.5 × 68.8 мм)
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition w-full">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить PNG с компьютера</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setForm({ ...form, kaidoBgImage: url }));
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Или вставьте URL-адрес картинки (https://...)"
                        value={form.kaidoBgImage || ''}
                        onChange={(e) => setForm({ ...form, kaidoBgImage: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-rose-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    {form.kaidoBgImage && (
                      <div className="relative h-16 rounded-xl overflow-hidden border border-rose-300">
                        <img src={form.kaidoBgImage} alt="Kaido" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, kaidoBgImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Brand KATSUMOTO */}
                  <div className="bg-red-50/50 border border-red-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-900 font-mono text-xs">Бренд KATSUMOTO</span>
                      <span className="text-[10px] font-mono bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">
                        380 × 260 px (100.5 × 68.8 мм)
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition w-full">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить PNG с компьютера</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setForm({ ...form, katsumotoBgImage: url }));
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Или вставьте URL-адрес картинки (https://...)"
                        value={form.katsumotoBgImage || ''}
                        onChange={(e) => setForm({ ...form, katsumotoBgImage: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-red-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    {form.katsumotoBgImage && (
                      <div className="relative h-16 rounded-xl overflow-hidden border border-red-300">
                        <img src={form.katsumotoBgImage} alt="Katsumoto" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, katsumotoBgImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Brand LUXOR */}
                  <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-900 font-mono text-xs">Бренд LUXOR</span>
                      <span className="text-[10px] font-mono bg-sky-200 text-sky-900 px-1.5 py-0.5 rounded font-bold">
                        380 × 260 px (100.5 × 68.8 мм)
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition w-full">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить PNG с компьютера</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setForm({ ...form, luxorBgImage: url }));
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Или вставьте URL-адрес картинки (https://...)"
                        value={form.luxorBgImage || ''}
                        onChange={(e) => setForm({ ...form, luxorBgImage: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-sky-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    {form.luxorBgImage && (
                      <div className="relative h-16 rounded-xl overflow-hidden border border-sky-300">
                        <img src={form.luxorBgImage} alt="Luxor" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, luxorBgImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* PNG Logos for Header Brand Buttons */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold font-mono text-slate-900 text-sm">
                      3. Логотипы PNG для Кнопок Брендов в Шапке Сайта
                    </h4>
                    <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Заменяют текстовые названия на прозрачные PNG
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* DEXTRA LOGO */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 font-mono text-xs">Логотип DEXTRA (PNG)</span>
                        {form.dextraLogoUrl && <span className="text-[10px] text-emerald-700 font-bold font-mono">PNG загружен</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1 shadow-xs transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setForm({ ...form, dextraLogoUrl: url }));
                            }}
                          />
                        </label>
                        {form.dextraLogoUrl && (
                          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-amber-300">
                            <img src={form.dextraLogoUrl} alt="Dextra logo" className="h-5 max-w-[80px] object-contain" />
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, dextraLogoUrl: '' })}
                              className="text-red-600 p-0.5 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KAIDO LOGO */}
                    <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900 font-mono text-xs">Логотип KAIDO (PNG)</span>
                        {form.kaidoLogoUrl && <span className="text-[10px] text-emerald-700 font-bold font-mono">PNG загружен</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1 shadow-xs transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setForm({ ...form, kaidoLogoUrl: url }));
                            }}
                          />
                        </label>
                        {form.kaidoLogoUrl && (
                          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-rose-300">
                            <img src={form.kaidoLogoUrl} alt="Kaido logo" className="h-5 max-w-[80px] object-contain" />
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, kaidoLogoUrl: '' })}
                              className="text-red-600 p-0.5 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KATSUMOTO LOGO */}
                    <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-900 font-mono text-xs">Логотип KATSUMOTO (PNG)</span>
                        {form.katsumotoLogoUrl && <span className="text-[10px] text-emerald-700 font-bold font-mono">PNG загружен</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1 shadow-xs transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setForm({ ...form, katsumotoLogoUrl: url }));
                            }}
                          />
                        </label>
                        {form.katsumotoLogoUrl && (
                          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-red-300">
                            <img src={form.katsumotoLogoUrl} alt="Katsumoto logo" className="h-5 max-w-[80px] object-contain" />
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, katsumotoLogoUrl: '' })}
                              className="text-red-600 p-0.5 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LUXOR LOGO */}
                    <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-900 font-mono text-xs">Логотип LUXOR (PNG)</span>
                        {form.luxorLogoUrl && <span className="text-[10px] text-emerald-700 font-bold font-mono">PNG загружен</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1 shadow-xs transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Загрузить PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setForm({ ...form, luxorLogoUrl: url }));
                            }}
                          />
                        </label>
                        {form.luxorLogoUrl && (
                          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-sky-300">
                            <img src={form.luxorLogoUrl} alt="Luxor logo" className="h-5 max-w-[80px] object-contain" />
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, luxorLogoUrl: '' })}
                              className="text-red-600 p-0.5 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIZES & RADII */}
          {activeTab === 'styles' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-purple-900 flex items-start space-x-3">
                <Sliders className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-mono">Точная настройка размеров всех элементов и геометрии</h4>
                  <p className="text-[11px] text-purple-800">
                    Здесь вы можете точечно менять высоту баннера Вступления, размеры шрифтов, высоту карточек брендов в миллиметрах/пикселях и скругления.
                  </p>
                </div>
              </div>

              {/* SECTION 1: HERO / BANNER SIZES */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Ruler className="w-4 h-4 text-purple-700" />
                  <h5 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wider">
                    1. Размеры Главного Баннера Вступления (Hero Header Banner)
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hero Height */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Высота Баннера Вступления:</span>
                      <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {form.heroBannerHeightPx || 420} px ({Math.round((form.heroBannerHeightPx || 420) * 0.2646)} мм)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="250"
                        max="700"
                        step="10"
                        value={form.heroBannerHeightPx || 420}
                        onChange={(e) => setForm({ ...form, heroBannerHeightPx: parseInt(e.target.value) || 420 })}
                        className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="200"
                        max="900"
                        value={form.heroBannerHeightPx || 420}
                        onChange={(e) => setForm({ ...form, heroBannerHeightPx: parseInt(e.target.value) || 420 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Title Size */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Размер Заголовка Вступления:</span>
                      <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {form.heroTitleFontSizePx || 40} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="20"
                        max="64"
                        step="2"
                        value={form.heroTitleFontSizePx || 40}
                        onChange={(e) => setForm({ ...form, heroTitleFontSizePx: parseInt(e.target.value) || 40 })}
                        className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="16"
                        max="80"
                        value={form.heroTitleFontSizePx || 40}
                        onChange={(e) => setForm({ ...form, heroTitleFontSizePx: parseInt(e.target.value) || 40 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Subtitle Size */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Размер Подзаголовка Вступления:</span>
                      <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {form.heroSubtitleFontSizePx || 15} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="12"
                        max="28"
                        step="1"
                        value={form.heroSubtitleFontSizePx || 15}
                        onChange={(e) => setForm({ ...form, heroSubtitleFontSizePx: parseInt(e.target.value) || 15 })}
                        className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="10"
                        max="36"
                        value={form.heroSubtitleFontSizePx || 15}
                        onChange={(e) => setForm({ ...form, heroSubtitleFontSizePx: parseInt(e.target.value) || 15 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Hero Padding */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-slate-800">Вертикальный отступ Вступления:</span>
                      <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {form.heroPaddingYPx || 40} px
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="16"
                        max="120"
                        step="4"
                        value={form.heroPaddingYPx || 40}
                        onChange={(e) => setForm({ ...form, heroPaddingYPx: parseInt(e.target.value) || 40 })}
                        className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                      />
                      <input
                        type="number"
                        min="8"
                        max="160"
                        value={form.heroPaddingYPx || 40}
                        onChange={(e) => setForm({ ...form, heroPaddingYPx: parseInt(e.target.value) || 40 })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRAND CARDS HEIGHT */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h5 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wider">
                    2. Размеры и фон карточек брендов (Высота & Габариты в px/мм)
                  </h5>
                  <span className="text-[11px] font-mono font-bold text-purple-700">
                    Текущая: {form.customBrandCardHeightPx || (form.brandCardHeight === 'compact' ? 220 : form.brandCardHeight === 'tall' ? 320 : 260)} px
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-2">
                  {[
                    { id: 'compact', label: 'Компактная (220px / 58.2 мм)', val: 220 },
                    { id: 'medium', label: 'Стандартная (260px / 68.8 мм)', val: 260 },
                    { id: 'tall', label: 'Высокая (320px / 84.7 мм)', val: 320 },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setForm({ ...form, brandCardHeight: h.id as any, customBrandCardHeightPx: h.val })}
                      className={`p-3 rounded-2xl border-2 text-left transition font-mono ${
                        (form.customBrandCardHeightPx === h.val || (!form.customBrandCardHeightPx && form.brandCardHeight === h.id))
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 font-bold'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{h.label}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Brand Card Height Slider */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-slate-800">Точная высота карточки (произвольный размер в px/мм):</span>
                    <span className="text-purple-700 font-mono">
                      {form.customBrandCardHeightPx || (form.brandCardHeight === 'compact' ? 220 : form.brandCardHeight === 'tall' ? 320 : 260)} px / {Math.round((form.customBrandCardHeightPx || (form.brandCardHeight === 'compact' ? 220 : form.brandCardHeight === 'tall' ? 320 : 260)) * 0.2646)} мм
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="180"
                      max="450"
                      step="10"
                      value={form.customBrandCardHeightPx || (form.brandCardHeight === 'compact' ? 220 : form.brandCardHeight === 'tall' ? 320 : 260)}
                      onChange={(e) => setForm({ ...form, customBrandCardHeightPx: parseInt(e.target.value) || 260 })}
                      className="w-full accent-purple-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                    />
                    <input
                      type="number"
                      min="150"
                      max="600"
                      value={form.customBrandCardHeightPx || (form.brandCardHeight === 'compact' ? 220 : form.brandCardHeight === 'tall' ? 320 : 260)}
                      onChange={(e) => setForm({ ...form, customBrandCardHeightPx: parseInt(e.target.value) || 260 })}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: BUTTON SIZE & RADIUS */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h5 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                  3. Размер и Скругление Углов Кнопок (Button Size & Radius)
                </h5>

                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-2">
                    Размер Кнопок в Шапке Сайта и Интерфейсе:
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    {[
                      { id: 'compact', label: 'Компактный', desc: 'Маленький отступ (py-1 text-xs, логотип 18px)' },
                      { id: 'standard', label: 'Стандартный', desc: 'Средний отступ (py-1.5 text-xs, логотип 22px)' },
                      { id: 'large', label: 'Крупный / Увеличенный', desc: 'Максимальный размер (py-2 text-sm, логотип 30px)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setForm({ ...form, buttonSize: s.id as any })}
                        className={`p-3 rounded-2xl border-2 text-left transition font-mono ${
                          form.buttonSize === s.id
                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-300 font-bold'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{s.label}</div>
                        <div className="text-[10px] text-gray-500">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-2">
                    Скругление Углов Кнопок и Элементов (Border Radius):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'rounded-md', label: 'Прямоугольные (6px / 1.6 мм)', preview: 'rounded-md' },
                      { id: 'rounded-xl', label: 'Стандарт (12px / 3.2 мм)', preview: 'rounded-xl' },
                      { id: 'rounded-2xl', label: 'Мягкие (16px / 4.2 мм)', preview: 'rounded-2xl' },
                      { id: 'rounded-full', label: 'Пилл / Овальные (999px)', preview: 'rounded-full' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setForm({ ...form, buttonRadius: r.id as any })}
                        className={`p-3 border-2 font-bold font-mono text-[11px] transition text-center ${r.preview} ${
                          form.buttonRadius === r.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-gray-300 bg-gray-50 text-slate-800 hover:bg-gray-100'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SPECS & DIMENSIONS CHEAT SHEET (px & mm) */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="bg-emerald-900 text-white p-5 rounded-2xl flex items-start space-x-4 border border-emerald-800 shadow-md">
                <Ruler className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-mono text-base text-emerald-300">
                    📐 Полный Справочник Габаритов Всех Элементов Сайта (Пиксели & Миллиметры)
                  </h4>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    Используйте эти точные размеры при подготовке иллюстраций, логотипов и фото товаров в Photoshop, Figma или Canva. Расчет миллиметров приведен для стандартного дисплея (96 DPI / 1px = 0.2646 мм).
                  </p>
                </div>
              </div>

              {/* Table of Dimensions */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs bg-white font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-200 text-[11px] font-bold uppercase tracking-wider">
                      <th className="p-3 border-b border-slate-800">Элемент / Окно сайта</th>
                      <th className="p-3 border-b border-slate-800">Ширина × Высота (px)</th>
                      <th className="p-3 border-b border-slate-800">Размер в мм (Ш × В)</th>
                      <th className="p-3 border-b border-slate-800">Пропорция / Формат</th>
                      <th className="p-3 border-b border-slate-800">Назначение</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-slate-800">
                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-sky-900">1. Главный Баннер (Hero Banner)</td>
                      <td className="p-3 font-bold text-slate-900">1920 × 600 px</td>
                      <td className="p-3 text-emerald-700 font-bold">508.0 × 158.8 мм</td>
                      <td className="p-3">16:5 (Широкоформат)</td>
                      <td className="p-3 text-gray-600 font-sans">Фон верхней презентации завода</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-amber-900">2. Плитка Бренда DEXTRA</td>
                      <td className="p-3 font-bold text-slate-900">380 × 260 px</td>
                      <td className="p-3 text-emerald-700 font-bold">100.5 × 68.8 мм</td>
                      <td className="p-3">1.46 : 1 (Прямоугольник)</td>
                      <td className="p-3 text-gray-600 font-sans">Карточка демперов и подвески DEXTRA</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-rose-900">3. Плитка Бренда KAIDO</td>
                      <td className="p-3 font-bold text-slate-900">380 × 260 px</td>
                      <td className="p-3 text-emerald-700 font-bold">100.5 × 68.8 мм</td>
                      <td className="p-3">1.46 : 1 (Прямоугольник)</td>
                      <td className="p-3 text-gray-600 font-sans">Карточка термостатов и помпы KAIDO</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-red-900">4. Плитка Бренда KATSUMOTO</td>
                      <td className="p-3 font-bold text-slate-900">380 × 260 px</td>
                      <td className="p-3 text-emerald-700 font-bold">100.5 × 68.8 мм</td>
                      <td className="p-3">1.46 : 1 (Прямоугольник)</td>
                      <td className="p-3 text-gray-600 font-sans">Карточка подшипников KATSUMOTO</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-sky-900">5. Плитка Бренда LUXOR</td>
                      <td className="p-3 font-bold text-slate-900">380 × 260 px</td>
                      <td className="p-3 text-emerald-700 font-bold">100.5 × 68.8 мм</td>
                      <td className="p-3">1.46 : 1 (Прямоугольник)</td>
                      <td className="p-3 text-gray-600 font-sans">Карточка вентиляторов LUXOR</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-purple-900">6. Фото товара в Каталоге</td>
                      <td className="p-3 font-bold text-slate-900">280 × 200 px</td>
                      <td className="p-3 text-emerald-700 font-bold">74.1 × 52.9 мм</td>
                      <td className="p-3">7:5 (Объектное фото)</td>
                      <td className="p-3 text-gray-600 font-sans">Изображение детали / запчасти</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-indigo-900">7. Вся Карточка Товара в Каталоге</td>
                      <td className="p-3 font-bold text-slate-900">280 × 380 px</td>
                      <td className="p-3 text-emerald-700 font-bold">74.1 × 100.5 мм</td>
                      <td className="p-3">Вертикальная плитка</td>
                      <td className="p-3 text-gray-600 font-sans">Контейнер товара с ценой и EAN</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900">8. Логотип / Иконка Холдинга в Шапке</td>
                      <td className="p-3 font-bold text-slate-900">512 × 512 px</td>
                      <td className="p-3 text-emerald-700 font-bold">135.5 × 135.5 мм</td>
                      <td className="p-3">1:1 Квадрат (PNG / SVG)</td>
                      <td className="p-3 text-gray-600 font-sans">Значок RIVAUTO GROUP в шапке</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900">9. Кнопки Навигации & Заказа</td>
                      <td className="p-3 font-bold text-slate-900">160 × 44 px</td>
                      <td className="p-3 text-emerald-700 font-bold">42.3 × 11.6 мм</td>
                      <td className="p-3">Высота 44px (Touch)</td>
                      <td className="p-3 text-gray-600 font-sans">Кнопки "В корзину", "Заказать OEM"</td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900">10. Значок Категории деталей</td>
                      <td className="p-3 font-bold text-slate-900">64 × 64 px</td>
                      <td className="p-3 text-emerald-700 font-bold">16.9 × 16.9 мм</td>
                      <td className="p-3">1:1 Квадрат</td>
                      <td className="p-3 text-gray-600 font-sans">Мини-иконки разделов каталога</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 flex items-start space-x-3 text-xs">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold font-mono">Совет по качеству изображений:</h5>
                  <p className="mt-0.5 font-sans">
                    Для четкого отображения на экранах с высоким разрешением (Retina / 4K) вы можете загружать картинки двойного разрешения (например, Баннер 3840×1200 px), браузер автоматически сожмет их до идеального качества без потери резкости!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BACKUP & FULL DATA EXPORT / IMPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-indigo-950 flex items-start space-x-3">
                <Archive className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold font-mono text-sm uppercase tracking-tight">
                    📦 Единый Экспорт и Импорт Всего Проекта (Data Backup & Migration)
                  </h4>
                  <p className="text-xs text-indigo-800 mt-1">
                    Здесь вы можете в 1 клик выгрузить <strong>абсолютно все внесённые данные</strong>: загруженные баннеры, фотографии брендов в высоком разрешении, каталог товаров, структуру категорий, оптовые заявки и тексты CMS в виде единого JSON-файла для переноса на ваш сервер.
                  </p>
                </div>
              </div>

              {backupStatus && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-mono font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{backupStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Full Export Button */}
                <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                        <Download className="w-5 h-5" />
                      </span>
                      <h5 className="font-bold font-mono text-slate-900 text-sm">
                        1. Скачать полный снимок данных (.json)
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600">
                      Формирует полный резервный файл со всеми фото, баннерами, артикулами и настройками темы.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const exportData: Record<string, any> = {
                          timestamp: new Date().toISOString(),
                          version: '1.0.0',
                          themeSettings: form,
                        };

                        // Keys to dump from localStorage and IndexedDB
                        const keys = [
                          'rivauto_theme_settings',
                          'luxor_parts_list',
                          'luxor_categories',
                          'rivauto_brands',
                          'rivauto_cms_pages',
                          'rivauto_wholesale_leads',
                          'luxor_is_admin',
                        ];

                        keys.forEach((key) => {
                          try {
                            const raw = localStorage.getItem(key);
                            if (raw) {
                              exportData[key] = JSON.parse(raw);
                            }
                          } catch {
                            // ignore individual parse errors
                          }
                        });

                        const jsonStr = JSON.stringify(exportData, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `rivauto_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        setBackupStatus('Резервная копия успешно сформирована и скачана на ваше устройство!');
                      } catch (err) {
                        alert('Ошибка при выгрузке данных: ' + String(err));
                      }
                    }}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md cursor-pointer"
                  >
                    <HardDriveDownload className="w-4 h-4" />
                    <span>СКАЧАТЬ ПОЛНЫЙ СНИМОК ПРОЕКТА</span>
                  </button>
                </div>

                {/* 2. Full Restore / Import Button */}
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-100 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                        <Upload className="w-5 h-5" />
                      </span>
                      <h5 className="font-bold font-mono text-slate-900 text-sm">
                        2. Восстановить данные из файла (.json)
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600">
                      Загрузите ранее сохранённый файл бэкапа для мгновенного развёртывания на другом ПК или сервере.
                    </p>
                  </div>

                  <label className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md cursor-pointer">
                    <Database className="w-4 h-4" />
                    <span>ЗАГРУЗИТЬ БЭКАП (.JSON)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const parsed = JSON.parse(ev.target?.result as string);
                            if (parsed) {
                              if (parsed.themeSettings) {
                                setForm(parsed.themeSettings);
                                onSaveSettings(parsed.themeSettings);
                              }
                              Object.keys(parsed).forEach((k) => {
                                if (k !== 'timestamp' && k !== 'version') {
                                  try {
                                    localStorage.setItem(k, JSON.stringify(parsed[k]));
                                  } catch {
                                    // ignore storage quota
                                  }
                                }
                              });
                              setBackupStatus('Данные успешно импортированы! Страница обновится для применения всех фото.');
                              setTimeout(() => {
                                window.location.reload();
                              }, 1200);
                            }
                          } catch (err) {
                            alert('Не удалось прочитать JSON файл: ' + String(err));
                          }
                        };
                        reader.readAsText(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                {/* 3. Screenshots Batch Download Button */}
                <div className="sm:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border-2 border-indigo-500/40 shadow-md space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <Camera className="w-5 h-5" />
                      <h5 className="font-bold font-mono text-sm uppercase tracking-wide">
                        3. Скачать скриншоты всех страниц (9 JPG файлов)
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300">
                      Скачивает на ваш компьютер комплект скриншотов всех 9 страниц (главная, бренды Luxor, Katsumoto, Kaido, Dextra, каталог, карточка детали, CMS «О компании» и админ-панель).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setBackupStatus('Начато скачивание всех 9 скриншотов...');
                        for (let i = 0; i < SCREENSHOTS_LIST.length; i++) {
                          const item = SCREENSHOTS_LIST[i];
                          const a = document.createElement('a');
                          a.href = item.imageUrl;
                          a.download = item.filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          await new Promise((r) => setTimeout(r, 450));
                        }
                        setBackupStatus('Все 9 скриншотов страниц успешно скачаны на ваш компьютер!');
                      } catch (err) {
                        alert('Ошибка при скачивании скриншотов: ' + String(err));
                      }
                    }}
                    className="py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>СКАЧАТЬ ВСЕ 9 СКРИНШОТОВ НА ПК</span>
                  </button>
                </div>
              </div>

              {/* Instructions for publishing to your server */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Инструкция по переносу и публикации на вашем сервере (GitHub / VPS / Vercel / Nginx):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 leading-relaxed">
                  <li>
                    <strong>Скачать исходный код:</strong> Нажмите в верхнем меню платформы кнопку <em>Export / Скачать ZIP</em> или синхронизируйте репозиторий с <em>GitHub</em>.
                  </li>
                  <li>
                    <strong>Скачать снимок данных:</strong> Нажмите синюю кнопку выше <em>«СКАЧАТЬ ПОЛНЫЙ СНИМОК ПРОЕКТА»</em> для гарантии сохранения всех кастомных фотографий и текстов.
                  </li>
                  <li>
                    <strong>Сборка проекта:</strong> В терминале на сервере выполните команды:
                    <div className="my-1.5 p-2.5 bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 font-mono select-all">
                      npm install && npm run build
                    </div>
                  </li>
                  <li>
                    <strong>Запуск:</strong> Папка <code className="text-amber-300">dist/</code> готова к отдаче через Nginx, Apache или любой хостинг (Vercel, Netlify, Docker, VPS).
                  </li>
                </ol>
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 p-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition flex items-center space-x-1 font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сбросить к исходным</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-slate-800 font-bold rounded-xl transition"
            >
              Отмена
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить всё</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

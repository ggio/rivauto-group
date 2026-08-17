import React, { useState } from 'react';
import { 
  X, Download, Image as ImageIcon, Check, Eye, ExternalLink, 
  Layers, Monitor, Sparkles, FolderDown, ShieldCheck 
} from 'lucide-react';

import imgLanding from '../assets/images/home_brand_landing_1786709308812.jpg';
import imgLuxor from '../assets/images/brand_luxor_page_1786709795947.jpg';
import imgKatsumoto from '../assets/images/brand_katsumoto_page_1786709810136.jpg';
import imgKaido from '../assets/images/brand_kaido_page_1786709823787.jpg';
import imgDextra from '../assets/images/brand_dextra_page_1786709837695.jpg';
import imgCatalog from '../assets/images/parts_catalog_screen_1786709320559.jpg';
import imgProduct from '../assets/images/product_card_details_1786709335912.jpg';
import imgAbout from '../assets/images/about_holding_cms_1786709346376.jpg';
import imgAdmin from '../assets/images/admin_cms_panel_1786709361912.jpg';

export interface ScreenshotItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  filename: string;
  badge: string;
}

export const SCREENSHOTS_LIST: ScreenshotItem[] = [
  {
    id: 'landing',
    title: '1. Главная страница — Мультибрендовый портал & Оптовая форма B2B',
    category: 'Витрина Холдинга',
    description: 'Центральный хаб с 4 брендами, интерактивными баннерами, навигацией по группам товаров и формой оптового сотрудничества.',
    imageUrl: imgLanding,
    filename: '01_rivauto_landing_showcase.jpg',
    badge: 'Главная',
  },
  {
    id: 'luxor',
    title: '2. Страница бренда LUXOR — Тормозные системы & Подвеска',
    category: 'Бренд',
    description: 'Каталог деталей LUXOR: тормозные колодки, амортизаторы, диски, гарантия 2 года, кросс-коды и оптовые цены.',
    imageUrl: imgLuxor,
    filename: '02_brand_luxor_page.jpg',
    badge: 'Бренд LUXOR',
  },
  {
    id: 'katsumoto',
    title: '3. Страница бренда KATSUMOTO — Японские компоненты & Электрика',
    category: 'Бренд',
    description: 'Витрина компонентов KATSUMOTO: свечи зажигания, катушки, датчики, ремни ГРМ, японские стандарты качества.',
    imageUrl: imgKatsumoto,
    filename: '03_brand_katsumoto_page.jpg',
    badge: 'Бренд KATSUMOTO',
  },
  {
    id: 'kaido',
    title: '4. Страница бренда KAIDO — Охлаждение, Рулевое & Шасси',
    category: 'Бренд',
    description: 'Каталог автокомпонентов KAIDO: радиаторы, насосы, рулевые рейки, тяги и рычаги подвески с поиском по OEM.',
    imageUrl: imgKaido,
    filename: '04_brand_kaido_page.jpg',
    badge: 'Бренд KAIDO',
  },
  {
    id: 'dextra',
    title: '5. Страница бренда DEXTRA — Фильтрация & Сервисные детали',
    category: 'Бренд',
    description: 'Специализированная витрина DEXTRA: масляные, воздушные, салонные и топливные фильтры для всех типов авто.',
    imageUrl: imgDextra,
    filename: '05_brand_dextra_page.jpg',
    badge: 'Бренд DEXTRA',
  },
  {
    id: 'catalog',
    title: '6. Электронный каталог автозапчастей & Подбор по автомобилю',
    category: 'Каталог',
    description: 'Каталог запчастей: фильтр Марка-Модель-Год-Двигатель, умный поиск по OEM/VIN, дерево категорий и сетка товаров.',
    imageUrl: imgCatalog,
    filename: '06_parts_catalog_vehicle_filter.jpg',
    badge: 'Каталог',
  },
  {
    id: 'product',
    title: '7. Детальная карточка автозапчасти & Спецификации',
    category: 'Карточка товара',
    description: 'Фотография высокого разрешения, таблица OEM кросс-кодов, применяемость к автомобилям, параметры и кнопка заказа.',
    imageUrl: imgProduct,
    filename: '07_part_details_specifications.jpg',
    badge: 'Товар',
  },
  {
    id: 'about',
    title: '8. Страница «О компании & О холдинге RIVAUTO» (CMS)',
    category: 'Корпоративная страница',
    description: 'История холдинга, статистика (50 000+ SKU), сеть распределительных складов, логистика и сертификаты качества ISO.',
    imageUrl: imgAbout,
    filename: '08_about_holding_company.jpg',
    badge: 'О холдинге',
  },
  {
    id: 'admin',
    title: '9. Панель управления CMS, Редактор тем & Бэкап проекта',
    category: 'Администрирование',
    description: 'Управление брендовыми карточками, логотипами, типографикой, B2B-заявками и модуль экспорта полного снимка JSON.',
    imageUrl: imgAdmin,
    filename: '09_admin_cms_theme_editor.jpg',
    badge: 'Админ / CMS',
  },
];

interface ScreenshotsGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenshotsGalleryModal: React.FC<ScreenshotsGalleryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<ScreenshotItem | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  if (!isOpen) return null;

  // Single download trigger
  const handleDownloadSingle = (item: ScreenshotItem) => {
    try {
      const a = document.createElement('a');
      a.href = item.imageUrl;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadStatus(`Скриншот «${item.title.slice(0, 30)}...» скачан на ваш компьютер!`);
      setTimeout(() => setDownloadStatus(''), 4000);
    } catch (err) {
      alert('Ошибка при скачивании: ' + String(err));
    }
  };

  // Batch download all screenshots
  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    setDownloadStatus('Скачивание всех 9 скриншотов...');

    try {
      for (let i = 0; i < SCREENSHOTS_LIST.length; i++) {
        const item = SCREENSHOTS_LIST[i];
        const a = document.createElement('a');
        a.href = item.imageUrl;
        a.download = item.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Small delay to let browser process downloads without blocking
        await new Promise((r) => setTimeout(r, 450));
      }
      setDownloadStatus('Все 9 скриншотов успешно скачаны на ваш компьютер!');
      setTimeout(() => setDownloadStatus(''), 5000);
    } catch (err) {
      alert('Ошибка при массовом скачивании: ' + String(err));
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <span>📸 Скриншоты всех страниц сайта RIVAUTO GROUP</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-sans font-bold">
                  9 страниц
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Вы можете скачать каждый скриншот по отдельности или все 9 сразу в один клик прямо на свой ПК
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <FolderDown className="w-4 h-4" />
              <span>{downloadingAll ? 'СКАЧИВАНИЕ...' : 'СКАЧАТЬ ВСЕ 9 СКРИНШОТОВ НА ПК'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status notification bar */}
        {downloadStatus && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{downloadStatus}</span>
            </div>
            <button 
              onClick={() => setDownloadStatus('')}
              className="text-white/80 hover:text-white text-xs underline"
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Mobile Download All Button */}
        <div className="sm:hidden p-3 bg-indigo-50 border-b border-indigo-100 flex-shrink-0">
          <button
            onClick={handleDownloadAll}
            disabled={downloadingAll}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-md"
          >
            <FolderDown className="w-4 h-4" />
            <span>{downloadingAll ? 'СКАЧИВАНИЕ...' : 'СКАЧАТЬ ВСЕ 9 СКРИНШОТОВ НА ПК'}</span>
          </button>
        </div>

        {/* Grid of Screenshots */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCREENSHOTS_LIST.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col group"
              >
                {/* Image Container with Hover Zoom & Fullscreen trigger */}
                <div 
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group/img"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <span className="px-3 py-1.5 bg-white/90 text-slate-900 rounded-xl text-xs font-mono font-bold flex items-center space-x-1 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Увеличить</span>
                    </span>
                  </div>
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-xs text-amber-300 font-mono font-bold text-[11px] rounded-lg border border-slate-700">
                    {item.badge}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase font-bold text-indigo-600 tracking-wider">
                      {item.category}
                    </div>
                    <h4 className="font-bold font-mono text-slate-900 text-xs leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(item)}
                      className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Просмотр</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                      title={`Скачать файл ${item.filename}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Скачать JPG</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Все 9 файлов высокого разрешения готовы для локального сохранения на ПК.</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <FolderDown className="w-4 h-4" />
              <span>{downloadingAll ? 'СКАЧИВАНИЕ...' : 'СКАЧАТЬ ВСЕ 9 СКРИНШОТОВ НА ПК'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen View of a Single Screenshot */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedImage(null)}
        >
          {/* Top Bar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="font-mono font-bold text-sm text-amber-400">{selectedImage.title}</h4>
              <p className="text-xs text-slate-300">{selectedImage.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownloadSingle(selectedImage)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Скачать на ПК</span>
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Large Image Preview */}
          <div 
            className="max-w-5xl max-h-[80vh] overflow-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

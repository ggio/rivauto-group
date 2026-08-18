import React, { useState } from 'react';
import { BrandItem } from '../types/catalog';
import { X, Edit2, Plus, Check, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface BrandManagerModalProps {
  brands: BrandItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateBrand: (updatedBrand: BrandItem) => void;
}

export const BrandManagerModal: React.FC<BrandManagerModalProps> = ({
  brands,
  isOpen,
  onClose,
  onUpdateBrand,
}) => {
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (brand: BrandItem) => {
    setEditingBrand(brand);
    setName(brand.name);
    setTagline(brand.tagline);
    setSubtitle(brand.subtitle);
    setBadgeText(brand.badgeText);
    setDescription(brand.description);
    setLogoUrl(brand.logoUrl || '');
    setBannerImage(brand.bannerImage || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    const updated: BrandItem = {
      ...editingBrand,
      name: name.trim() || editingBrand.name,
      tagline: tagline.trim() || editingBrand.tagline,
      subtitle: subtitle.trim() || editingBrand.subtitle,
      badgeText: badgeText.trim() || editingBrand.badgeText,
      description: description.trim() || editingBrand.description,
      logoUrl: logoUrl.trim() || undefined,
      bannerImage: bannerImage.trim() || editingBrand.bannerImage,
    };

    onUpdateBrand(updated);
    setEditingBrand(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-gray-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-xl text-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono">
                Редактирование Торговых Марок Группы (Администратор)
              </h2>
              <p className="text-xs text-gray-400">
                Управление описанием, лозунгами и настройками DEXTRA, KAIDO, KATSUMOTO, LUXOR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-800 hover:bg-rose-600 rounded-xl text-gray-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {editingBrand ? (
            <form onSubmit={handleSave} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <h3 className="font-bold text-slate-900 font-mono text-sm">
                  Редактирование бренда: <span className="text-amber-700 font-black">{editingBrand.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="text-xs text-gray-500 hover:text-gray-900 underline"
                >
                  Отмена
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Название бренда *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Бейдж / Статус</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Слоган (Tagline)</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Подзаголовок</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              {/* Brand Logo Upload */}
              <div>
                <ImageUploader
                  label={`Логотип бренда (${editingBrand.name})`}
                  value={logoUrl}
                  onChange={setLogoUrl}
                  folder="rivauto/brands"
                />
              </div>

              {/* Brand Main Background Banner Image Upload */}
              <div>
                <ImageUploader
                  label={`Главный фоновый баннер бренда (${editingBrand.name})`}
                  value={bannerImage}
                  onChange={setBannerImage}
                  folder="rivauto/brands"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Подробное описание бренда</span>
                  <span className="text-[11px] font-normal text-gray-500">Для переноса строки нажимайте Enter</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-xs font-medium leading-relaxed"
                  placeholder="Введите описание... Нажмите Enter в нужном месте для переноса слова/строки."
                />
                <p className="text-[11px] text-gray-500 mt-1 flex items-center space-x-1">
                  <span>💡 <strong>Перенос слов и строк:</strong> Любые переносы строки (клавиша <kbd className="bg-gray-100 border border-gray-300 rounded px-1 text-black font-mono font-bold">Enter</kbd>) будут сразу отображаться на странице бренда.</span>
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-xs"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Сохранить изменения</span>
                </button>
              </div>
            </form>
          ) : null}

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
              Список собственных марок RIVAUTO GROUP (4 Марки)
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-gray-50 hover:bg-white transition shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs ${b.badgeBg}`}>
                      {b.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 font-mono text-sm">{b.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono bg-gray-200 px-2 py-0.5 rounded">
                          {b.tagline}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{b.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEdit(b)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Редактировать</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200">
          <span>RIVAUTO GROUP Admin Systems</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-bold transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

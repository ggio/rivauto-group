import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FolderPlus, Tag, CheckCircle2, Image, Upload, Link, Edit2, RefreshCw } from 'lucide-react';
import { PartImage } from './PartImage';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  imageType?: string;
  imageUrl?: string;
  description?: string;
}

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onAddCategory: (cat: CategoryItem) => void;
  onUpdateCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (slug: string) => void;
  initialEditingCategory?: CategoryItem | null;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  initialEditingCategory = null,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [count, setCount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [imageType, setImageType] = useState('radiator');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Reset form helper
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCount(0);
    setImageUrl('');
    setImageType('radiator');
    setDescription('');
  };

  // Load initial editing category if provided
  useEffect(() => {
    if (initialEditingCategory) {
      setEditingId(initialEditingCategory.id);
      setName(initialEditingCategory.name);
      setSlug(initialEditingCategory.slug);
      setCount(initialEditingCategory.count || 0);
      setImageUrl(initialEditingCategory.imageUrl || '');
      setImageType(initialEditingCategory.imageType || 'radiator');
      setDescription(initialEditingCategory.description || '');
    } else {
      resetForm();
    }
  }, [initialEditingCategory, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      // Auto-generate slug when creating
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9а-я]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug || 'new-category');
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setCount(cat.count || 0);
    setImageUrl(cat.imageUrl || '');
    setImageType(cat.imageType || 'radiator');
    setDescription(cat.description || '');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Размер изображения превышает 15 МБ. Пожалуйста, выберите файл меньшего размера.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      setImageUrl(dataUrl);

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

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
            const finalBase64 = canvas.toDataURL('image/jpeg', 0.85);
            setImageUrl(finalBase64);

            // Auto-commit locally first
            if (editingId) {
              onUpdateCategory({
                id: editingId,
                name: name.trim(),
                slug: slug.trim(),
                count: Number(count) || 0,
                imageType: imageType,
                imageUrl: finalBase64,
                description: description.trim() || undefined,
              });
            }

            // Upload in background to Cloudinary to replace Data URL with permanent HTTPS CDN URL
            fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file: finalBase64, folder: 'rivauto_categories' }),
            })
              .then((res) => res.json())
              .then((json) => {
                if (json.success && json.url) {
                  setImageUrl(json.url);
                  if (editingId) {
                    onUpdateCategory({
                      id: editingId,
                      name: name.trim(),
                      slug: slug.trim(),
                      count: Number(count) || 0,
                      imageType: imageType,
                      imageUrl: json.url,
                      description: description.trim() || undefined,
                    });
                  }
                }
              })
              .catch((err) => console.warn('Background upload to Cloudinary failed:', err));
          }
        } catch (err) {
          console.error('Error compressing image:', err);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryData: CategoryItem = {
      id: editingId || 'cat-' + Date.now(),
      name: name.trim(),
      slug: slug.trim() || 'cat-' + Date.now(),
      count: Number(count) || 0,
      imageType: imageType,
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
    };

    if (editingId) {
      onUpdateCategory(categoryData);
    } else {
      onAddCategory(categoryData);
    }

    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-gray-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-xs">
        {/* Header */}
        <div className="bg-[#1E293B] text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#1B4E9B] text-white">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono">
                Редактирование категорий и товарных групп
              </h2>
              <p className="text-[11px] text-gray-300">
                Полная настройка названий, фото, обложек и параметров классификатора
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Add / Edit Form */}
          <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-xs font-bold text-[#1E4E8C] font-mono uppercase flex items-center space-x-2">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                <span>{editingId ? 'Редактировать группу товара' : 'Создать новую группу товаров'}</span>
              </h3>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[11px] text-[#1B4E9B] hover:underline font-bold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Переключить на создание новой</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Name & Slug */}
              <div className="sm:col-span-6 space-y-1">
                <label className="block text-gray-700 font-bold">Название группы *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Радиаторы охлаждения"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-semibold text-xs"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="block text-gray-700 font-bold">Код Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="radiators"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-gray-700 font-bold">SKU</label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono text-xs"
                />
              </div>
            </div>

            {/* Photo Upload & Preview Section */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
              <label className="block text-gray-800 font-bold text-xs flex items-center space-x-1.5">
                <Image className="w-4 h-4 text-[#1B4E9B]" />
                <span>Фотография / Изображение группы</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Upload controls */}
                <div className="sm:col-span-8 space-y-3">
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center space-x-2 bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer transition shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Загрузить файл с устройства</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Сбросить фото</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-500 font-medium block mb-1">Ссылка на изображение или Data URL:</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/category-photo.jpg"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Preview Box */}
                <div className={`sm:col-span-4 h-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden ${imageUrl ? 'p-0' : 'p-2'}`}>
                  <PartImage type={name || 'radiator'} imageUrl={imageUrl} className={imageUrl ? "w-full h-full object-cover" : "max-h-24 max-w-full object-contain"} />
                  {imageUrl && (
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shadow-xs z-10">
                      Свое фото
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-xs text-xs"
            >
              {editingId ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Сохранить изменения группы</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Добавить новую группу</span>
                </>
              )}
            </button>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 font-mono uppercase flex items-center justify-between">
              <span>Список всех групп каталога ({categories.filter((c) => c.slug !== 'all').length}):</span>
              <span className="text-[11px] text-gray-500 font-normal">Нажмите «Редактировать», чтобы изменить фото или название</span>
            </h3>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {categories
                .filter((c) => c.slug !== 'all')
                .map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                      editingId === cat.id
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                        : 'bg-gray-50 hover:bg-white border-gray-200/90'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                        <PartImage type={cat.imageType || cat.name} imageUrl={cat.imageUrl} className="max-h-10 max-w-full object-contain" />
                      </div>

                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center space-x-2">
                          <span>{cat.name}</span>
                          {cat.imageUrl && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                              Свое фото
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono space-x-2">
                          <span>Slug: {cat.slug}</span>
                          <span>•</span>
                          <span>SKU: {cat.count}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="bg-white hover:bg-gray-100 text-[#1B4E9B] border border-gray-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Изменить</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Удалить группу "${cat.name}" из каталога?`)) {
                            onDeleteCategory(cat.slug);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                        title="Удалить категорию"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

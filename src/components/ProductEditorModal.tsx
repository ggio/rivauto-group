import React, { useState, useEffect } from 'react';
import { LuxorPart, CrossReference, VehicleFitment } from '../types/catalog';
import { X, Plus, Trash2, Save, Wrench, CheckCircle2, Layers, ShieldCheck, Tag, Image, Upload, Link, Camera } from 'lucide-react';
import { LUXOR_CATEGORIES } from '../data/mockParts';

interface ProductEditorModalProps {
  partToEdit?: LuxorPart | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePart: (part: LuxorPart) => void;
  existingCategories: Array<{ id: string; name: string; slug: string }>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  partToEdit,
  isOpen,
  onClose,
  onSavePart,
  existingCategories,
}) => {
  const [sku, setSku] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [brandId, setBrandId] = useState<string>('luxor');
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState('brakes');
  const [subcategory, setSubcategory] = useState('');
  const [productLine, setProductLine] = useState<'Luxor HighCarbon' | 'Luxor HeavyDuty' | 'Luxor Precision' | 'Luxor ProTurbo'>('Luxor HeavyDuty');
  const [priceRub, setPriceRub] = useState<number>(2500);
  const [oldPriceRub, setOldPriceRub] = useState<number>(2900);
  const [description, setDescription] = useState('');
  const [materialCode, setMaterialCode] = useState('PA66-GF30 (Полиамид + 30% Стекловолокно)');
  const [surfaceFinish, setSurfaceFinish] = useState('Geomet 500 Anti-Corrosion');
  const [weightKg, setWeightKg] = useState<number>(1.8);
  const [eanBarcode, setEanBarcode] = useState('7930177800100');
  const [inStockStatus, setInStockStatus] = useState<'In Stock' | 'Production Run' | 'Special Order'>('In Stock');
  const [warehouseLocation, setWarehouseLocation] = useState('Склад А1-01 (Центральный)');
  const [imageUrl, setImageUrl] = useState('');
  
  // Dynamic Cross References
  const [crossRefs, setCrossRefs] = useState<CrossReference[]>([]);
  const [newBrand, setNewBrand] = useState('');
  const [newOem, setNewOem] = useState('');

  // Dynamic Fitments
  const [fitments, setFitments] = useState<VehicleFitment[]>([]);
  const [fitMake, setFitMake] = useState('');
  const [fitModel, setFitModel] = useState('');
  const [fitEngine, setFitEngine] = useState('');
  const [fitYears, setFitYears] = useState('2012-2022');
  const [fitPower, setFitPower] = useState('140 л.с.');

  useEffect(() => {
    if (partToEdit) {
      setSku(partToEdit.sku || '');
      setItemCode(partToEdit.itemCode || partToEdit.sku || '');
      setBrandId(partToEdit.brandId || 'luxor');
      setTitle(partToEdit.title || '');
      setCategorySlug(partToEdit.categorySlug || 'brakes');
      setSubcategory(partToEdit.subcategory || '');
      setProductLine(partToEdit.productLine || 'Luxor HeavyDuty');
      setPriceRub(partToEdit.priceRub || 2500);
      setOldPriceRub(partToEdit.oldPriceRub || 2900);
      setDescription(partToEdit.description || '');
      setMaterialCode(partToEdit.materialCode || '');
      setSurfaceFinish(partToEdit.surfaceFinish || '');
      setWeightKg(partToEdit.weightKg || 1.8);
      setEanBarcode(partToEdit.eanBarcode || '');
      setInStockStatus(partToEdit.inStockStatus || 'In Stock');
      setWarehouseLocation(partToEdit.warehouseLocation || 'Склад А1-01');
      setImageUrl(partToEdit.imageUrl || '');
      setCrossRefs(partToEdit.crossReferences || []);
      setFitments(partToEdit.fitments || []);
    } else {
      // Clear form
      setSku('LX-' + Math.floor(1000 + Math.random() * 9000));
      setItemCode('LFS ' + Math.floor(100 + Math.random() * 900));
      setTitle('');
      setCategorySlug('fans');
      setSubcategory('');
      setProductLine('Luxor HeavyDuty');
      setPriceRub(2800);
      setOldPriceRub(3200);
      setDescription('');
      setMaterialCode('PA66-GF30 (Термостойкий полиамид)');
      setSurfaceFinish('Черная индустриальная матовая');
      setWeightKg(2.1);
      setEanBarcode('7930177' + Math.floor(100000 + Math.random() * 900000));
      setInStockStatus('In Stock');
      setWarehouseLocation('Склад А1-01 (Центральный)');
      setImageUrl('');
      setCrossRefs([
        { id: 'cr-sample-1', brand: 'LADA', oemNumber: '2170-1309016', normalizedNumber: '21701309016', type: 'OEM' }
      ]);
      setFitments([
        {
          id: 'vf-sample-1',
          make: 'LADA',
          model: 'Priora / Granta',
          yearStart: 2011,
          yearEnd: 2023,
          engineCode: 'VAZ-21127',
          displacementCc: 1596,
          powerKw: 78,
          powerHp: 106,
          fuelType: 'Petrol',
          position: 'Front Axle'
        }
      ]);
    }
  }, [partToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddCrossRef = () => {
    if (!newBrand.trim() || !newOem.trim()) return;
    const cleanOem = newOem.replace(/[^a-zA-Z0-9]/g, '');
    const newCr: CrossReference = {
      id: 'cr-' + Date.now() + Math.random().toString(36).substring(2, 5),
      brand: newBrand.trim(),
      oemNumber: newOem.trim(),
      normalizedNumber: cleanOem,
      type: 'OEM',
    };
    setCrossRefs([...crossRefs, newCr]);
    setNewBrand('');
    setNewOem('');
  };

  const handleRemoveCrossRef = (id: string) => {
    setCrossRefs(crossRefs.filter((c) => c.id !== id));
  };

  const handleAddFitment = () => {
    if (!fitMake.trim() || !fitModel.trim()) return;
    const newFit: VehicleFitment = {
      id: 'vf-' + Date.now() + Math.random().toString(36).substring(2, 5),
      make: fitMake.trim(),
      model: fitModel.trim(),
      yearStart: 2010,
      yearEnd: 2024,
      engineCode: fitEngine.trim() || 'Стандарт',
      displacementCc: 1600,
      powerKw: 75,
      powerHp: parseInt(fitPower) || 100,
      fuelType: 'Petrol',
      position: 'Front Axle',
    };
    setFitments([...fitments, newFit]);
    setFitMake('');
    setFitModel('');
    setFitEngine('');
  };

  const handleRemoveFitment = (id: string) => {
    setFitments(fitments.filter((f) => f.id !== id));
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

      // Compress via Canvas to keep image lightweight (<100KB)
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800; // Optimal resolution for product detail view

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
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
            setImageUrl(compressedDataUrl);
          }
        } catch (err) {
          console.error('Error compressing product image:', err);
        }
      };
      img.onerror = () => setImageUrl(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sku.trim()) return;

    const matchedCat = existingCategories.find((c) => c.slug === categorySlug) || {
      name: 'Автокомпоненты',
      slug: categorySlug,
    };

    const newPart: LuxorPart = {
      id: partToEdit ? partToEdit.id : 'part-' + Date.now(),
      sku: sku.trim(),
      itemCode: itemCode.trim() || sku.trim(),
      brandId: brandId,
      brandName: brandId === 'dextra' ? 'DEXTRA' : brandId === 'kaido' ? 'KAIDO' : brandId === 'katsumoto' ? 'KATSUMOTO' : 'LUXOR',
      title: title.trim(),
      category: matchedCat.name,
      categorySlug: categorySlug,
      subcategory: subcategory.trim() || 'Общая группа',
      productLine: productLine,
      priceRub: Number(priceRub) || 2000,
      oldPriceRub: Number(oldPriceRub) || Math.round(priceRub * 1.15),
      description: description.trim() || 'Оригинальный автокомпонент высокой прочности и точности изготовления Luxor.',
      drawingType: 'BrakeDisc2D',
      materialCode: materialCode.trim(),
      surfaceFinish: surfaceFinish.trim(),
      weightKg: Number(weightKg) || 1.5,
      eanBarcode: eanBarcode.trim(),
      inStockStatus: inStockStatus,
      warehouseLocation: warehouseLocation.trim(),
      imageUrl: imageUrl.trim() || undefined,
      cadFileAvailable: true,
      pdfDatasheetUrl: '#datasheet-' + sku,
      dimensions: [],
      specs: [
        { key: 'mat', label: 'Материал изготовления', value: materialCode, category: 'Metallurgy' },
        { key: 'surf', label: 'Обработка поверхности', value: surfaceFinish, category: 'Geometry' },
      ],
      crossReferences: crossRefs,
      fitments: fitments,
      certificates: [
        {
          name: 'Инженерный сертификат качества Luxor',
          isoStandard: 'ISO 9001:2015 / ECE R90',
          result: 'Прошел лабораторные испытания',
          date: '2026-01-15',
          inspectorId: 'QC-Luxor-DE',
        },
      ],
    };

    onSavePart(newPart);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-gray-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto text-xs">
        {/* Header */}
        <div className="bg-[#1E293B] text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#1B4E9B] text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono">
                {partToEdit ? 'Редактировать карточку товара' : 'Создать новую карточку товара (Администратор)'}
              </h2>
              <p className="text-[11px] text-gray-300">
                Заполните название, OEM кросс-номера, применимость и цену
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

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Main Product Details */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-[#1E4E8C] font-mono uppercase flex items-center space-x-1.5">
              <Tag className="w-4 h-4" />
              <span>1. Основная информация и артикулы</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Торговая марка / Бренд *</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-gray-900 focus:border-amber-600 outline-none font-bold"
                >
                  <option value="dextra">DEXTRA (Choice of mechanics)</option>
                  <option value="kaido">KAIDO (Japan & Euro Suspension)</option>
                  <option value="katsumoto">KATSUMOTO (勝利 • High Tech)</option>
                  <option value="luxor">LUXOR (Electronics & Thermal)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Артикул товара (SKU) *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="LX-1001-BRK"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Код 1С / Название детали *</label>
                <input
                  type="text"
                  required
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  placeholder="LFS 0550"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Продуктовая Линия</label>
                <select
                  value={productLine}
                  onChange={(e) => setProductLine(e.target.value as any)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-medium"
                >
                  <option value="Luxor HeavyDuty">Luxor HeavyDuty</option>
                  <option value="Luxor Precision">Luxor Precision</option>
                  <option value="Luxor HighCarbon">Luxor HighCarbon</option>
                  <option value="Luxor ProTurbo">Luxor ProTurbo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Полное наименование детали *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Кожух вентилятора охлаждения для автомобилей Chevrolet Cruze (09-)"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Категория *</label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-medium"
                >
                  {existingCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Подкатегория / Группа</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="Кожухи вентилятора"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Оптовая цена (Руб) *</label>
                <input
                  type="number"
                  required
                  value={priceRub}
                  onChange={(e) => setPriceRub(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Старая цена (Руб)</label>
                <input
                  type="number"
                  value={oldPriceRub}
                  onChange={(e) => setOldPriceRub(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Описание запчасти и особенности</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Указание конструктивных особенностей, материалов и штатных креплений..."
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-[#1E4E8C] outline-none"
              />
            </div>
          </div>

          {/* Section 1.5: Photo Upload / Image Settings */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-[#1E4E8C] font-mono uppercase flex items-center space-x-1.5">
              <Image className="w-4 h-4" />
              <span>Фотография товара / Загрузка изображения</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Column: Upload Methods */}
              <div className="md:col-span-8 space-y-4">
                {/* Method 1: File Upload */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                  <div className="font-bold text-gray-800 text-xs flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-[#1B4E9B]" />
                    <span>Загрузить фото с устройства (Компьютер / Смартфон)</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Выберите файл формата JPG, PNG, WEBP. Изображение будет сохранено в базе данных.
                  </p>
                  <label className="inline-flex items-center space-x-2 bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Загрузить PNG с компьютера</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Method 2: Direct URL */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                  <div className="font-bold text-gray-800 text-xs flex items-center space-x-1.5">
                    <Link className="w-4 h-4 text-[#1B4E9B]" />
                    <span>Или укажите прямую ссылку (URL) на картинку</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/photo-part.jpg"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono text-xs"
                    />
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-2 rounded-xl text-xs whitespace-nowrap flex items-center space-x-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Удалить</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Preview Box */}
              <div className="md:col-span-4 h-48 bg-white border-2 border-dashed border-gray-300 rounded-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden text-center">
                {imageUrl ? (
                  <div className="w-full h-full relative group flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Превью загруженной детали"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs font-mono">
                      Фото готово
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 space-y-2 p-2">
                    <Camera className="w-10 h-10 mx-auto text-gray-300" />
                    <div className="text-xs font-bold text-gray-600">Фотография не загружена</div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                      Если фото не выбрано, каталог автоматически отобразит векторную 2D-схему детали
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications & Stock */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-[#1E4E8C] font-mono uppercase flex items-center space-x-1.5">
              <Layers className="w-4 h-4" />
              <span>2. Технические свойства и складской учет</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Материал</label>
                <input
                  type="text"
                  value={materialCode}
                  onChange={(e) => setMaterialCode(e.target.value)}
                  placeholder="PA66-GF30 / GG25 HC"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Обработка поверхности</label>
                <input
                  type="text"
                  value={surfaceFinish}
                  onChange={(e) => setSurfaceFinish(e.target.value)}
                  placeholder="Geomet 500 Anti-Corrosion"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Масса нетто (кг)</label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Штрихкод EAN-13</label>
                <input
                  type="text"
                  value={eanBarcode}
                  onChange={(e) => setEanBarcode(e.target.value)}
                  placeholder="7930177800758"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Статус наличия</label>
                <select
                  value={inStockStatus}
                  onChange={(e) => setInStockStatus(e.target.value as any)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none font-medium"
                >
                  <option value="In Stock">В наличии (In Stock)</option>
                  <option value="Production Run">В производстве</option>
                  <option value="Special Order">Под заказ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Локация на складе</label>
                <input
                  type="text"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  placeholder="Склад А1-12 (Москва)"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:border-[#1E4E8C] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: OEM Cross References */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-[#1E4E8C] font-mono uppercase flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>3. OEM Кросс-номера (Привязка артикулов)</span>
            </h3>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Бренд (например: Chevrolet, LADA, BMW)"
                className="w-1/3 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none"
              />
              <input
                type="text"
                value={newOem}
                onChange={(e) => setNewOem(e.target.value)}
                placeholder="OEM номер (например: 13267630)"
                className="w-1/2 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleAddCrossRef}
                className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить</span>
              </button>
            </div>

            {/* List of Cross References */}
            <div className="flex flex-wrap gap-2 pt-2">
              {crossRefs.map((cr) => (
                <div
                  key={cr.id}
                  className="bg-white border border-gray-300 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs font-mono"
                >
                  <span className="font-bold text-[#1E4E8C]">{cr.brand}:</span>
                  <span className="font-black text-gray-900">{cr.oemNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCrossRef(cr.id)}
                    className="text-gray-400 hover:text-rose-600 transition ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Fitments */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <h3 className="text-xs font-bold text-[#1E4E8C] font-mono uppercase flex items-center space-x-1.5">
              <Wrench className="w-4 h-4" />
              <span>4. Применяемость по автомобилям</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={fitMake}
                onChange={(e) => setFitMake(e.target.value)}
                placeholder="Марка (Chevrolet)"
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none"
              />
              <input
                type="text"
                value={fitModel}
                onChange={(e) => setFitModel(e.target.value)}
                placeholder="Модель (Cruze J300)"
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none"
              />
              <input
                type="text"
                value={fitEngine}
                onChange={(e) => setFitEngine(e.target.value)}
                placeholder="Двигатель (F18D4)"
                className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleAddFitment}
                className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-3 py-2 rounded-xl flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Привязать авто</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {fitments.map((fit) => (
                <div
                  key={fit.id}
                  className="bg-white border border-gray-200 p-2.5 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <strong className="text-gray-900 font-bold">{fit.make} {fit.model}</strong>
                    <span className="text-gray-500 font-mono text-[11px] ml-2">
                      (Двигатель: {fit.engineCode} | {fit.powerHp} л.с.)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFitment(fit.id)}
                    className="text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-7 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить товар</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

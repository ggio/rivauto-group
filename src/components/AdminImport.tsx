import React, { useState } from 'react';
import { LuxorPart } from '../types/catalog';
import { Upload, Download, CheckCircle2, ArrowRight, FileText } from 'lucide-react';

interface AdminImportProps {
  onImportParts: (newParts: LuxorPart[]) => void;
}

const SAMPLE_CSV = `SKU;Title;Category;CategorySlug;Subcategory;Material;WeightKg;PriceRub;OEM_Brand;OEM_Number;Fitment_Make;Fitment_Model;Fitment_Engine;ImageUrl
LX-4100-HC;Диск тормозной вентилируемый задний;Тормозные системы;brakes;Диски тормозные;GG25 HC;8.90;12400;BMW;34216860019;BMW;5 Series G30;B48B20O1;https://images.unsplash.com/photo-1600706432523-9914c6223a2a?w=600&auto=format&fit=crop
LX-5520-ARM;Рычаг подвески передний верхний;Компоненты подвески;suspension;Рычаги;AlMgSi1 6082-T6;2.45;8900;Audi;4M0407509A;Audi;Q7 4M;CVMD;
LX-1055-FIL;Фильтр масляный картридж синтетический;Фильтры;filtration;Фильтры масляные;MicroGlass;0.22;950;Volkswagen;059198406;Volkswagen;Touareg 7P;CVVA;`;

export const AdminImport: React.FC<AdminImportProps> = ({ onImportParts }) => {
  const [csvContent, setCsvContent] = useState<string>(SAMPLE_CSV);
  const [step, setStep] = useState<'upload' | 'success'>('upload');
  const [importedCount, setImportedCount] = useState<number>(0);

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'luxor_parts_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteImport = () => {
    const lines = csvContent.trim().split('\n');
    if (lines.length <= 1) return;

    const parsedParts: LuxorPart[] = [];
    const rows = lines.slice(1);

    rows.forEach((row, idx) => {
      const cols = row.split(';').map((c) => c.trim());
      if (!cols[0]) return;

      const sku = cols[0] || `LX-IMP-${idx + 1}`;
      const title = cols[1] || 'Импортированный автокомпонент';
      const category = cols[2] || 'Автокомпоненты';
      const categorySlug = cols[3] || 'all';
      const subcategory = cols[4] || 'Общая группа';
      const materialCode = cols[5] || 'PA66-GF30 / GG25 HC';
      const weightKg = parseFloat(cols[6]) || 1.5;
      const priceRub = parseInt(cols[7]) || 3000;
      const oemBrand = cols[8] || 'OEM';
      const oemNum = cols[9] || '1000000';
      const fitMake = cols[10] || 'Универсальный';
      const fitModel = cols[11] || 'Седан';
      const fitEngine = cols[12] || 'Бензин';
      const imageUrl = cols[13] || undefined;

      const cleanOem = oemNum.replace(/[^a-zA-Z0-9]/g, '');

      const part: LuxorPart = {
        id: `imp-${Date.now()}-${idx}`,
        sku: sku,
        itemCode: sku,
        title: title,
        category: category,
        categorySlug: categorySlug,
        subcategory: subcategory,
        productLine: 'Luxor HeavyDuty',
        priceRub: priceRub,
        oldPriceRub: Math.round(priceRub * 1.15),
        description: `Импортированная позиция номенклатуры Luxor. Сертифицировано ISO 9001.`,
        drawingType: 'BrakeDisc2D',
        materialCode: materialCode,
        surfaceFinish: 'Защитное антикоррозионное покрытие',
        weightKg: weightKg,
        eanBarcode: `7930177${Math.floor(100000 + Math.random() * 900000)}`,
        inStockStatus: 'In Stock',
        warehouseLocation: 'Центральный склад Luxor',
        imageUrl: imageUrl,
        cadFileAvailable: true,
        pdfDatasheetUrl: `#datasheet-${sku}`,
        dimensions: [],
        specs: [],
        crossReferences: [
          {
            id: `cr-imp-${idx}`,
            brand: oemBrand,
            oemNumber: oemNum,
            normalizedNumber: cleanOem,
            type: 'OEM',
          },
        ],
        fitments: [
          {
            id: `vf-imp-${idx}`,
            make: fitMake,
            model: fitModel,
            yearStart: 2012,
            yearEnd: 2024,
            engineCode: fitEngine,
            displacementCc: 2000,
            powerKw: 110,
            powerHp: 150,
            fuelType: 'Petrol',
            position: 'Front Axle',
          },
        ],
        certificates: [],
      };

      parsedParts.push(part);
    });

    setImportedCount(parsedParts.length);
    setStep('success');
    onImportParts(parsedParts);
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-5xl mx-auto font-sans text-xs">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#1E4E8C]/10 text-[#1E4E8C] border border-[#1E4E8C]/20">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 font-mono">
              Импорт номенклатуры и CSV каталога (Администратор)
            </h2>
            <p className="text-gray-500 text-xs">
              Массовая загрузка артикулов, OEM кросс-номеров и цен в базу данных
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-xl border border-gray-200 transition flex items-center space-x-1.5 font-medium"
        >
          <Download className="w-4 h-4 text-[#1E4E8C]" />
          <span>Скачать CSV шаблон</span>
        </button>
      </div>

      {step === 'upload' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Данные CSV номенклатуры (разделитель точка с запятой ';'):
            </label>
            <textarea
              rows={10}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 p-4 rounded-xl font-mono text-xs focus:border-[#1E4E8C] outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExecuteImport}
              className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider flex items-center space-x-2 transition shadow-xs"
            >
              <span>Загрузить данные в каталог</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">Импорт успешно завершен!</h3>
          <p className="text-gray-600">
            В каталог добавлены <strong className="text-gray-900">{importedCount} новых позиций</strong>.
          </p>
          <button
            onClick={() => setStep('upload')}
            className="bg-white border border-gray-300 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs"
          >
            Загрузить еще один реестр
          </button>
        </div>
      )}
    </div>
  );
};

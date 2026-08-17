import React, { useState } from 'react';
import { VehicleSelection } from '../types/catalog';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';

interface SmartSearchProps {
  onSearchOem: (query: string) => void;
  onSelectVehicle: (selection: VehicleSelection) => void;
  onSearchVin: (vin: string) => void;
  activeVehicle: VehicleSelection | null;
  onClearVehicle: () => void;
  selectedSubcategory?: string;
  onSelectSubcategory?: (sub: string) => void;
}

const MAKES = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Chevrolet', 'LADA', 'Renault', 'Skoda', 'Toyota'];

const MODELS_BY_MAKE: Record<string, string[]> = {
  Chevrolet: ['Cruze (09-)', 'Orlando (11-)', 'Aveo (11-)'],
  LADA: ['Priora (07-)', 'Largus (12-)', 'Niva Chevrolet (02-)', 'Vesta (15-)'],
  Renault: ['Logan (08-)', 'Sandero (08-)', 'Duster (11-)'],
  Skoda: ['Octavia A5 (04-)', 'Octavia A7 (13-)', 'Rapid (12-)'],
  BMW: ['5 Серия (G30)', '3 Серия (F30)', 'X5 (G05)'],
  'Mercedes-Benz': ['E-Class (W213)', 'C-Class (W205)'],
  Audi: ['A6 (C7/C8)', 'A4 (B9)', 'Q7 (4M)'],
  Volkswagen: ['Golf V/VI', 'Passat B6/B7', 'Touareg'],
};

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002];

const SUBCATEGORIES = [
  { name: 'Электровентиляторы охлаждения', count: 322 },
  { name: 'Электровентиляторы отопителя', count: 416 },
  { name: 'Электровентиляторы кондиционера', count: 50 },
  { name: 'Кожухи вентилятора', count: 8 },
  { name: 'Муфты вентилятора', count: 135 },
  { name: 'Резисторы и модули управления', count: 180 },
  { name: 'Модули управления вентилятора', count: 21 },
  { name: 'Резисторы нагрузочные', count: 159 },
];

export const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearchOem,
  onSelectVehicle,
  activeVehicle,
  onClearVehicle,
  selectedSubcategory,
  onSelectSubcategory,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Вентиляторы');
  const [selectedMake, setSelectedMake] = useState(activeVehicle?.make || '');
  const [selectedModel, setSelectedModel] = useState(activeVehicle?.model || '');
  const [selectedYear, setSelectedYear] = useState<string>(activeVehicle?.year ? String(activeVehicle.year) : '');
  const [selectedEngine, setSelectedEngine] = useState(activeVehicle?.engineCode || '');
  const [selectedMod, setSelectedMod] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchOem(searchInput.trim());
    } else if (selectedMake) {
      onSelectVehicle({
        make: selectedMake,
        model: selectedModel || 'Все модели',
        year: selectedYear ? Number(selectedYear) : null,
        engineCode: selectedEngine,
      });
    } else {
      onSearchOem('');
    }
  };

  const handleReset = () => {
    setSearchInput('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
    setSelectedMod('');
    onClearVehicle();
    if (onSelectSubcategory) onSelectSubcategory('');
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* 1. Subcategories Horizontal Link Bar (Matching Screenshot 2) */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-none text-gray-700">
        {SUBCATEGORIES.map((sub) => {
          const isActive = selectedSubcategory === sub.name;
          return (
            <button
              key={sub.name}
              onClick={() => onSelectSubcategory && onSelectSubcategory(isActive ? '' : sub.name)}
              className={`whitespace-nowrap transition py-1 text-xs font-medium flex items-center space-x-1 border-b-2 ${
                isActive
                  ? 'border-[#1B4E9B] text-[#1B4E9B] font-bold'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <span>{sub.name}</span>
              <span className="text-gray-400 font-mono">({sub.count})</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Search & Filter Control Bar (Matching Screenshot 2) */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl border border-gray-200/90 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:space-x-2">
        {/* Left Search Box */}
        <div className="relative flex-1 min-w-[180px]">
          <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-xl focus-within:border-[#1B4E9B] focus-within:bg-white transition px-3 py-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Я ищу..."
              className="w-full bg-transparent text-gray-900 text-xs focus:outline-none placeholder-gray-500 pr-6 font-medium"
            />
            <Search className="w-4 h-4 text-[#1B4E9B] absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none focus:border-[#1B4E9B]"
            >
              <option value="Вентиляторы">Вентиляторы</option>
              <option value="Радиаторы">Радиаторы</option>
              <option value="Насосы водяные">Насосы водяные</option>
              <option value="Термостаты">Термостаты</option>
              <option value="Компрессоры кондиционера">Компрессоры кондиционера</option>
              <option value="Турбокомпрессоры">Турбокомпрессоры</option>
              <option value="Фильтры">Фильтры</option>
              <option value="Фары и оптика">Фары и оптика</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Make Dropdown */}
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel('');
              }}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none focus:border-[#1B4E9B]"
            >
              <option value="">Марка</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Model Dropdown */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none focus:border-[#1B4E9B] disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Модель</option>
              {selectedMake &&
                MODELS_BY_MAKE[selectedMake]?.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none focus:border-[#1B4E9B]"
            >
              <option value="">Год</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Engine Dropdown */}
          <div className="relative">
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none focus:border-[#1B4E9B]"
            >
              <option value="">Объем двигате...</option>
              <option value="1.6L">1.6L Petrol</option>
              <option value="1.8L">1.8L Petrol</option>
              <option value="2.0L">2.0L Turbo</option>
              <option value="3.0L">3.0L TDI / TFSI</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Modification Dropdown */}
          <div className="relative">
            <select
              value={selectedMod}
              onChange={(e) => setSelectedMod(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none focus:border-[#1B4E9B]"
            >
              <option value="">Модификация</option>
              <option value="A/C">С кондиционером (A/C)</option>
              <option value="no-AC">Без кондиционера</option>
              <option value="HeavyDuty">Усиленный радиатор</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Action Button: Solid Royal Blue "НАЙТИ" */}
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            className="w-full lg:w-auto bg-[#1B4E9B] hover:bg-[#153D7A] active:bg-[#0F2D5C] text-white font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider transition shadow-xs"
          >
            НАЙТИ
          </button>

          {(searchInput || selectedMake || activeVehicle) && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              title="Сбросить поиск"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

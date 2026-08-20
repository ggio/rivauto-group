import React, { useState } from 'react';
import { 
  ShieldCheck, Wrench, Search, CheckCircle2, ArrowRight, FileText, 
  Cpu, Award, Layers, Zap, Download, Phone, Mail, MapPin, ExternalLink,
  ChevronRight, ChevronLeft, Sparkles, Building2, PackageCheck, Barcode, Edit2, Plus,
  Globe, ArrowLeft, Move, Image, Maximize2, Settings, Sliders, Link2, X, Upload,
  Edit, Trash2, SlidersHorizontal, RotateCcw, Type, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { LuxorPart, VehicleSelection, BrandItem } from '../types/catalog';
import { MOCK_PARTS, LUXOR_CATEGORIES } from '../data/mockParts';
import { INITIAL_BRANDS } from '../data/mockBrands';
import { PartImage } from './PartImage';
import { CategoryItem } from './CategoryManagerModal';
import { BrandShowcaseGrid } from './BrandShowcaseGrid';

import { SiteAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS, WholesaleLead } from '../types/theme';

interface BrandLandingProps {
  categories?: CategoryItem[];
  brands?: BrandItem[];
  selectedBrandId?: string;
  onSelectBrand?: (brandId: string) => void;
  parts?: LuxorPart[];
  isAdmin?: boolean;
  appearanceSettings?: SiteAppearanceSettings;
  onUpdateAppearanceSettings?: (updated: Partial<SiteAppearanceSettings>) => void;
  wholesaleLeads?: WholesaleLead[];
  onSubmitWholesaleLead?: (lead: Omit<WholesaleLead, 'id' | 'createdAt'>) => void;
  onDeleteWholesaleLead?: (leadId: string) => void;
  onOpenManageCategories?: (catToEdit?: CategoryItem) => void;
  onOpenManageBrands?: () => void;
  onOpenAddProduct?: () => void;
  onEditPart?: (part: LuxorPart) => void;
  onDeletePart?: (partId: string) => void;
  onMovePart?: (partId: string, direction: 'left' | 'right') => void;
  onGoToCatalog: () => void;
  onSearchOem: (query: string) => void;
  onOpenDetail: (part: LuxorPart) => void;
  onSelectVehicle?: (vehicle: VehicleSelection) => void;
  onGoToNav?: (nav: 'catalog' | 'admin' | 'architecture' | 'quality' | 'ai') => void;
  onSelectCategory?: (categorySlug: string) => void;
  onUpdateBrand?: (brandId: string, updatedFields: Partial<BrandItem>) => void;
}

export const BrandLanding: React.FC<BrandLandingProps> = ({
  categories = LUXOR_CATEGORIES,
  brands = INITIAL_BRANDS,
  selectedBrandId = 'all',
  onSelectBrand = (_b?: string) => {},
  parts = MOCK_PARTS,
  isAdmin = false,
  appearanceSettings,
  onUpdateAppearanceSettings,
  wholesaleLeads = [],
  onSubmitWholesaleLead,
  onDeleteWholesaleLead,
  onOpenManageCategories,
  onOpenManageBrands,
  onOpenAddProduct,
  onEditPart,
  onDeletePart,
  onMovePart,
  onGoToCatalog,
  onSearchOem,
  onOpenDetail,
  onSelectCategory,
  onUpdateBrand,
}) => {
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [isEditingPopularTitle, setIsEditingPopularTitle] = useState(false);
  const [tempPopularTitle, setTempPopularTitle] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    role: 'Дистрибьютор',
    message: '',
  });

  // Direct Mouse Drag-and-Drop for Hero Banner TEXT
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragStartTextPos, setDragStartTextPos] = useState({ x: 0, y: 0 });
  const [initialTextOffset, setInitialTextOffset] = useState({ x: 0, y: 0 });
  const [currentTextOffsetX, setCurrentTextOffsetX] = useState(appearanceSettings?.heroTextOffsetX || 0);
  const [currentTextOffsetY, setCurrentTextOffsetY] = useState(appearanceSettings?.heroTextOffsetY || 0);

  // Direct Mouse Drag-and-Drop for Hero Banner SEARCH
  const [isDraggingSearch, setIsDraggingSearch] = useState(false);
  const [dragStartSearchPos, setDragStartSearchPos] = useState({ x: 0, y: 0 });
  const [initialSearchOffset, setInitialSearchOffset] = useState({ x: 0, y: 0 });
  const [currentSearchOffsetX, setCurrentSearchOffsetX] = useState(appearanceSettings?.heroSearchOffsetX || 0);
  const [currentSearchOffsetY, setCurrentSearchOffsetY] = useState(appearanceSettings?.heroSearchOffsetY || 0);

  // Direct Mouse Drag, Resize & Opacity for Hero PNG LOGO
  const [currentLogoOffsetX, setCurrentLogoOffsetX] = useState(appearanceSettings?.heroLogoOffsetX || 0);
  const [currentLogoOffsetY, setCurrentLogoOffsetY] = useState(appearanceSettings?.heroLogoOffsetY || 0);
  const [currentLogoWidthPx, setCurrentLogoWidthPx] = useState(appearanceSettings?.heroLogoWidthPx || 200);
  const [currentLogoOpacity, setCurrentLogoOpacity] = useState(appearanceSettings?.heroLogoOpacity ?? 100);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [dragStartLogoPos, setDragStartLogoPos] = useState({ x: 0, y: 0 });
  const [initialLogoOffset, setInitialLogoOffset] = useState({ x: 0, y: 0 });

  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const [resizeStartWidth, setResizeStartWidth] = useState(200);
  const [resizeStartMouseX, setResizeStartMouseX] = useState(0);

  const [showLogoUrlModal, setShowLogoUrlModal] = useState(false);
  const [logoUrlInput, setLogoUrlInput] = useState(appearanceSettings?.heroLogoUrl || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileSelected = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения (.png, .svg, .webp и т.д.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setLogoUrlInput(dataUrl);
        if (onUpdateAppearanceSettings) {
          onUpdateAppearanceSettings({ heroLogoUrl: dataUrl });
        }
        setShowLogoUrlModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync state if settings updated externally or when selectedBrandId changes
  React.useEffect(() => {
    if (!isDraggingText) {
      if (selectedBrandId === 'all') {
        setCurrentTextOffsetX(appearanceSettings?.heroTextOffsetX || 0);
        setCurrentTextOffsetY(appearanceSettings?.heroTextOffsetY || 0);
      } else {
        const prefix = selectedBrandId as 'kaido' | 'katsumoto' | 'luxor' | 'dextra';
        const xKey = `${prefix}TextOffsetX` as keyof SiteAppearanceSettings;
        const yKey = `${prefix}TextOffsetY` as keyof SiteAppearanceSettings;
        setCurrentTextOffsetX((appearanceSettings?.[xKey] as number) || 0);
        setCurrentTextOffsetY((appearanceSettings?.[yKey] as number) || 0);
      }
    }
  }, [selectedBrandId, appearanceSettings, isDraggingText]);

  React.useEffect(() => {
    if (!isDraggingSearch) {
      setCurrentSearchOffsetX(appearanceSettings?.heroSearchOffsetX || 0);
      setCurrentSearchOffsetY(appearanceSettings?.heroSearchOffsetY || 0);
    }
  }, [appearanceSettings?.heroSearchOffsetX, appearanceSettings?.heroSearchOffsetY, isDraggingSearch]);

  React.useEffect(() => {
    if (!isDraggingLogo) {
      if (selectedBrandId === 'all') {
        setCurrentLogoOffsetX(appearanceSettings?.heroLogoOffsetX || 0);
        setCurrentLogoOffsetY(appearanceSettings?.heroLogoOffsetY || 0);
      } else {
        const prefix = selectedBrandId as 'kaido' | 'katsumoto' | 'luxor' | 'dextra';
        const xKey = `${prefix}LogoOffsetX` as keyof SiteAppearanceSettings;
        const yKey = `${prefix}LogoOffsetY` as keyof SiteAppearanceSettings;
        setCurrentLogoOffsetX((appearanceSettings?.[xKey] as number) || 0);
        setCurrentLogoOffsetY((appearanceSettings?.[yKey] as number) || 0);
      }
    }
  }, [selectedBrandId, appearanceSettings, isDraggingLogo]);

  React.useEffect(() => {
    if (!isResizingLogo) {
      setCurrentLogoWidthPx(appearanceSettings?.heroLogoWidthPx || 200);
    }
  }, [appearanceSettings?.heroLogoWidthPx, isResizingLogo]);

  React.useEffect(() => {
    setCurrentLogoOpacity(appearanceSettings?.heroLogoOpacity ?? 100);
  }, [appearanceSettings?.heroLogoOpacity]);

  // Global mousemove and mouseup listeners during TEXT drag
  React.useEffect(() => {
    if (!isDraggingText) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartTextPos.x;
      const dy = e.clientY - dragStartTextPos.y;
      const newX = Math.round(initialTextOffset.x + dx);
      const newY = Math.round(initialTextOffset.y + dy);
      setCurrentTextOffsetX(newX);
      setCurrentTextOffsetY(newY);
    };

    const handleMouseUp = () => {
      setIsDraggingText(false);
      if (onUpdateAppearanceSettings) {
        if (selectedBrandId === 'all') {
          onUpdateAppearanceSettings({
            heroTextOffsetX: currentTextOffsetX,
            heroTextOffsetY: currentTextOffsetY,
          });
        } else {
          const prefix = selectedBrandId as 'kaido' | 'katsumoto' | 'luxor' | 'dextra';
          const xKey = `${prefix}TextOffsetX` as keyof SiteAppearanceSettings;
          const yKey = `${prefix}TextOffsetY` as keyof SiteAppearanceSettings;
          onUpdateAppearanceSettings({
            [xKey]: currentTextOffsetX,
            [yKey]: currentTextOffsetY,
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingText, dragStartTextPos, initialTextOffset, currentTextOffsetX, currentTextOffsetY, selectedBrandId, onUpdateAppearanceSettings]);

  // Global mousemove and mouseup listeners during SEARCH drag
  React.useEffect(() => {
    if (!isDraggingSearch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartSearchPos.x;
      const dy = e.clientY - dragStartSearchPos.y;
      const newX = Math.round(initialSearchOffset.x + dx);
      const newY = Math.round(initialSearchOffset.y + dy);
      setCurrentSearchOffsetX(newX);
      setCurrentSearchOffsetY(newY);
    };

    const handleMouseUp = () => {
      setIsDraggingSearch(false);
      if (onUpdateAppearanceSettings) {
        onUpdateAppearanceSettings({
          heroSearchOffsetX: currentSearchOffsetX,
          heroSearchOffsetY: currentSearchOffsetY,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSearch, dragStartSearchPos, initialSearchOffset, currentSearchOffsetX, currentSearchOffsetY, onUpdateAppearanceSettings]);

  // Global mousemove and mouseup listeners during LOGO POSITION drag
  React.useEffect(() => {
    if (!isDraggingLogo) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartLogoPos.x;
      const dy = e.clientY - dragStartLogoPos.y;
      const newX = Math.round(initialLogoOffset.x + dx);
      const newY = Math.round(initialLogoOffset.y + dy);
      setCurrentLogoOffsetX(newX);
      setCurrentLogoOffsetY(newY);
    };

    const handleMouseUp = () => {
      setIsDraggingLogo(false);
      if (onUpdateAppearanceSettings) {
        if (selectedBrandId === 'all') {
          onUpdateAppearanceSettings({
            heroLogoOffsetX: currentLogoOffsetX,
            heroLogoOffsetY: currentLogoOffsetY,
          });
        } else {
          const prefix = selectedBrandId as 'kaido' | 'katsumoto' | 'luxor' | 'dextra';
          const xKey = `${prefix}LogoOffsetX` as keyof SiteAppearanceSettings;
          const yKey = `${prefix}LogoOffsetY` as keyof SiteAppearanceSettings;
          onUpdateAppearanceSettings({
            [xKey]: currentLogoOffsetX,
            [yKey]: currentLogoOffsetY,
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLogo, dragStartLogoPos, initialLogoOffset, currentLogoOffsetX, currentLogoOffsetY, selectedBrandId, onUpdateAppearanceSettings]);

  // Global mousemove and mouseup listeners during LOGO RESIZING
  React.useEffect(() => {
    if (!isResizingLogo) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStartMouseX;
      const newWidth = Math.max(60, Math.min(800, Math.round(resizeStartWidth + dx * 2)));
      setCurrentLogoWidthPx(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingLogo(false);
      if (onUpdateAppearanceSettings) {
        onUpdateAppearanceSettings({
          heroLogoWidthPx: currentLogoWidthPx,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLogo, resizeStartMouseX, resizeStartWidth, currentLogoWidthPx, onUpdateAppearanceSettings]);

  const handleMouseDownLogo = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a') ||
      target.dataset.resize === 'true' ||
      target.closest('[data-resize="true"]')
    ) {
      return;
    }
    e.preventDefault();
    setIsDraggingLogo(true);
    setDragStartLogoPos({ x: e.clientX, y: e.clientY });
    setInitialLogoOffset({ x: currentLogoOffsetX, y: currentLogoOffsetY });
  };

  const handleMouseDownResizeLogo = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizingLogo(true);
    setResizeStartMouseX(e.clientX);
    setResizeStartWidth(currentLogoWidthPx);
  };

  const handleMouseDownText = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a')
    ) {
      return;
    }
    e.preventDefault();
    setIsDraggingText(true);
    setDragStartTextPos({ x: e.clientX, y: e.clientY });
    setInitialTextOffset({ x: currentTextOffsetX, y: currentTextOffsetY });
  };

  const handleMouseDownSearch = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a')
    ) {
      return;
    }
    e.preventDefault();
    setIsDraggingSearch(true);
    setDragStartSearchPos({ x: e.clientX, y: e.clientY });
    setInitialSearchOffset({ x: currentSearchOffsetX, y: currentSearchOffsetY });
  };

  const handleSelectBrandCard = (brandId: string) => {
    if (brandId === 'dextra' && appearanceSettings?.dextraExternalUrl) {
      window.open(appearanceSettings.dextraExternalUrl, '_blank');
      return;
    }
    if (brandId === 'kaido' && appearanceSettings?.kaidoExternalUrl) {
      window.open(appearanceSettings.kaidoExternalUrl, '_blank');
      return;
    }
    if (brandId === 'katsumoto' && appearanceSettings?.katsumotoExternalUrl) {
      window.open(appearanceSettings.katsumotoExternalUrl, '_blank');
      return;
    }
    if (brandId === 'luxor' && appearanceSettings?.luxorExternalUrl) {
      window.open(appearanceSettings.luxorExternalUrl, '_blank');
      return;
    }
    onSelectBrand(brandId);
    onGoToCatalog();
  };

  const activeBrand = brands.find((b) => b.id === selectedBrandId);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      onSearchOem(quickSearchInput.trim());
    } else {
      onGoToCatalog();
    }
  };

  const handleCategoryClick = (catSlug: string) => {
    if (onSelectCategory) {
      onSelectCategory(catSlug);
    }
    onGoToCatalog();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.companyName.trim() || !contactForm.email.trim() || !contactForm.phone.trim()) {
      return;
    }
    if (onSubmitWholesaleLead) {
      onSubmitWholesaleLead({
        companyName: contactForm.companyName.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        brand: selectedBrandId === 'all' ? 'Все бренды (Холдинг)' : selectedBrandId.toUpperCase(),
      });
    }
    setContactSubmitted(true);
    setContactForm({
      companyName: '',
      email: '',
      phone: '',
      role: 'Дистрибьютор',
      message: '',
    });
  };

  const displayCategories = categories.filter((c) => c.slug !== 'all');

  // Parts filtered by current brand
  const brandParts = selectedBrandId === 'all' 
    ? parts 
    : parts.filter((p) => (p.brandId || 'luxor') === selectedBrandId);

  return (
    <div className="space-y-12 font-sans text-gray-800">
      {/* 1. HERO HEADER SECTION */}
      {selectedBrandId === 'all' ? (
        /* RIVAUTO GROUP PARENT HOLDING HERO BANNER */
        <section 
          className="border border-slate-700/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden text-white flex items-center justify-center bg-slate-950 transition-all duration-300"
          style={{
            minHeight: `${appearanceSettings?.heroBannerHeightPx || 420}px`,
            paddingTop: `${appearanceSettings?.heroPaddingYPx || 40}px`,
            paddingBottom: `${appearanceSettings?.heroPaddingYPx || 40}px`,
          }}
        >
          {appearanceSettings?.heroBannerBgUrl ? (
            <div className="absolute inset-0 z-0">
              <img
                src={appearanceSettings.heroBannerBgUrl}
                alt="Main Hero Banner Background"
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: (appearanceSettings.heroBannerOpacity ?? 80) / 100 }}
              />
              {/* Semi-transparent dark scrim overlay for optimal text readability */}
              <div 
                className="absolute inset-0 bg-slate-950 transition-opacity duration-300 pointer-events-none" 
                style={{ opacity: (appearanceSettings.heroBannerOverlayDarkness ?? 50) / 100 }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 z-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          )}

          {/* INTERACTIVE FRAMELESS TRANSPARENT PNG LOGO BLOCK */}
          <div
            onMouseDown={handleMouseDownLogo}
            className={`absolute z-20 group transition-shadow select-none ${
              isDraggingLogo ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `translate3d(${currentLogoOffsetX}px, ${currentLogoOffsetY}px, 0)`,
              transition: (isDraggingLogo || isResizingLogo) ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
              width: `${currentLogoWidthPx}px`,
            }}
          >
            <div className="relative bg-transparent border-none p-1">
              {appearanceSettings?.heroLogoUrl ? (
                <img
                  src={appearanceSettings.heroLogoUrl}
                  alt="PNG Logo"
                  className="w-full h-auto object-contain pointer-events-none drop-shadow-2xl select-none"
                  style={{ opacity: currentLogoOpacity / 100 }}
                />
              ) : (
                <div className="border border-dashed border-white/30 hover:border-amber-400 bg-slate-900/40 hover:bg-slate-900/70 backdrop-blur-xs rounded-2xl p-3 text-center transition shadow-lg flex flex-col items-center space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-slate-950 font-mono text-xs font-black bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-xl shadow-md transition inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-950" />
                    <span>📁 Загрузить PNG с компьютера</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrlInput(appearanceSettings?.heroLogoUrl || '');
                      setShowLogoUrlModal(true);
                    }}
                    className="text-amber-300 hover:text-white font-mono text-[11px] underline transition inline-flex items-center space-x-1"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>или вставить URL изображения</span>
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFileSelected(file);
                  e.target.value = '';
                }}
              />

              {/* Floating Controls Bar on Hover (Admin Only) */}
              {isAdmin && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white border border-slate-700/80 rounded-xl px-2.5 py-1 text-[11px] font-mono flex items-center space-x-2 shadow-2xl backdrop-blur-md whitespace-nowrap z-30">
                  <Move className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" title="Перетаскивайте мышью по баннеру" />
                  
                  {/* Opacity Control Slider */}
                  <div className="flex items-center space-x-1 border-x border-slate-700 px-2">
                    <span className="text-slate-400 text-[10px]">Прозрачность:</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={currentLogoOpacity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCurrentLogoOpacity(val);
                        if (onUpdateAppearanceSettings) {
                          onUpdateAppearanceSettings({ heroLogoOpacity: val });
                        }
                      }}
                      className="w-16 h-1 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-amber-300 font-bold w-6 text-right">{currentLogoOpacity}%</span>
                  </div>

                  <span className="text-slate-400 text-[10px]">{currentLogoWidthPx}px</span>

                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrlInput(appearanceSettings?.heroLogoUrl || '');
                      setShowLogoUrlModal(true);
                    }}
                    className="hover:text-amber-400 text-slate-300 transition flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-slate-800"
                    title="Изменить URL PNG логотипа"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="text-[10px]">URL</span>
                  </button>

                  {(currentLogoOffsetX !== 0 || currentLogoOffsetY !== 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentLogoOffsetX(0);
                        setCurrentLogoOffsetY(0);
                        if (onUpdateAppearanceSettings) {
                          onUpdateAppearanceSettings({ heroLogoOffsetX: 0, heroLogoOffsetY: 0 });
                        }
                      }}
                      className="text-amber-400 hover:underline text-[10px] ml-1"
                    >
                      (0,0)
                    </button>
                  )}
                </div>
              )}

              {/* Corner Resize Handle (Admin Only) */}
              {isAdmin && (
                <div
                  data-resize="true"
                  onMouseDown={handleMouseDownResizeLogo}
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 -right-2 w-6 h-6 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center justify-center cursor-se-resize shadow-xl z-30"
                  title="Тяните для изменения размера PNG логотипа"
                >
                  <Maximize2 className="w-3.5 h-3.5 transform rotate-45" />
                </div>
              )}
            </div>
          </div>
          
          {/* Hero text container with configurable alignment & mouse drag position */}
          <div 
            onMouseDown={handleMouseDownText}
            className={`space-y-4 relative z-10 w-full transition-shadow ${
              isDraggingText ? 'cursor-grabbing select-none' : 'cursor-grab'
            } ${
              appearanceSettings?.heroTextAlignment === 'left' 
                ? 'text-left max-w-4xl mr-auto ml-0' 
                : appearanceSettings?.heroTextAlignment === 'right' 
                ? 'text-right max-w-4xl ml-auto mr-0' 
                : 'text-center max-w-4xl mx-auto'
            }`}
            style={{
              transform: `translate3d(${currentTextOffsetX}px, ${currentTextOffsetY}px, 0)`,
              transition: isDraggingText ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            {!appearanceSettings?.hideHeroBadge && (
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{appearanceSettings?.siteName || 'RIVAUTO GROUP'} • СОБСТВЕННЫЕ ТОРГОВЫЕ МАРКИ</span>
              </div>
            )}

            <h1 
              className="font-black text-white tracking-tight uppercase font-mono leading-tight whitespace-pre-line drop-shadow-md"
              style={{
                fontSize: appearanceSettings?.heroTitleFontSizePx ? `${appearanceSettings.heroTitleFontSizePx}px` : undefined,
              }}
            >
              {appearanceSettings?.heroHeadline ? (
                appearanceSettings.heroHeadline
              ) : (
                <>
                  Производственно-торговая холдинговая компания <br className="hidden sm:inline" />
                  <span className="text-emerald-400">RIVAUTO GROUP</span>
                </>
              )}
            </h1>

            {!appearanceSettings?.hideHeroSubheadline && (
              <p 
                className={`text-slate-200 max-w-2xl leading-relaxed drop-shadow-xs font-medium whitespace-pre-line ${
                  appearanceSettings?.heroTextAlignment === 'left' 
                    ? 'mr-auto ml-0' 
                    : appearanceSettings?.heroTextAlignment === 'right' 
                    ? 'ml-auto mr-0' 
                    : 'mx-auto'
                }`}
                style={{
                  fontSize: appearanceSettings?.heroSubtitleFontSizePx ? `${appearanceSettings.heroSubtitleFontSizePx}px` : undefined,
                }}
              >
                {appearanceSettings?.heroSubheadline || 'Официальный справочно-технический портал 4 собственных брендов автокомпонентов для дистрибьюторов, оптовых складов и СТО. Более 12 000 артикулов в едином каталоге.'}
              </p>
            )}
          </div>

          {/* Quick OEM Search Container with INDEPENDENT Drag position */}
          {!appearanceSettings?.hideHeroSearch && (
            <div 
              onMouseDown={handleMouseDownSearch}
              className={`max-w-2xl pt-4 relative z-10 w-full transition-shadow ${
                isDraggingSearch ? 'cursor-grabbing select-none' : 'cursor-grab'
              } ${
                appearanceSettings?.heroTextAlignment === 'left' 
                  ? 'mr-auto ml-0' 
                  : appearanceSettings?.heroTextAlignment === 'right' 
                  ? 'ml-auto mr-0' 
                  : 'mx-auto'
              }`}
              style={{
                transform: `translate3d(${currentSearchOffsetX}px, ${currentSearchOffsetY}px, 0)`,
                transition: isDraggingSearch ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <form onSubmit={handleHeroSearch}>
                <div className="relative flex items-center bg-white border-2 border-gray-300 focus-within:border-red-600 rounded-2xl p-1.5 transition shadow-xl">
                  <Search className="w-5 h-5 text-black ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickSearchInput}
                    onChange={(e) => setQuickSearchInput(e.target.value)}
                    placeholder="Поиск по OEM номеру (напр: 13267630, 7701478031), артикулу или авто..."
                    className="w-full bg-transparent text-black placeholder-gray-500 px-3 py-2 text-xs sm:text-sm focus:outline-none font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-1.5 transition flex-shrink-0 shadow-md"
                  >
                    <span>НАЙТИ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

            {/* Holding Stats */}
            {!appearanceSettings?.hideHeroStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/80 text-left font-mono text-xs">
                <div className="bg-slate-800/70 border border-slate-700 p-3 rounded-xl">
                  <div className="text-emerald-400 text-lg font-black">4 БРЕНДА</div>
                  <div className="text-[11px] text-slate-400">Dextra, Kaido, Katsumoto, Luxor</div>
                </div>
                <div className="bg-slate-800/70 border border-slate-700 p-3 rounded-xl">
                  <div className="text-amber-400 text-lg font-black">12 400+</div>
                  <div className="text-[11px] text-slate-400">SKU на складах СНГ</div>
                </div>
                <div className="bg-slate-800/70 border border-slate-700 p-3 rounded-xl">
                  <div className="text-rose-400 text-lg font-black">100% QC</div>
                  <div className="text-[11px] text-slate-400">Контроль геометрических допусков</div>
                </div>
                <div className="bg-slate-800/70 border border-slate-700 p-3 rounded-xl">
                  <div className="text-sky-400 text-lg font-black">ISO/TS 16949</div>
                  <div className="text-[11px] text-slate-400">Стандарты автопрома</div>
                </div>
              </div>
            )}
        </section>
      ) : activeBrand ? (() => {
        const bId = activeBrand.id as 'kaido' | 'katsumoto' | 'luxor' | 'dextra';

        const activeBrandBgUrl = 
          (appearanceSettings?.[`${bId}HeroBanner` as keyof SiteAppearanceSettings] as string) ||
          (appearanceSettings?.[`${bId}BgImage` as keyof SiteAppearanceSettings] as string) || '';

        const activeBrandLogoUrl =
          (appearanceSettings?.[`${bId}BannerLogoUrl` as keyof SiteAppearanceSettings] as string) ||
          (appearanceSettings?.[`${bId}LogoUrl` as keyof SiteAppearanceSettings] as string) ||
          activeBrand.logoUrl || '';

        const titleFontSize = (appearanceSettings?.[`${bId}BannerTitleFontSize` as keyof SiteAppearanceSettings] as number) ?? appearanceSettings?.bannerTitleFontSize ?? 44;
        const descFontSize = (appearanceSettings?.[`${bId}BannerDescFontSize` as keyof SiteAppearanceSettings] as number) ?? appearanceSettings?.bannerDescFontSize ?? 16;
        const overlayOpacity = (appearanceSettings?.[`${bId}BannerOverlayOpacity` as keyof SiteAppearanceSettings] as number) ?? appearanceSettings?.bannerOverlayOpacity ?? 65;
        const textAlign = (appearanceSettings?.[`${bId}BannerTextAlign` as keyof SiteAppearanceSettings] as 'left' | 'center' | 'right') ?? appearanceSettings?.bannerTextAlign ?? 'left';
        const paddingY = (appearanceSettings?.[`${bId}BannerPaddingY` as keyof SiteAppearanceSettings] as number) ?? appearanceSettings?.bannerPaddingY ?? 48;
        const logoHeight = (appearanceSettings?.[`${bId}BannerLogoHeight` as keyof SiteAppearanceSettings] as number) ?? appearanceSettings?.bannerLogoHeight ?? 60;
        const hideTitle = (appearanceSettings?.[`${bId}HideBannerTitle` as keyof SiteAppearanceSettings] as boolean) ?? appearanceSettings?.hideBannerTitle ?? false;
        const textColor = (appearanceSettings?.[`${bId}TextColor` as keyof SiteAppearanceSettings] as string) || '#ffffff';

        const handleUpdateLogoForBrand = (logoDataUrl: string) => {
          if (!onUpdateAppearanceSettings) return;
          const bannerPropName = `${bId}BannerLogoUrl` as keyof SiteAppearanceSettings;
          const legacyPropName = `${bId}LogoUrl` as keyof SiteAppearanceSettings;
          onUpdateAppearanceSettings({ 
            [bannerPropName]: logoDataUrl,
            [legacyPropName]: logoDataUrl 
          });
        };

        const updateBrandSetting = (key: string, value: any) => {
          if (!onUpdateAppearanceSettings) return;
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          const fullPropName = `${bId}${capitalizedKey}` as keyof SiteAppearanceSettings;
          onUpdateAppearanceSettings({ [fullPropName]: value });
        };

        return (
          /* DEDICATED BRAND HERO BANNER */
          <section 
            style={{
              paddingTop: `${paddingY}px`,
              paddingBottom: `${paddingY}px`,
            }}
            className={`border-2 rounded-3xl px-6 sm:px-10 lg:px-12 shadow-lg relative overflow-hidden transition-all duration-300 ${
            activeBrandBgUrl 
              ? 'bg-slate-950 border-slate-700 text-white'
              : activeBrand.id === 'dextra' ? 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-amber-400' :
                activeBrand.id === 'kaido' ? 'bg-gradient-to-br from-[#FFF5F5] via-[#FFE4E6] to-[#FECDD3] border-rose-400' :
                activeBrand.id === 'katsumoto' ? 'bg-gradient-to-br from-[#FAFAFA] via-[#F4F4F5] to-[#E4E4E7] border-red-500' :
                'bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] border-sky-400'
          }`}>
            {activeBrandBgUrl && (
              <div className="absolute inset-0 z-0">
                <img
                  src={activeBrandBgUrl}
                  alt={`${activeBrand.name} Banner Background`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div 
                  className="absolute inset-0 bg-slate-950 pointer-events-none transition-opacity duration-200" 
                  style={{ opacity: overlayOpacity / 100 }}
                />
              </div>
            )}



            {/* Top Navigation Bar & Action Buttons */}
            <div className="max-w-4xl mx-auto mb-4 relative z-20 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => onSelectBrand('all')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 border border-gray-300 font-mono text-xs font-bold transition shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Все марки RIVAUTO GROUP</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-md font-mono text-xs font-bold uppercase ${activeBrand.badgeBg}`}>
                  {activeBrand.badgeText}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => onOpenManageBrands && onOpenManageBrands()}
                    className="bg-slate-900 text-white hover:bg-black border border-white/20 px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-1 shadow-md"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Текст бренда</span>
                  </button>
                )}
              </div>
            </div>

            {/* BRAND LOGO FRAME (INDEPENDENT DRAG) */}
            <div 
              onMouseDown={handleMouseDownLogo}
              className={`max-w-4xl mx-auto relative z-10 flex mb-4 h-[60px] items-center ${
                textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'
              } ${isDraggingLogo ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
              style={{
                transform: `translate3d(${currentLogoOffsetX}px, ${currentLogoOffsetY}px, 0)`,
                transition: isDraggingLogo ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <div className={`relative group transition-all rounded-2xl p-2 h-[60px] flex items-center ${
                isAdmin ? 'border-2 border-dashed border-amber-400/80 bg-slate-900/40 hover:bg-slate-900/60' : ''
              }`}>
                {activeBrandLogoUrl ? (
                  <div className="relative inline-flex items-center justify-center h-[60px]">
                    <img
                      src={activeBrandLogoUrl}
                      alt={`${activeBrand.name} Logo`}
                      style={{ height: `${logoHeight}px` }}
                      className="w-auto max-w-none object-contain transition-all duration-150 filter drop-shadow-md"
                    />
                    {isAdmin && (
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-amber-400 shadow-md z-30">
                        <label className="cursor-pointer text-amber-400 hover:text-amber-300 p-1" title="Заменить логотип">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  const dataUrl = evt.target?.result as string;
                                  if (dataUrl) handleUpdateLogoForBrand(dataUrl);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleUpdateLogoForBrand('')}
                          className="text-rose-400 hover:text-rose-300 p-1"
                          title="Удалить логотип"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : isAdmin ? (
                  <label className="cursor-pointer flex items-center space-x-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-900 text-amber-400 border border-amber-400/60 rounded-xl font-mono text-xs font-bold transition shadow-md">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>➕ Загрузить логотип {activeBrand.name} (PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const dataUrl = evt.target?.result as string;
                            if (dataUrl) handleUpdateLogoForBrand(dataUrl);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                ) : null}
              </div>
            </div>

            {/* BRAND TEXT BLOCK (TITLE & DESCRIPTION - INDEPENDENT DRAG) */}
            <div 
              onMouseDown={handleMouseDownText}
              className={`max-w-4xl mx-auto space-y-3 relative z-10 ${
                isAdmin ? (isDraggingText ? 'cursor-grabbing select-none' : 'cursor-grab') : ''
              }`}
              style={{
                transform: `translate3d(${currentTextOffsetX}px, ${currentTextOffsetY}px, 0)`,
                transition: isDraggingText ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                textAlign: textAlign,
              }}
            >
              {!hideTitle && (
                <h1 
                  style={{ 
                    fontSize: `${titleFontSize}px`, 
                    lineHeight: 1.1,
                    color: textColor,
                    textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.5)'
                  }}
                  className="font-black tracking-tighter uppercase font-mono transition-all duration-150"
                >
                  {activeBrand.name}{' '}
                  <span 
                    style={{ color: textColor }} 
                    className="text-xs font-bold font-sans tracking-normal opacity-90"
                  >
                    ({activeBrand.tagline})
                  </span>
                </h1>
              )}
              <p 
                style={{ 
                  fontSize: `${descFontSize}px`,
                  color: textColor,
                  textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.5)'
                }}
                className={`font-semibold leading-relaxed transition-all duration-150 whitespace-pre-line opacity-100 ${
                  textAlign === 'center' ? 'mx-auto max-w-2xl' : textAlign === 'right' ? 'ml-auto max-w-2xl' : 'max-w-2xl'
                }`}
              >
                {activeBrand.description}
              </p>
            </div>

            {/* Quick Search inside Brand with Independent Search Drag */}
            <div
              onMouseDown={handleMouseDownSearch}
              className={`max-w-2xl mx-auto pt-4 relative z-10 ${
                isAdmin ? (isDraggingSearch ? 'cursor-grabbing select-none' : 'cursor-grab') : ''
              }`}
              style={{
                transform: `translate3d(${currentSearchOffsetX}px, ${currentSearchOffsetY}px, 0)`,
                transition: isDraggingSearch ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <form onSubmit={handleHeroSearch}>
                <div className="relative flex items-center bg-white border-2 border-gray-300 focus-within:border-red-600 rounded-2xl p-1.5 transition shadow-sm">
                  <Search className="w-5 h-5 text-black ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickSearchInput}
                    onChange={(e) => setQuickSearchInput(e.target.value)}
                    placeholder={`Поиск деталей в бренде ${activeBrand.name} по артикулу или OEM...`}
                    className="w-full bg-transparent text-black placeholder-gray-500 px-3 py-2 text-xs sm:text-sm focus:outline-none font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-1.5 transition flex-shrink-0 shadow-xs"
                  >
                    <span>НАЙТИ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </section>
        );
      })() : null}

      {/* 2. BRAND SHOWCASE GRID (4 BRANDS PREVIEW IN ONE LINE) */}
      <section className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative">
        <BrandShowcaseGrid
          brands={brands}
          selectedBrandId={selectedBrandId}
          onSelectBrand={handleSelectBrandCard}
          cardHeight={appearanceSettings?.brandCardHeight}
          customHeightPx={appearanceSettings?.customBrandCardHeightPx}
          badgeText={appearanceSettings?.brandGridBadgeText}
          titleText={appearanceSettings?.brandGridTitleText}
          titleFont={appearanceSettings?.brandGridTitleFont}
          customFontFamily={appearanceSettings?.brandGridCustomFontFamily}
          isAdmin={isAdmin}
          onUpdateAppearanceSettings={onUpdateAppearanceSettings}
          onOpenManageBrands={onOpenManageBrands}
          onUpdateBrand={onUpdateBrand}
          customImages={{
            dextra: appearanceSettings?.dextraBgImage,
            kaido: appearanceSettings?.kaidoBgImage,
            katsumoto: appearanceSettings?.katsumotoBgImage,
            luxor: appearanceSettings?.luxorBgImage,
          }}
        />
      </section>

      {/* 3. CATALOG CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-2">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-extrabold text-[#1E4E8C] tracking-tight uppercase font-mono">
              КАТАЛОГ ГРУПП (ВЫБОР КАТЕГОРИИ)
            </h2>
            {isAdmin && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                Режим ред.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <>
                <button
                  onClick={() => onOpenManageBrands && onOpenManageBrands()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Управление 4 брендами</span>
                </button>
                <button
                  onClick={() => onOpenManageCategories && onOpenManageCategories()}
                  className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Управление категориями</span>
                </button>
              </>
            )}

            <button
              onClick={onGoToCatalog}
              className="text-xs font-bold text-[#1E4E8C] hover:text-[#153D7A] flex items-center space-x-1 group"
            >
              <span>Все позиции ({brandParts.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group cursor-pointer bg-white border border-gray-200 hover:border-[#1E4E8C] hover:shadow-md rounded-2xl p-3 flex flex-col justify-between transition relative overflow-hidden"
            >
              <div>
                {/* Category Image Thumbnail Container */}
                <div className={`w-full h-24 sm:h-28 bg-gray-50 border border-gray-100 group-hover:border-blue-100 rounded-xl mb-2.5 flex items-center justify-center overflow-hidden transition relative ${cat.imageUrl ? 'p-0' : 'p-1.5'}`}>
                  <PartImage type={cat.imageType || cat.name} imageUrl={cat.imageUrl} className={cat.imageUrl ? "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" : "max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"} />
                  {cat.imageUrl && (
                    <span className="absolute top-1 right-1 bg-emerald-600/90 text-white text-[8px] font-mono font-bold px-1 rounded z-10 shadow-xs">
                      Фото
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-gray-900 group-hover:text-[#1E4E8C] transition line-clamp-2">
                  {cat.name}
                </div>
                <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                  {cat.count} артикулов
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenManageCategories) onOpenManageCategories(cat);
                  }}
                  className="mt-2 text-[10px] text-amber-700 hover:text-amber-900 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 font-mono font-bold w-fit"
                >
                  Редактировать
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          {isEditingPopularTitle && isAdmin && selectedBrandId === 'all' ? (
            <div className="flex items-center space-x-2 flex-1 max-w-xl">
              <input
                type="text"
                value={tempPopularTitle}
                onChange={(e) => setTempPopularTitle(e.target.value)}
                className="w-full px-3 py-1.5 border-2 border-amber-500 rounded-xl text-sm font-extrabold text-[#1E4E8C] font-mono focus:outline-none bg-amber-50/50"
                autoFocus
              />
              <button
                onClick={() => {
                  if (onUpdateAppearanceSettings && tempPopularTitle.trim()) {
                    onUpdateAppearanceSettings({ popularBlockTitle: tempPopularTitle.trim() });
                  }
                  setIsEditingPopularTitle(false);
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-mono text-xs font-bold hover:bg-emerald-700 transition"
              >
                Сохранить
              </button>
              <button
                onClick={() => setIsEditingPopularTitle(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-xl font-mono text-xs font-bold hover:bg-gray-300 transition"
              >
                Отмена
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-[#1E4E8C] uppercase font-mono tracking-tight">
                {selectedBrandId === 'all'
                  ? (appearanceSettings?.popularBlockTitle || 'ПОПУЛЯРНЫЕ ПОЗИЦИИ ВСЕХ БРЕНДОВ')
                  : `КАТАЛОГ ДЕТАЛЕЙ ${activeBrand?.name}`}
              </h2>
              {isAdmin && selectedBrandId === 'all' && (
                <button
                  onClick={() => {
                    setTempPopularTitle(appearanceSettings?.popularBlockTitle || 'ПОПУЛЯРНЫЕ ПОЗИЦИИ ВСЕХ БРЕНДОВ');
                    setIsEditingPopularTitle(true);
                  }}
                  className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition border border-amber-200 bg-white"
                  title="Изменить название этого блока"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isAdmin && (
            <button
              onClick={() => onOpenAddProduct && onOpenAddProduct()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-2xs ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить деталь</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {brandParts.map((part, index) => (
            <div
              key={part.id}
              onClick={() => onOpenDetail(part)}
              className="group cursor-pointer relative aspect-[3/4] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/80 hover:border-[#1E4E8C] transition-all transform hover:-translate-y-1"
            >
              {/* Poster Image filling 3:4 aspect ratio */}
              <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden p-0.5">
                <PartImage 
                  type={part.category + ' ' + part.title}
                  imageUrl={part.imageUrl}
                  part={part} 
                  className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300" 
                />
              </div>

              {/* Hover overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-30 group-hover:opacity-70 transition-opacity pointer-events-none" />

              {/* Transition Arrow Button (bottom-left) */}
              <div className="absolute bottom-3 left-3 z-10">
                <div className="p-3 bg-white/90 group-hover:bg-[#1E4E8C] text-gray-900 group-hover:text-white rounded-full shadow-lg transition-all transform group-hover:scale-110 flex items-center justify-center backdrop-blur-xs">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Admin Actions Overlay (top-right) */}
              {isAdmin && (
                <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 z-20 bg-slate-900/80 p-1 rounded-xl backdrop-blur-xs border border-white/20 shadow-lg">
                  {onMovePart && (
                    <>
                      <button
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovePart(part.id, 'left');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-25 disabled:hover:bg-slate-800 transition shadow-xs"
                        title="Переместить влево (назад)"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={index === brandParts.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovePart(part.id, 'right');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-25 disabled:hover:bg-slate-800 transition shadow-xs"
                        title="Переместить вправо (вперед)"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {onEditPart && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPart(part);
                      }}
                      className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition shadow-xs"
                      title="Редактировать позицию"
                    >
                      <Edit className="w-4 h-4" />
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
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition shadow-xs"
                      title="Удалить позицию"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. B2B PARTNERSHIP FORM */}
      {!appearanceSettings?.wholesaleHideBlock && (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-xl space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase font-mono tracking-tight text-amber-400">
                {appearanceSettings?.wholesaleTitle || 'Оптовое сотрудничество с RIVAUTO GROUP'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {appearanceSettings?.wholesaleSubtitle || 'Получите прямой прайс-лист для дистрибьюторов на 4 бренда: DEXTRA, KAIDO, KATSUMOTO, LUXOR.'}
              </p>
            </div>

            {contactSubmitted ? (
              <div className="bg-emerald-900/50 border border-emerald-500 rounded-2xl p-6 text-center space-y-2 font-mono">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-emerald-300">
                  {appearanceSettings?.wholesaleSuccessText || 'Заявка успешно отправлена! Наш отдел оптовых продаж свяжется с вами в течение 15 минут.'}
                </h3>
                <p className="text-xs text-slate-300">
                  Мы получили ваши контакты и уже формируем оптовое коммерческое предложение.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSubmitted(false)}
                  className="mt-2 text-xs font-mono text-amber-400 hover:text-amber-300 underline font-bold"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Название компании / ИП"
                    value={contactForm.companyName}
                    onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })}
                    className="bg-slate-800 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Рабочий Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="bg-slate-800 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Телефон (8 701 082 9502...)"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="bg-slate-800 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium font-mono"
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg cursor-pointer"
                  >
                    <SendIcon className="w-4 h-4" />
                    <span>{appearanceSettings?.wholesaleButtonText || 'Запросить коммерческое предложение'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ADMIN VIEW: Submitted B2B Inquiries */}
          {isAdmin && wholesaleLeads && wholesaleLeads.length > 0 && (
            <div className="pt-6 border-t border-slate-700/80 max-w-4xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-mono font-bold">
                    🛡️ Журнал заявок администратора
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Всего заявок: {wholesaleLeads.length}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-2xl border border-slate-700 divide-y divide-slate-800 overflow-hidden text-xs font-mono">
                {wholesaleLeads.map((lead) => (
                  <div key={lead.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <strong className="text-amber-300 font-bold text-sm">{lead.companyName}</strong>
                        {lead.brand && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                            {lead.brand}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs">
                        <span>📧 {lead.email}</span>
                        <span>📞 {lead.phone}</span>
                        <span className="text-slate-500">{new Date(lead.createdAt).toLocaleString('ru-RU')}</span>
                      </div>
                    </div>

                    {onDeleteWholesaleLead && (
                      <button
                        type="button"
                        onClick={() => onDeleteWholesaleLead(lead.id)}
                        className="self-end sm:self-center p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 rounded-lg transition"
                        title="Удалить заявку"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* PNG LOGO URL SELECTION MODAL */}
      {showLogoUrlModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowLogoUrlModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-amber-400 font-mono uppercase flex items-center space-x-2">
                <Image className="w-5 h-5 text-amber-400" />
                <span>Прозрачный PNG логотип на баннере</span>
              </h3>
              <p className="text-xs text-slate-300">
                Загрузите PNG файл (без фона) прямо с вашего компьютера или укажите ссылку на изображение.
              </p>
            </div>

            {/* Local File Upload Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageFileSelected(file);
              }}
              className="p-5 border-2 border-dashed border-amber-500/50 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 rounded-2xl text-center space-y-2 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-amber-300">
                  📁 Выбрать PNG файл на компьютере
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  или перетащите файл мышью сюда (PNG, SVG, WEBP)
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateAppearanceSettings) {
                  onUpdateAppearanceSettings({ heroLogoUrl: logoUrlInput.trim() });
                }
                setShowLogoUrlModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
                  Или укажите URL интернет-ссылку:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    placeholder="https://domain.com/transparent-logo.png"
                    className="w-full bg-slate-800 border border-slate-600 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
                  />
                  {logoUrlInput && (
                    <button
                      type="button"
                      onClick={() => setLogoUrlInput('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      Очистить
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Preset PNG Logos */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                  Или выберите пример прозрачного логотипа:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleUrl = 'https://api.iconify.design/game-icons:car-key.svg?color=%23f59e0b';
                      setLogoUrlInput(sampleUrl);
                      if (onUpdateAppearanceSettings) {
                        onUpdateAppearanceSettings({ heroLogoUrl: sampleUrl });
                      }
                      setShowLogoUrlModal(false);
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left flex items-center space-x-2 transition"
                  >
                    <span className="text-xl">🏎️</span>
                    <div>
                      <div className="text-xs font-bold text-amber-300">Золотой герб RIVAUTO</div>
                      <div className="text-[10px] text-slate-400">Прозрачная эмблема</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sampleUrl = 'https://api.iconify.design/game-icons:auto-repair.svg?color=%2310b981';
                      setLogoUrlInput(sampleUrl);
                      if (onUpdateAppearanceSettings) {
                        onUpdateAppearanceSettings({ heroLogoUrl: sampleUrl });
                      }
                      setShowLogoUrlModal(false);
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left flex items-center space-x-2 transition"
                  >
                    <span className="text-xl">⚙️</span>
                    <div>
                      <div className="text-xs font-bold text-emerald-300">OEM Знака Качества</div>
                      <div className="text-[10px] text-slate-400">Изумрудный знак</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                {appearanceSettings?.heroLogoUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrlInput('');
                      if (onUpdateAppearanceSettings) {
                        onUpdateAppearanceSettings({ heroLogoUrl: '' });
                      }
                      setShowLogoUrlModal(false);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-mono font-bold underline"
                  >
                    Удалить логотип с баннера
                  </button>
                ) : <div />}

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoUrlModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl transition"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-black rounded-xl uppercase tracking-wider transition shadow-lg"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function SendIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

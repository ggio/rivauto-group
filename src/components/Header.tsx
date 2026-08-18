import React, { useState } from 'react';
import { 
  ShieldCheck, Database, Upload, Cpu, Wrench, Menu, X, Home, Search, Phone, 
  ShoppingCart, Zap, UserCheck, ShieldAlert, Plus, FolderPlus, Lock, KeyRound, Trash2, RefreshCw,
  Building2, Users, FileText, Palette, Layers, Image as ImageIcon, Camera, Download
} from 'lucide-react';
import { SiteAppearanceSettings } from '../types/theme';
import { BrandItem } from '../types/catalog';
import { RivautoLogo } from './RivautoLogo';
import { BrandLogoBadge } from './BrandLogoBadge';

interface HeaderProps {
  activeNav: 'landing' | 'catalog' | 'admin' | 'architecture' | 'quality' | 'ai' | 'about' | 'custom_page';
  setActiveNav: (nav: 'landing' | 'catalog' | 'admin' | 'architecture' | 'quality' | 'ai' | 'about' | 'custom_page') => void;
  partsCount: number;
  isAdmin: boolean;
  selectedBrandId?: string;
  aboutNavTitle?: string;
  customNavTitle?: string;
  appearanceSettings?: SiteAppearanceSettings;
  brands?: BrandItem[];
  onSelectBrand?: (brandId: string) => void;
  onOpenManageBrands?: () => void;
  onOpenThemeEditor?: () => void;
  onOpenScreenshots?: () => void;
  onToggleAdminRole: () => void;
  onOpenCreateProduct: () => void;
  onOpenManageCategories: () => void;
  onClearAllProducts: () => void;
  onRestoreDemoProducts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  partsCount,
  isAdmin,
  selectedBrandId = 'all',
  aboutNavTitle = 'О компании',
  customNavTitle = 'Партнерам',
  appearanceSettings,
  brands = [],
  onSelectBrand = (_b?: string) => {},
  onOpenManageBrands,
  onOpenThemeEditor,
  onOpenScreenshots,
  onToggleAdminRole,
  onOpenCreateProduct,
  onOpenManageCategories,
  onClearAllProducts,
  onRestoreDemoProducts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Helper to resolve brand logo (from Theme Settings or Brands Manager)
  const getBrandLogo = (brandId: string) => {
    if (brandId === 'dextra' && appearanceSettings?.dextraLogoUrl) return appearanceSettings.dextraLogoUrl;
    if (brandId === 'kaido' && appearanceSettings?.kaidoLogoUrl) return appearanceSettings.kaidoLogoUrl;
    if (brandId === 'katsumoto' && appearanceSettings?.katsumotoLogoUrl) return appearanceSettings.katsumotoLogoUrl;
    if (brandId === 'luxor' && appearanceSettings?.luxorLogoUrl) return appearanceSettings.luxorLogoUrl;
    
    const found = brands?.find((b) => b.id.toLowerCase() === brandId.toLowerCase());
    if (found?.logoUrl) return found.logoUrl;
    return undefined;
  };

  const dextraLogo = getBrandLogo('dextra');
  const kaidoLogo = getBrandLogo('kaido');
  const katsumotoLogo = getBrandLogo('katsumoto');
  const luxorLogo = getBrandLogo('luxor');

  // Dynamic button sizing & radius from Theme Appearance Settings
  const buttonSize = appearanceSettings?.buttonSize || 'standard';
  const btnRadiusClass = appearanceSettings?.buttonRadius || 'rounded-xl';

  let navBtnPadClass = 'px-1.5 py-1.5 text-sm font-bold';
  let logoImgHeightClass = 'h-5 max-w-[95px]';

  if (buttonSize === 'compact') {
    navBtnPadClass = 'px-1 py-1 text-xs font-bold';
    logoImgHeightClass = 'h-4 max-w-[80px]';
  } else if (buttonSize === 'large') {
    navBtnPadClass = 'px-2 py-2 text-base font-black';
    logoImgHeightClass = 'h-7 max-w-[110px]';
  }

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '!@Nbnfybev26!@') {
      onToggleAdminRole();
      setLoginModalOpen(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleBrandClick = (brandId: string) => {
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
    setActiveNav('landing');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs font-sans">
      {/* Top B2B Bar & Role Bar */}
      <div className={`${isAdmin ? 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-b border-amber-500/30' : 'bg-[#1E293B]'} text-gray-300 text-xs py-1.5 px-4 font-mono transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <strong className="text-white">
                {isAdmin ? 'РЕЖИМ АДМИНИСТРАТОРА (Полный доступ)' : 'Оптовый B2B портал LUXOR'}
              </strong>
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline text-gray-400">TecDoc Standard • ECE R90</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            {/* Screenshots Gallery & Downloader Button (Admin Only) */}
            {isAdmin && onOpenScreenshots && (
              <button
                onClick={onOpenScreenshots}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-2.5 py-0.5 rounded-lg border border-indigo-500 transition flex items-center space-x-1 shadow-xs"
                title="Смотреть и скачать все скриншоты страниц сайта"
              >
                <Camera className="w-3 h-3 text-amber-300" />
                <span>📸 Скриншоты страниц (9)</span>
              </button>
            )}

            {/* Quick Theme Editor & Brands Button (Admin Only) */}
            {isAdmin && onOpenThemeEditor && (
              <button
                onClick={onOpenThemeEditor}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-lg border border-emerald-500 transition flex items-center space-x-1 shadow-2xs"
                title="Редактор оформления, текстов и дизайна сайта"
              >
                <Palette className="w-3 h-3 text-emerald-200" />
                <span>Оформление</span>
              </button>
            )}

            {isAdmin && onOpenManageBrands && (
              <button
                onClick={onOpenManageBrands}
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-2.5 py-0.5 rounded-lg border border-sky-600 transition flex items-center space-x-1 shadow-2xs"
                title="Управление карточками брендов и баннерами"
              >
                <Layers className="w-3 h-3 text-sky-200" />
                <span>Баннер и Бренды</span>
              </button>
            )}

            {/* Quick Admin Role Toggle Button */}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold text-[10px]">
                  Администратор
                </span>
                <button
                  onClick={onToggleAdminRole}
                  className="bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700/60 px-2.5 py-0.5 rounded font-bold transition flex items-center space-x-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="text-gray-400 hover:text-emerald-400 transition px-1.5 py-0.5 font-bold cursor-pointer opacity-60 hover:opacity-100 text-xs"
                title="Авторизация"
              >
                ✓
              </button>
            )}

            <span className="text-gray-500">|</span>
            <a href="tel:+78005553920" className="hidden sm:flex items-center space-x-1 hover:text-white transition">
              <Phone className="w-3 h-3 text-[#1B4E9B]" />
              <span className="font-bold text-white">+7 (800) 555-39-20</span>
            </a>
          </div>
        </div>
      </div>

      {/* Admin Action Bar (Only Visible for Administrator) */}
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Панель управления товарами Администратора:</span>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-2 font-medium">
              {onOpenScreenshots && (
                <button
                  onClick={onOpenScreenshots}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span>📸 Скриншоты всех страниц (9)</span>
                </button>
              )}

              {onOpenThemeEditor && (
                <button
                  onClick={onOpenThemeEditor}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-950" />
                  <span>Оформление (Редактор темы)</span>
                </button>
              )}

              {onOpenManageBrands && (
                <button
                  onClick={onOpenManageBrands}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Баннер и Бренды</span>
                </button>
              )}

              <button
                onClick={onOpenCreateProduct}
                className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-3 py-1 rounded-lg flex items-center space-x-1 shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Создать товар вручную</span>
              </button>

              <button
                onClick={onOpenManageCategories}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1 rounded-lg flex items-center space-x-1 shadow-2xs transition"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Группы / Категории</span>
              </button>

              <button
                onClick={() => setActiveNav('admin')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Импорт CSV</span>
              </button>

              <button
                onClick={onClearAllProducts}
                className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition"
                title="Полностью очистить каталог от всех товаров"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Очистить весь каталог ({partsCount})</span>
              </button>

              <button
                onClick={onRestoreDemoProducts}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition"
                title="Восстановить исходные демо-товары"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Демо-база</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] py-2 gap-2 sm:gap-4">
          {/* Brand Logo & Title (Protected with flex-shrink-0 & right margin) */}
          <div className="flex items-center space-x-3 cursor-pointer group flex-shrink-0 mr-2 sm:mr-4" onClick={() => { onSelectBrand('all'); setActiveNav('landing'); }}>
            {appearanceSettings?.siteLogoUrl ? (
              <img 
                src={appearanceSettings.siteLogoUrl} 
                alt="Logo" 
                className="h-10 w-auto max-w-[120px] object-contain flex-shrink-0" 
              />
            ) : (
              <RivautoLogo variant="icon" className="w-10 h-10 flex-shrink-0 drop-shadow-xs" />
            )}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-[#0F172A] tracking-wider uppercase font-mono group-hover:text-emerald-600 transition whitespace-nowrap">
                  {appearanceSettings?.siteName || 'RIVAUTO GROUP'}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans leading-none truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                {appearanceSettings?.siteTagline || (isAdmin ? 'Администрирование холдинга и 4 марок' : 'Собственные торговые марки автокомпонентов')}
              </p>
            </div>
          </div>

          {/* Desktop Brand Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-1.5 font-sans text-xs font-semibold whitespace-nowrap overflow-x-auto no-scrollbar py-1">
            {/* All Holding Portal */}
            {(() => {
              const isActive = selectedBrandId === 'all' && activeNav === 'landing';
              const shapeClass = appearanceSettings?.allGroupBtnShape || 'rounded-xl';
              const theme = appearanceSettings?.allGroupBtnTheme || 'dark-emerald';
              const logoUrl = appearanceSettings?.allGroupLogoUrl;
              const navTitle = appearanceSettings?.allGroupNavTitle || 'Вся Группа';

              let themeClass = 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-amber-400/80 hover:text-white';
              let customStyle: React.CSSProperties = {};

              if (isActive) {
                themeClass = 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black border-amber-300 shadow-md shadow-amber-500/20 scale-[1.02]';
              } else {
                if (theme === 'emerald') {
                  themeClass = 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500';
                } else if (theme === 'blue-navy') {
                  themeClass = 'bg-blue-900 text-sky-200 border-blue-800 hover:bg-blue-800';
                } else if (theme === 'gradient') {
                  themeClass = 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white border-teal-500 hover:opacity-95';
                } else if (theme === 'amber-gold') {
                  themeClass = 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400 font-bold';
                } else if (theme === 'rose-red') {
                  themeClass = 'bg-rose-700 text-white border-rose-600 hover:bg-rose-600';
                } else if (theme === 'outline') {
                  themeClass = 'border-2 border-slate-300 text-slate-200 bg-transparent hover:border-white hover:text-white';
                } else if (theme === 'custom') {
                  themeClass = 'border-slate-700 hover:opacity-90';
                  customStyle = {
                    backgroundColor: appearanceSettings?.allGroupBtnCustomBg || '#0f172a',
                    color: appearanceSettings?.allGroupBtnCustomText || '#34d399',
                  };
                }
              }

              return (
                <button
                  onClick={() => {
                    onSelectBrand('all');
                    setActiveNav('landing');
                  }}
                  style={customStyle}
                  className={`h-9 px-3.5 ${shapeClass} transition-all duration-200 font-mono whitespace-nowrap flex-shrink-0 flex items-center space-x-2 border text-xs ${themeClass}`}
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt={navTitle} className="h-5 w-auto object-contain flex-shrink-0 filter brightness-110" />
                  ) : (
                    <Home className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  )}
                  <span className="whitespace-nowrap uppercase font-bold">{navTitle}</span>
                </button>
              );
            })()}

            {/* DEXTRA Tab */}
            <button
              onClick={() => handleBrandClick('dextra')}
              className={`h-9 px-0.5 rounded-xl transition-all duration-200 flex-shrink-0 flex items-center justify-center border overflow-hidden ${
                selectedBrandId === 'dextra'
                  ? 'border-2 border-amber-400 bg-black shadow-md shadow-amber-400/20 ring-1 ring-amber-400/30 scale-[1.03]'
                  : 'border border-slate-800 bg-black hover:border-amber-500/80 hover:scale-[1.02]'
              }`}
              title="DEXTRA"
            >
              <BrandLogoBadge 
                brandId="dextra" 
                customLogoUrl={appearanceSettings?.dextraHeaderLogoUrl || appearanceSettings?.dextraLogoUrl} 
                forceCustom={!!(appearanceSettings?.dextraHeaderLogoUrl || appearanceSettings?.dextraLogoUrl)} 
                className="h-8 w-auto" 
              />
            </button>

            {/* KAIDO Tab */}
            <button
              onClick={() => handleBrandClick('kaido')}
              className={`h-9 px-0.5 rounded-xl transition-all duration-200 flex-shrink-0 flex items-center justify-center border overflow-hidden ${
                selectedBrandId === 'kaido'
                  ? 'border-2 border-rose-500 bg-black shadow-md shadow-rose-500/20 ring-1 ring-rose-500/30 scale-[1.03]'
                  : 'border border-slate-800 bg-black hover:border-rose-500/80 hover:scale-[1.02]'
              }`}
              title="KAIDO"
            >
              <BrandLogoBadge 
                brandId="kaido" 
                customLogoUrl={appearanceSettings?.kaidoHeaderLogoUrl || appearanceSettings?.kaidoLogoUrl} 
                forceCustom={!!(appearanceSettings?.kaidoHeaderLogoUrl || appearanceSettings?.kaidoLogoUrl)} 
                className="h-8 w-auto" 
              />
            </button>

            {/* KATSUMOTO Tab */}
            <button
              onClick={() => handleBrandClick('katsumoto')}
              className={`h-9 px-0.5 rounded-xl transition-all duration-200 flex-shrink-0 flex items-center justify-center border overflow-hidden ${
                selectedBrandId === 'katsumoto'
                  ? 'border-2 border-red-500 bg-black shadow-md shadow-red-500/20 ring-1 ring-red-500/30 scale-[1.03]'
                  : 'border border-slate-800 bg-black hover:border-red-500/80 hover:scale-[1.02]'
              }`}
              title="KATSUMOTO"
            >
              <BrandLogoBadge 
                brandId="katsumoto" 
                customLogoUrl={appearanceSettings?.katsumotoHeaderLogoUrl || appearanceSettings?.katsumotoLogoUrl} 
                forceCustom={!!(appearanceSettings?.katsumotoHeaderLogoUrl || appearanceSettings?.katsumotoLogoUrl)} 
                className="h-8 w-auto" 
              />
            </button>

            {/* LUXOR Tab */}
            <button
              onClick={() => handleBrandClick('luxor')}
              className={`h-9 px-0.5 rounded-xl transition-all duration-200 flex-shrink-0 flex items-center justify-center border overflow-hidden ${
                selectedBrandId === 'luxor'
                  ? 'border-2 border-sky-400 bg-black shadow-md shadow-sky-400/20 ring-1 ring-sky-400/30 scale-[1.03]'
                  : 'border border-slate-800 bg-black hover:border-sky-400/80 hover:scale-[1.02]'
              }`}
              title="LUXOR"
            >
              <BrandLogoBadge 
                brandId="luxor" 
                customLogoUrl={appearanceSettings?.luxorHeaderLogoUrl || appearanceSettings?.luxorLogoUrl} 
                forceCustom={!!(appearanceSettings?.luxorHeaderLogoUrl || appearanceSettings?.luxorLogoUrl)} 
                className="h-8 w-auto" 
              />
            </button>

            <span className="text-slate-300 px-1 flex-shrink-0 opacity-40">|</span>

            {/* Catalog Button */}
            <button
              onClick={() => setActiveNav('catalog')}
              className={`h-9 px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center space-x-1.5 border text-xs font-sans ${
                activeNav === 'catalog'
                  ? 'bg-slate-900 text-amber-300 border-2 border-amber-400 font-black shadow-md shadow-amber-400/15 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:border-amber-400/80 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span className="whitespace-nowrap font-bold">Каталог ({partsCount})</span>
            </button>

            {/* Page 1: О компании */}
            <button
              onClick={() => setActiveNav('about')}
              className={`h-9 px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center space-x-1.5 border text-xs font-sans ${
                activeNav === 'about'
                  ? 'bg-slate-900 text-emerald-300 border-2 border-emerald-400 font-black shadow-md shadow-emerald-400/15 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:border-emerald-400/80 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
              <span className="whitespace-nowrap font-bold">{aboutNavTitle}</span>
            </button>

            {/* Page 2: Custom / Партнерам */}
            <button
              onClick={() => setActiveNav('custom_page')}
              className={`h-9 px-3.5 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center space-x-1.5 border text-xs font-sans ${
                activeNav === 'custom_page'
                  ? 'bg-slate-900 text-sky-300 border-2 border-sky-400 font-black shadow-md shadow-sky-400/15 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:border-sky-400/80 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />
              <span className="whitespace-nowrap font-bold">{customNavTitle}</span>
            </button>

            {/* Admin-Only Navigation Links */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveNav('admin')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
                    activeNav === 'admin'
                      ? 'bg-[#1E4E8C] text-white shadow-xs font-bold'
                      : 'text-gray-700 hover:text-[#1E4E8C] hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Импорт CSV</span>
                </button>

                <button
                  onClick={() => setActiveNav('architecture')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
                    activeNav === 'architecture'
                      ? 'bg-[#1E4E8C] text-white shadow-xs font-bold'
                      : 'text-gray-700 hover:text-[#1E4E8C] hover:bg-gray-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Схема БД</span>
                </button>

                <button
                  onClick={() => setActiveNav('quality')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
                    activeNav === 'quality'
                      ? 'bg-[#1E4E8C] text-white shadow-xs font-bold'
                      : 'text-gray-700 hover:text-[#1E4E8C] hover:bg-gray-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Лаборатория ISO</span>
                </button>

                <button
                  onClick={() => setActiveNav('ai')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition ${
                    activeNav === 'ai'
                      ? 'bg-[#1E4E8C] text-white shadow-xs font-bold'
                      : 'text-gray-700 hover:text-[#1E4E8C] hover:bg-gray-100'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>AI Инженер</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAdmin ? (
              <button
                onClick={onOpenCreateProduct}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1.5 uppercase tracking-wider scale-[1.01] hover:scale-[1.03]"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Добавить деталь</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveNav('catalog')}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1.5 scale-[1.01] hover:scale-[1.03]"
              >
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                <span>Запрос цен B2B</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:text-black border border-gray-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-2 font-sans text-xs">
          <button
            onClick={() => { onSelectBrand('all'); setActiveNav('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 flex items-center space-x-2 font-semibold"
          >
            <Home className="w-4 h-4 text-[#1E4E8C]" />
            <span>{appearanceSettings?.allGroupNavTitle || 'Вся Группа'}</span>
          </button>

          <button
            onClick={() => { setActiveNav('about'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 flex items-center space-x-2 font-semibold"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>{aboutNavTitle}</span>
          </button>

          <button
            onClick={() => { setActiveNav('custom_page'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 flex items-center space-x-2 font-semibold"
          >
            <Users className="w-4 h-4 text-amber-600" />
            <span>{customNavTitle}</span>
          </button>

          <button
            onClick={() => { setActiveNav('catalog'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 flex items-center space-x-2 font-semibold"
          >
            <Wrench className="w-4 h-4 text-[#1E4E8C]" />
            <span>Каталог товаров ({partsCount})</span>
          </button>

          {onOpenScreenshots && (
            <button
              onClick={() => { onOpenScreenshots(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center space-x-2 font-bold"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>📸 Скриншоты всех страниц (9 шт)</span>
            </button>
          )}

          {onOpenThemeEditor && (
            <button
              onClick={() => { onOpenThemeEditor(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center space-x-2 font-bold"
            >
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>Оформление (Редактор темы)</span>
            </button>
          )}

          {isAdmin && (
            <>
              <div className="border-t border-gray-200 pt-2 text-amber-800 font-bold font-mono text-[11px]">
                АДМИН-ФУНКЦИИ:
              </div>
              <button
                onClick={() => { onOpenCreateProduct(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg bg-amber-50 text-amber-900 flex items-center space-x-2 font-bold"
              >
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Создать карточку товара</span>
              </button>
              <button
                onClick={() => { setActiveNav('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 flex items-center space-x-2 font-semibold"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Массовый импорт CSV</span>
              </button>
              <button
                onClick={() => { setActiveNav('architecture'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 flex items-center space-x-2 font-semibold"
              >
                <Database className="w-4 h-4 text-cyan-600" />
                <span>Схема БД & ERD</span>
              </button>
            </>
          )}

          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={() => {
                if (isAdmin) {
                  onToggleAdminRole();
                } else {
                  setLoginModalOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isAdmin ? 'Выйти из режима Администратора' : 'Войти как Администратор'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-2 text-amber-800 font-mono font-bold text-sm">
                <Lock className="w-5 h-5 text-amber-600" />
                <span>Вход для Администратора Luxor</span>
              </div>
              <button onClick={() => setLoginModalOpen(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600">
              Введите пароль администратора для управления каталогом, очистки и загрузки новых товаров.
            </p>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Пароль (по умолчанию нажмите Войти или введите "admin")</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Введите пароль..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-900 outline-none focus:border-[#1E4E8C] font-mono"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-rose-600 text-[11px] mt-1 font-bold">Неверный пароль. Доступ ограничен.</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-6 py-2 rounded-xl flex items-center space-x-1.5 shadow-2xs"
                >
                  <span>Войти в систему</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

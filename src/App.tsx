import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BrandLanding } from './components/BrandLanding';
import { SmartSearch } from './components/SmartSearch';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductEditorModal } from './components/ProductEditorModal';
import { CategoryManagerModal, CategoryItem } from './components/CategoryManagerModal';
import { AdminImport } from './components/AdminImport';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { QualityTestingLab } from './components/QualityTestingLab';
import { AiTechAssistant } from './components/AiTechAssistant';
import { BrandManagerModal } from './components/BrandManagerModal';
import { CmsPageView } from './components/CmsPageView';
import { ThemeEditorModal } from './components/ThemeEditorModal';
import { ScreenshotsGalleryModal } from './components/ScreenshotsGalleryModal';
import { MOCK_PARTS, LUXOR_CATEGORIES } from './data/mockParts';
import { INITIAL_BRANDS } from './data/mockBrands';
import { INITIAL_CMS_PAGES } from './data/mockCmsPages';
import { LuxorPart, VehicleSelection, BrandItem } from './types/catalog';
import { CmsPageData } from './types/cms';
import { SiteAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS, WholesaleLead } from './types/theme';
import { savePersistentData, syncLoadPersistentData, loadPersistentData, loadServerCatalog, saveServerCatalog } from './lib/persistentStorage';
import { INITIAL_FULL_BACKUP_DATA } from './data/initialData';
import { Wrench, ChevronRight, Plus, Trash2, RefreshCw, Upload, ShieldAlert, Sparkles, Building2, Users } from 'lucide-react';

const BACKUP_THEME = {
  ...DEFAULT_APPEARANCE_SETTINGS,
  ...((INITIAL_FULL_BACKUP_DATA.themeSettings || INITIAL_FULL_BACKUP_DATA.rivauto_theme_settings || {}) as SiteAppearanceSettings),
  kaidoBgImage: DEFAULT_APPEARANCE_SETTINGS.kaidoBgImage,
  katsumotoBgImage: DEFAULT_APPEARANCE_SETTINGS.katsumotoBgImage,
  luxorBgImage: DEFAULT_APPEARANCE_SETTINGS.luxorBgImage,
};
const BACKUP_PARTS = (INITIAL_FULL_BACKUP_DATA.luxor_parts_list && INITIAL_FULL_BACKUP_DATA.luxor_parts_list.length > 0 ? INITIAL_FULL_BACKUP_DATA.luxor_parts_list : MOCK_PARTS) as LuxorPart[];
const BACKUP_CATS = (INITIAL_FULL_BACKUP_DATA.luxor_categories && INITIAL_FULL_BACKUP_DATA.luxor_categories.length > 0 ? INITIAL_FULL_BACKUP_DATA.luxor_categories : LUXOR_CATEGORIES) as CategoryItem[];
const BACKUP_BRANDS = (INITIAL_FULL_BACKUP_DATA.rivauto_brands && INITIAL_FULL_BACKUP_DATA.rivauto_brands.length > 0 ? INITIAL_FULL_BACKUP_DATA.rivauto_brands : INITIAL_BRANDS) as BrandItem[];
const BACKUP_CMS = (INITIAL_FULL_BACKUP_DATA.rivauto_cms_pages && Object.keys(INITIAL_FULL_BACKUP_DATA.rivauto_cms_pages).length > 0 ? INITIAL_FULL_BACKUP_DATA.rivauto_cms_pages : INITIAL_CMS_PAGES) as Record<string, CmsPageData>;


export default function App() {
  const [activeNav, setActiveNav] = useState<'landing' | 'catalog' | 'admin' | 'architecture' | 'quality' | 'ai' | 'about' | 'custom_page'>(() => {
    return syncLoadPersistentData('rivauto_active_nav', 'landing');
  });

  // Appearance & Design Customization State
  const [appearanceSettings, setAppearanceSettings] = useState<SiteAppearanceSettings>(() => {
    const loaded = syncLoadPersistentData('rivauto_theme_settings', BACKUP_THEME);
    return { ...DEFAULT_APPEARANCE_SETTINGS, ...BACKUP_THEME, ...loaded };
  });
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  
  // Wholesale B2B Leads Persistence State
  const [wholesaleLeads, setWholesaleLeads] = useState<WholesaleLead[]>(() => {
    return syncLoadPersistentData('rivauto_wholesale_leads', []);
  });
  
  // CMS Pages State (Editable Pages: 1. О компании, 2. Вторая кастомная страница)
  const [cmsPages, setCmsPages] = useState<Record<string, CmsPageData>>(() => {
    return syncLoadPersistentData('rivauto_cms_pages', BACKUP_CMS);
  });
  
  // Brands & Brand Selection State
  const [brandsList, setBrandsList] = useState<BrandItem[]>(() => {
    return syncLoadPersistentData('rivauto_brands', BACKUP_BRANDS);
  });

  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
  const [isBrandManagerOpen, setIsBrandManagerOpen] = useState(false);

  // Persist Active Nav & Update Document Title
  useEffect(() => {
    savePersistentData('rivauto_active_nav', activeNav);
    
    if (selectedBrandId && selectedBrandId !== 'all') {
      const brandName = selectedBrandId.toUpperCase();
      document.title = `${brandName} — Автокомпоненты RIVAUTO GROUP`;
    } else if (activeNav === 'catalog') {
      document.title = `Каталог автокомпонентов — RIVAUTO GROUP`;
    } else if (activeNav === 'about') {
      document.title = `О компании — RIVAUTO GROUP`;
    } else if (activeNav === 'custom_page') {
      document.title = `Партнерам — RIVAUTO GROUP`;
    } else {
      document.title = `RIVAUTO GROUP — B2B Портал Автокомпонентов (DEXTRA, KAIDO, KATSUMOTO, LUXOR)`;
    }
  }, [activeNav, selectedBrandId]);
  
  // Role State (Guest vs Administrator)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return syncLoadPersistentData('luxor_is_admin', false);
  });

  // Hydration state to prevent initial React state from overwriting IndexedDB before reading completes
  const [isHydrated, setIsHydrated] = useState(false);

  // Local Storage & IndexedDB Persistent Parts Catalog
  const [partsList, setPartsList] = useState<LuxorPart[]>(() => {
    return syncLoadPersistentData('luxor_parts_list', BACKUP_PARTS);
  });

  // Local Storage & IndexedDB Persistent Categories
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => {
    return syncLoadPersistentData('luxor_categories', BACKUP_CATS);
  });

  // Asynchronously hydrate from Server API & IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    async function hydrateFromIndexedDB() {
      try {
        const [cats, parts, brands, theme, cms, leads, serverCatalog] = await Promise.all([
          loadPersistentData<CategoryItem[]>('luxor_categories', BACKUP_CATS),
          loadPersistentData<LuxorPart[]>('luxor_parts_list', BACKUP_PARTS),
          loadPersistentData<BrandItem[]>('rivauto_brands', BACKUP_BRANDS),
          loadPersistentData<SiteAppearanceSettings>('rivauto_theme_settings', BACKUP_THEME),
          loadPersistentData<Record<string, CmsPageData>>('rivauto_cms_pages', BACKUP_CMS),
          loadPersistentData<WholesaleLead[]>('rivauto_wholesale_leads', []),
          loadServerCatalog(),
        ]);

        if (isMounted) {
          const effectiveCats = (serverCatalog?.luxor_categories && serverCatalog.luxor_categories.length > 0)
            ? serverCatalog.luxor_categories
            : (cats && cats.length > 0 ? cats : BACKUP_CATS);

          const effectiveParts = serverCatalog?.luxor_parts_list || parts;
          const effectiveBrands = serverCatalog?.rivauto_brands || brands;
          const effectiveTheme = serverCatalog?.rivauto_theme_settings || theme;
          const effectiveCms = serverCatalog?.rivauto_cms_pages || cms;

          if (effectiveCats && Array.isArray(effectiveCats) && effectiveCats.length > 0) {
            const mergedCats = effectiveCats.map((c) => {
              const backupMatch = BACKUP_CATS.find((b) => b.id === c.id || b.slug === c.slug);
              const localMatch = cats?.find((lc) => lc.id === c.id || lc.slug === c.slug);
              // Prioritize Cloudinary HTTPS URL over local Data URL
              let activeImage = c.imageUrl || localMatch?.imageUrl || backupMatch?.imageUrl;
              if (backupMatch?.imageUrl && backupMatch.imageUrl.startsWith('https://res.cloudinary.com')) {
                activeImage = backupMatch.imageUrl;
              }
              if (c.imageUrl && c.imageUrl.startsWith('https://res.cloudinary.com')) {
                activeImage = c.imageUrl;
              }
              return {
                ...(backupMatch || {}),
                ...c,
                imageUrl: activeImage,
              };
            });
            setCategoriesList(mergedCats);
          } else {
            setCategoriesList(BACKUP_CATS);
          }

          if (effectiveParts && Array.isArray(effectiveParts) && effectiveParts.length > 0) {
            const mergedParts = effectiveParts.map((p, idx) => {
              const backupMatch = BACKUP_PARTS.find((b) => b.sku === p.sku) || BACKUP_PARTS[idx % BACKUP_PARTS.length];
              return {
                ...backupMatch,
                ...p,
                imageUrl: p.imageUrl || backupMatch?.imageUrl,
              };
            });
            setPartsList(mergedParts);
          } else {
            setPartsList(BACKUP_PARTS);
          }

          if (effectiveBrands && Array.isArray(effectiveBrands) && effectiveBrands.length > 0) {
            setBrandsList(effectiveBrands);
          }

          if (effectiveTheme) {
            setAppearanceSettings((prev) => ({
              ...DEFAULT_APPEARANCE_SETTINGS,
              ...BACKUP_THEME,
              ...prev,
              ...effectiveTheme,
              dextraBgImage: effectiveTheme?.dextraBgImage || DEFAULT_APPEARANCE_SETTINGS.dextraBgImage,
              kaidoBgImage: effectiveTheme?.kaidoBgImage || DEFAULT_APPEARANCE_SETTINGS.kaidoBgImage,
              katsumotoBgImage: effectiveTheme?.katsumotoBgImage || DEFAULT_APPEARANCE_SETTINGS.katsumotoBgImage,
              luxorBgImage: effectiveTheme?.luxorBgImage || DEFAULT_APPEARANCE_SETTINGS.luxorBgImage,
            }));
          } else {
            setAppearanceSettings(BACKUP_THEME);
          }

          if (effectiveCms) setCmsPages((prev) => ({ ...BACKUP_CMS, ...prev, ...effectiveCms }));
          if (leads && Array.isArray(leads)) setWholesaleLeads(leads);
          setIsHydrated(true);
        }
      } catch (err) {
        console.error('Error hydrating state from IndexedDB/Server:', err);
        if (isMounted) setIsHydrated(true);
      }
    }

    hydrateFromIndexedDB();

    return () => {
      isMounted = false;
    };
  }, []);

  // Modal States
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<LuxorPart | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [oemSearchQuery, setOemSearchQuery] = useState<string>('');
  const [activeVehicle, setActiveVehicle] = useState<VehicleSelection | null>(null);
  const [selectedPart, setSelectedPart] = useState<LuxorPart | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Persist Role
  useEffect(() => {
    if (isHydrated) savePersistentData('luxor_is_admin', isAdmin);
  }, [isAdmin, isHydrated]);

  // Persist Parts List (Local & Global Server Sync)
  useEffect(() => {
    if (isHydrated) {
      savePersistentData('luxor_parts_list', partsList);
      saveServerCatalog({ luxor_parts_list: partsList });
    }
  }, [partsList, isHydrated]);

  // Persist Categories List (Local & Global Server Sync)
  useEffect(() => {
    if (isHydrated) {
      savePersistentData('luxor_categories', categoriesList);
      saveServerCatalog({ luxor_categories: categoriesList });
    }
  }, [categoriesList, isHydrated]);

  // Persist Brands List (Local & Global Server Sync)
  useEffect(() => {
    if (isHydrated) {
      savePersistentData('rivauto_brands', brandsList);
      saveServerCatalog({ rivauto_brands: brandsList });
    }
  }, [brandsList, isHydrated]);

  // Persist CMS Pages (Local & Global Server Sync)
  useEffect(() => {
    if (isHydrated) {
      savePersistentData('rivauto_cms_pages', cmsPages);
      saveServerCatalog({ rivauto_cms_pages: cmsPages });
    }
  }, [cmsPages, isHydrated]);

  // Persist Appearance & Theme Settings (Local & Global Server Sync)
  useEffect(() => {
    if (isHydrated) {
      savePersistentData('rivauto_theme_settings', appearanceSettings);
      saveServerCatalog({ rivauto_theme_settings: appearanceSettings });
    }
  }, [appearanceSettings, isHydrated]);

  // Persist Wholesale B2B Leads
  useEffect(() => {
    if (isHydrated) savePersistentData('rivauto_wholesale_leads', wholesaleLeads);
  }, [wholesaleLeads, isHydrated]);

  // Wholesale Lead Handlers
  const handleAddWholesaleLead = (newLeadData: Omit<WholesaleLead, 'id' | 'createdAt'>) => {
    const newLead: WholesaleLead = {
      ...newLeadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setWholesaleLeads((prev) => [newLead, ...prev]);

    // Send email notification to rivavto01@gmail.com
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLeadData),
    }).catch((err) => console.warn('Error sending lead email:', err));
  };

  const handleDeleteWholesaleLead = (leadId: string) => {
    setWholesaleLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  };

  // Update CMS Page Handler
  const handleUpdateCmsPage = (updatedPage: CmsPageData) => {
    setCmsPages((prev) => ({
      ...prev,
      [updatedPage.id]: updatedPage,
    }));
  };

  // Update Brand Handler
  const handleUpdateBrand = (updatedBrand: BrandItem) => {
    setBrandsList((prev) =>
      prev.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
    );
  };

  // Role Toggle
  const handleToggleAdminRole = () => {
    setIsAdmin((prev) => !prev);
  };

  // Admin Catalog Actions
  const handleClearAllProducts = () => {
    if (window.confirm('Внимание! Вы точно хотите ПОЛНОСТЬЮ очистить весь каталог от всех товаров? (Это действие позволит вам создать базу заново с нуля).')) {
      setPartsList([]);
      savePersistentData('luxor_parts_list', []);
      setActiveNav('catalog');
    }
  };

  const handleRestoreDemoProducts = () => {
    if (window.confirm('Восстановить исходную образцовую базу товаров Luxor?')) {
      setPartsList(MOCK_PARTS);
      setCategoriesList(LUXOR_CATEGORIES);
      savePersistentData('luxor_parts_list', MOCK_PARTS);
      savePersistentData('luxor_categories', LUXOR_CATEGORIES);
    }
  };

  // Create / Save Part Handler
  const handleSavePart = (partToSave: LuxorPart) => {
    setPartsList((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === partToSave.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = partToSave;
        return copy;
      } else {
        return [partToSave, ...prev];
      }
    });
    setActiveNav('catalog');
  };

  // Delete Single Part Handler
  const handleDeletePart = (partId: string) => {
    setPartsList((prev) => prev.filter((p) => p.id !== partId));
  };

  // Open Edit Part Modal
  const handleOpenEditPart = (part: LuxorPart) => {
    setEditingPart(part);
    setIsProductEditorOpen(true);
  };

  // Open Create New Part Modal
  const handleOpenCreatePart = () => {
    setEditingPart(null);
    setIsProductEditorOpen(true);
  };

  // CSV Import Parts Handler
  const handleImportParts = (newParts: LuxorPart[]) => {
    setPartsList((prev) => [...newParts, ...prev]);
    setActiveNav('catalog');
  };

  // Add Category Handler
  const handleAddCategory = (newCat: CategoryItem) => {
    setCategoriesList((prev) => [...prev, newCat]);
  };

  // Update Category Handler
  const handleUpdateCategory = (updatedCat: CategoryItem) => {
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === updatedCat.id || c.slug === updatedCat.slug ? updatedCat : c))
    );
  };

  // Delete Category Handler
  const handleDeleteCategory = (catSlug: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.slug !== catSlug));
  };

  // Filter Parts Logic
  const filteredParts = useMemo(() => {
    return partsList.filter((part) => {
      // 0. Brand Filter
      if (selectedBrandId !== 'all' && (part.brandId || 'luxor') !== selectedBrandId) {
        return false;
      }

      // 1. Category Filter
      if (selectedCategory !== 'all' && part.categorySlug !== selectedCategory) {
        return false;
      }

      // 2. Subcategory Filter
      if (selectedSubcategory && part.subcategory !== selectedSubcategory) {
        return false;
      }

      // 3. OEM / SKU / Title Query Search
      if (oemSearchQuery) {
        const queryNorm = oemSearchQuery.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const skuNorm = (part.sku || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const itemCodeNorm = (part.itemCode || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const titleMatch = (part.title || '').toLowerCase().includes(oemSearchQuery.toLowerCase());
        const skuMatch = skuNorm.includes(queryNorm) || itemCodeNorm.includes(queryNorm);
        const oemMatch = (part.crossReferences || []).some((cr) =>
          (cr.normalizedNumber || '').toLowerCase().includes(queryNorm) ||
          (cr.oemNumber || '').toLowerCase().includes(oemSearchQuery.toLowerCase())
        );

        if (!titleMatch && !skuMatch && !oemMatch) return false;
      }

      // 4. Vehicle Garage Filter
      if (activeVehicle) {
        const hasVehicleMatch = (part.fitments || []).some((fit) => {
          const makeMatch = fit.make.toLowerCase() === activeVehicle.make.toLowerCase();
          const engineMatch = !activeVehicle.engineCode ||
            (fit.engineCode || '').toLowerCase().includes(activeVehicle.engineCode.toLowerCase());
          return makeMatch && engineMatch;
        });

        if (!hasVehicleMatch) return false;
      }

      return true;
    });
  }, [partsList, selectedBrandId, selectedCategory, selectedSubcategory, oemSearchQuery, activeVehicle]);

  const handleSearchOem = (query: string) => {
    setOemSearchQuery(query);
    setActiveNav('catalog');
  };

  const handleSelectVehicle = (vehicle: VehicleSelection) => {
    setActiveVehicle(vehicle);
    setActiveNav('catalog');
  };

  const handleSearchVin = (vin: string) => {
    setActiveVehicle({
      make: 'Chevrolet',
      model: 'Cruze (J300)',
      year: 2012,
      engineCode: 'F18D4',
    });
    setActiveNav('catalog');
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('');
    setOemSearchQuery('');
    setActiveVehicle(null);
  };

  const handleSelectCategoryFromLanding = (slug: string) => {
    setSelectedCategory(slug);
    setActiveNav('catalog');
  };

  const handleMovePart = (partId: string, direction: 'left' | 'right') => {
    setPartsList((prevParts) => {
      const index = prevParts.findIndex((p) => p.id === partId);
      if (index === -1) return prevParts;

      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prevParts.length) return prevParts;

      const newParts = [...prevParts];
      const [movedPart] = newParts.splice(index, 1);
      newParts.splice(targetIndex, 0, movedPart);

      savePersistentData('luxor_parts_list', newParts);
      return newParts;
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] text-gray-900 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Top Header & Navigation */}
        <Header
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          partsCount={partsList.length}
          isAdmin={isAdmin}
          selectedBrandId={selectedBrandId}
          aboutNavTitle={cmsPages.about?.navTitle || 'О компании'}
          customNavTitle={cmsPages.custom?.navTitle || 'Партнерам'}
          appearanceSettings={appearanceSettings}
          brands={brandsList}
          onSelectBrand={setSelectedBrandId}
          onOpenManageBrands={() => setIsBrandManagerOpen(true)}
          onOpenThemeEditor={() => setIsThemeEditorOpen(true)}
          onOpenScreenshots={() => setIsScreenshotsModalOpen(true)}
          onToggleAdminRole={handleToggleAdminRole}
          onOpenCreateProduct={handleOpenCreatePart}
          onOpenManageCategories={() => setIsCategoryManagerOpen(true)}
          onClearAllProducts={handleClearAllProducts}
          onRestoreDemoProducts={handleRestoreDemoProducts}
        />

        {/* Main Body Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* NAV ABOUT PAGE: О компании */}
          {activeNav === 'about' && (
            <CmsPageView
              pageData={cmsPages.about}
              isAdmin={isAdmin}
              onUpdatePage={handleUpdateCmsPage}
              onGoToCatalog={() => setActiveNav('catalog')}
              onSelectBrand={setSelectedBrandId}
            />
          )}

          {/* NAV CUSTOM PAGE: Вторая кастомная страница */}
          {activeNav === 'custom_page' && (
            <CmsPageView
              pageData={cmsPages.custom}
              isAdmin={isAdmin}
              onUpdatePage={handleUpdateCmsPage}
              onGoToCatalog={() => setActiveNav('catalog')}
              onSelectBrand={setSelectedBrandId}
            />
          )}

          {/* NAV 0: LANDING / BRAND SHOWCASE */}
          {activeNav === 'landing' && (
            <BrandLanding
              categories={categoriesList}
              brands={brandsList}
              selectedBrandId={selectedBrandId}
              onSelectBrand={setSelectedBrandId}
              parts={partsList}
              isAdmin={isAdmin}
              appearanceSettings={appearanceSettings}
              onUpdateAppearanceSettings={(updated) =>
                setAppearanceSettings((prev) => ({ ...prev, ...updated }))
              }
              wholesaleLeads={wholesaleLeads}
              onSubmitWholesaleLead={handleAddWholesaleLead}
              onDeleteWholesaleLead={handleDeleteWholesaleLead}
              onOpenManageCategories={(catToEdit) => {
                setEditingCategory(catToEdit || null);
                setIsCategoryManagerOpen(true);
              }}
              onOpenManageBrands={() => setIsBrandManagerOpen(true)}
              onOpenAddProduct={handleOpenCreatePart}
              onEditPart={handleOpenEditPart}
              onDeletePart={handleDeletePart}
              onMovePart={handleMovePart}
              onGoToCatalog={() => setActiveNav('catalog')}
              onSearchOem={handleSearchOem}
              onOpenDetail={setSelectedPart}
              onSelectVehicle={handleSelectVehicle}
              onGoToNav={setActiveNav}
              onSelectCategory={handleSelectCategoryFromLanding}
              onUpdateBrand={(brandId, updatedFields) =>
                setBrandsList((prev) =>
                  prev.map((b) => (b.id === brandId ? { ...b, ...updatedFields } : b))
                )
              }
            />
          )}

          {/* NAV 1: CATALOG VIEW */}
          {activeNav === 'catalog' && (
            <div className="space-y-6">
              {/* Multi-Select Filter Bar & Subcategory Chips */}
              <SmartSearch
                onSearchOem={handleSearchOem}
                onSelectVehicle={handleSelectVehicle}
                onSearchVin={handleSearchVin}
                activeVehicle={activeVehicle}
                onClearVehicle={() => setActiveVehicle(null)}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={setSelectedSubcategory}
              />

              {/* Active Brand Selector Bar inside Catalog */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-md font-mono text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] mr-1">
                    Фильтр Марки:
                  </span>
                  <button
                    onClick={() => setSelectedBrandId('all')}
                    className={`px-3 py-1.5 rounded-xl transition text-xs font-bold ${
                      selectedBrandId === 'all'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    Вся Группа (4 Бренда)
                  </button>
                  {brandsList.map((brand) => {
                    const isSel = selectedBrandId === brand.id;
                    return (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrandId(brand.id)}
                        className={`px-3 py-1.5 rounded-xl transition text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                          isSel
                            ? brand.id === 'dextra' ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' :
                              brand.id === 'kaido' ? 'bg-rose-600 text-white ring-2 ring-rose-400' :
                              brand.id === 'katsumoto' ? 'bg-red-700 text-white ring-2 ring-red-400' :
                              'bg-sky-500 text-white ring-2 ring-sky-300'
                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          brand.id === 'dextra' ? 'bg-amber-400' :
                          brand.id === 'kaido' ? 'bg-rose-400' :
                          brand.id === 'katsumoto' ? 'bg-red-500' :
                          'bg-sky-400'
                        }`} />
                        <span>{brand.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-slate-300 text-[11px] font-sans">
                  {selectedBrandId === 'all' ? (
                    <span>Показаны товары <strong className="text-emerald-400 font-mono font-bold">всех 4 брендов</strong></span>
                  ) : (
                    <span>Фильтр по бренду: <strong className="text-white font-mono font-bold uppercase">{selectedBrandId}</strong> ({filteredParts.length} артикулов)</span>
                  )}
                </div>
              </div>

              {/* Catalog Bar / Admin Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-gray-200/90 shadow-xs text-xs font-sans">
                <div className="flex items-center space-x-2 text-gray-800 font-bold">
                  <span>Найдено деталей:</span>
                  <span className="bg-[#1E4E8C]/10 text-[#1E4E8C] px-2.5 py-0.5 rounded-md font-mono text-xs">
                    {filteredParts.length}
                  </span>
                  {isAdmin && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                      Режим Администратора
                    </span>
                  )}
                </div>

                {/* Right Items-Per-Page Controls & Admin Add Button */}
                <div className="flex items-center space-x-3 text-gray-600 font-medium">
                  {isAdmin && (
                    <button
                      onClick={handleOpenCreatePart}
                      className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-2xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Создать деталь</span>
                    </button>
                  )}

                  <span>Показать по:</span>
                  {[12, 24, 48, 60].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPageSize(size)}
                      className={`transition ${
                        pageSize === size
                          ? 'text-[#1B4E9B] font-bold underline'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards Grid */}
              {filteredParts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredParts.map((part) => (
                    <ProductCard
                      key={part.id}
                      part={part}
                      onOpenDetail={setSelectedPart}
                      isAdmin={isAdmin}
                      onEditPart={handleOpenEditPart}
                      onDeletePart={handleDeletePart}
                      currencySymbol={appearanceSettings.currencySymbol}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 font-sans shadow-2xs">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                    <Wrench className="w-8 h-8 text-[#1E4E8C]" />
                  </div>
                  
                  {partsList.length === 0 ? (
                    <div className="space-y-3 max-w-lg mx-auto">
                      <h3 className="text-lg font-bold text-gray-900">
                        Каталог пуст
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Вы полностью очистили базу товаров. Вы можете создать карточки товаров вручную, загрузить номенклатуру из CSV-файла или восстановить демо-товары.
                      </p>

                      <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <button
                          onClick={handleOpenCreatePart}
                          className="bg-[#1B4E9B] hover:bg-[#153D7A] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Создать первый товар</span>
                        </button>

                        <button
                          onClick={() => setActiveNav('admin')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Импорт из CSV</span>
                        </button>

                        <button
                          onClick={handleRestoreDemoProducts}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Восстановить демо-товары</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-gray-900">
                        По заданному запросу запчасти не найдены
                      </h3>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">
                        Попробуйте изменить параметр поиска или сбросить активные фильтры.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="bg-[#1B4E9B] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase"
                      >
                        Сбросить все фильтры
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* NAV 2: ADMIN CSV MASS IMPORT */}
          {activeNav === 'admin' && (
            <AdminImport onImportParts={handleImportParts} />
          )}

          {/* NAV 3: ARCHITECTURE & RELATIONAL DATABASE SCHEMA */}
          {activeNav === 'architecture' && <ArchitectureViewer />}

          {/* NAV 4: QUALITY LABORATORY */}
          {activeNav === 'quality' && <QualityTestingLab />}

          {/* NAV 5: AI TECHNICAL ASSISTANT */}
          {activeNav === 'ai' && <AiTechAssistant />}
        </main>

        {/* Product Detail Modal */}
        <ProductDetailModal 
          part={selectedPart} 
          onClose={() => setSelectedPart(null)} 
          currencySymbol={appearanceSettings.currencySymbol}
        />

        {/* Product Manual Creator / Editor Modal (Admin Only) */}
        <ProductEditorModal
          partToEdit={editingPart}
          isOpen={isProductEditorOpen}
          onClose={() => setIsProductEditorOpen(false)}
          onSavePart={handleSavePart}
          existingCategories={categoriesList}
        />

        {/* Category / Group Manager Modal (Admin Only) */}
        <CategoryManagerModal
          isOpen={isCategoryManagerOpen}
          onClose={() => {
            setIsCategoryManagerOpen(false);
            setEditingCategory(null);
          }}
          categories={categoriesList}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          initialEditingCategory={editingCategory}
        />

        {/* Brand Manager Modal (Admin Only) */}
        <BrandManagerModal
          brands={brandsList}
          isOpen={isBrandManagerOpen}
          onClose={() => setIsBrandManagerOpen(false)}
          onUpdateBrand={handleUpdateBrand}
        />

        {/* Theme & Design Editor Modal (Admin Only) */}
        <ThemeEditorModal
          isOpen={isThemeEditorOpen}
          onClose={() => setIsThemeEditorOpen(false)}
          settings={appearanceSettings}
          onSaveSettings={setAppearanceSettings}
        />

        {/* Full Project Screenshots Gallery & Downloader Modal */}
        <ScreenshotsGalleryModal
          isOpen={isScreenshotsModalOpen}
          onClose={() => setIsScreenshotsModalOpen(false)}
        />
      </div>

      {/* Industrial B2B Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-10 text-xs text-gray-600 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 text-gray-900 font-black text-sm font-mono mb-2">
                <span className="text-[#1E4E8C]">LUXOR</span>
                <span>AUTOPARTS</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Инженерные компоненты систем охлаждения, кондиционирования и тормозных систем. Сертифицировано по DIN EN ISO/TS 16949 и ECE R90.
              </p>
            </div>

            <div>
              <div className="text-gray-900 font-bold text-sm mb-2">Навигация по порталу</div>
              <ul className="space-y-1.5 text-gray-600 text-xs">
                <li>
                  <button onClick={() => setActiveNav('landing')} className="hover:text-emerald-700 hover:underline">
                    • Главный портал Группы (4 Бренда)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNav('catalog')} className="hover:text-emerald-700 hover:underline">
                    • Каталог товаров ({partsList.length} артикулов)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNav('about')} className="hover:text-emerald-700 hover:underline font-bold text-slate-900">
                    • {cmsPages.about?.navTitle || 'О компании'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNav('custom_page')} className="hover:text-emerald-700 hover:underline font-bold text-slate-900">
                    • {cmsPages.custom?.navTitle || 'Партнерам и Оптовикам'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-gray-900 font-bold text-sm mb-2">Контакты B2B Отдела Продаж</div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Почта отдела продаж: <a href="mailto:rivavto01@gmail.com" className="text-[#1E4E8C] font-bold hover:underline">rivavto01@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-mono">
            <div>© 2026 Luxor Technical Autoparts GmbH. Все права защищены.</div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <span>TecDoc Standard</span>
              <span>ISO 9001:2015</span>
              <span>ECE R90 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

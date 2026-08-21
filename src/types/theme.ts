export interface SiteAppearanceSettings {
  // Fonts & Typography
  bodyFont: 'inter' | 'jakarta' | 'roboto' | 'system';
  headingFont: 'unbounded' | 'mono' | 'playfair' | 'jakarta';
  fontSizeBase: 'sm' | 'md' | 'lg';

  // Site Header & Titles
  siteName: string;
  siteTagline: string;
  allGroupNavTitle?: string;
  allGroupBtnShape?: 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  allGroupBtnTheme?: 'dark-emerald' | 'emerald' | 'blue-navy' | 'gradient' | 'amber-gold' | 'outline' | 'rose-red' | 'custom';
  allGroupBtnCustomBg?: string;
  allGroupBtnCustomText?: string;
  allGroupLogoUrl?: string;
  siteLogoUrl?: string;
  topNoticeText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBannerBgUrl: string;
  heroBannerOpacity?: number; // 0 to 100 (%)
  heroBannerOverlayDarkness?: number; // 0 to 100 (%)
  hideHeroSearch?: boolean;
  hideHeroStats?: boolean;
  hideHeroBadge?: boolean;
  hideHeroSubheadline?: boolean;
  heroTextAlignment?: 'left' | 'center' | 'right';

  // Precise Numeric Sizes (px & mm) for Hero, Buttons, Headers & Cards
  heroBannerHeightPx?: number; // e.g. 280 to 700 px (74mm to 185mm)
  heroTitleFontSizePx?: number; // e.g. 24 to 64 px
  heroSubtitleFontSizePx?: number; // e.g. 12 to 24 px
  heroPaddingYPx?: number; // e.g. 24 to 96 px
  heroTextOffsetX?: number; // e.g. -400 to 400 px offset via drag or slider
  heroTextOffsetY?: number; // e.g. -250 to 250 px offset via drag or slider
  heroSearchOffsetX?: number; // e.g. -400 to 400 px offset via drag or slider
  heroSearchOffsetY?: number; // e.g. -250 to 250 px offset via drag or slider
  heroLogoUrl?: string; // URL for interactive PNG logo block on hero banner
  heroLogoOffsetX?: number; // e.g. -500 to 500 px
  heroLogoOffsetY?: number; // e.g. -300 to 300 px
  heroLogoWidthPx?: number; // e.g. 80 to 600 px (default 200px)
  heroLogoOpacity?: number; // 10 to 100 (%) (default 100%)
  customBrandCardHeightPx?: number; // e.g. 180 to 450 px
  siteLogoHeightPx?: number; // e.g. 24 to 64 px
  customButtonHeightPx?: number; // e.g. 32 to 56 px

  // Buttons & UI Controls
  buttonRadius: 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  buttonSize: 'compact' | 'standard' | 'large';
  primaryThemeColor: 'emerald' | 'blue' | 'indigo' | 'amber' | 'slate';

  // Brand Cards & Logos Customization
  brandGridBadgeText?: string;
  brandGridTitleText?: string;
  popularBlockTitle?: string;
  currencySymbol?: string; // e.g., '₸', 'тенге', '₸ (тенге)', 'Руб.', '$'
  brandGridTitleFont?: 'mono' | 'sans' | 'serif' | 'unbounded' | 'oswald' | 'russo' | 'montserrat' | 'custom';
  brandGridCustomFontFamily?: string;
  brandCardHeight: 'compact' | 'medium' | 'tall'; // 220px, 260px, 320px
  dextraBgImage?: string;
  kaidoBgImage?: string;
  katsumotoBgImage?: string;
  luxorBgImage?: string;
  dextraExternalUrl?: string;
  kaidoExternalUrl?: string;
  katsumotoExternalUrl?: string;
  luxorExternalUrl?: string;

  // Kaido Brand Landing Specifics
  kaidoHeroBanner?: string;
  kaidoLogoUrl?: string; // fallback or legacy
  kaidoHeaderLogoUrl?: string; // Button in navbar header
  kaidoBannerLogoUrl?: string; // Floating PNG logo on hero banner
  kaidoBannerTitleFontSize?: number;
  kaidoBannerDescFontSize?: number;
  kaidoBannerOverlayOpacity?: number;
  kaidoBannerTextAlign?: 'left' | 'center' | 'right';
  kaidoBannerPaddingY?: number;
  kaidoBannerLogoHeight?: number;
  kaidoHideBannerTitle?: boolean;
  kaidoTextColor?: string;
  kaidoTextOffsetX?: number;
  kaidoTextOffsetY?: number;
  kaidoSearchOffsetX?: number;
  kaidoSearchOffsetY?: number;
  katsumotoSearchOffsetX?: number;
  katsumotoSearchOffsetY?: number;
  luxorSearchOffsetX?: number;
  luxorSearchOffsetY?: number;
  dextraSearchOffsetX?: number;
  dextraSearchOffsetY?: number;
  kaidoLogoOffsetX?: number;
  kaidoLogoOffsetY?: number;

  // Katsumoto Brand Landing Specifics
  katsumotoHeroBanner?: string;
  katsumotoLogoUrl?: string; // fallback or legacy
  katsumotoHeaderLogoUrl?: string; // Button in navbar header
  katsumotoBannerLogoUrl?: string; // Floating PNG logo on hero banner
  katsumotoBannerTitleFontSize?: number;
  katsumotoBannerDescFontSize?: number;
  katsumotoBannerOverlayOpacity?: number;
  katsumotoBannerTextAlign?: 'left' | 'center' | 'right';
  katsumotoBannerPaddingY?: number;
  katsumotoBannerLogoHeight?: number;
  katsumotoHideBannerTitle?: boolean;
  katsumotoTextColor?: string;
  katsumotoTextOffsetX?: number;
  katsumotoTextOffsetY?: number;
  katsumotoLogoOffsetX?: number;
  katsumotoLogoOffsetY?: number;

  // Luxor Brand Landing Specifics
  luxorHeroBanner?: string;
  luxorLogoUrl?: string; // fallback or legacy
  luxorHeaderLogoUrl?: string; // Button in navbar header
  luxorBannerLogoUrl?: string; // Floating PNG logo on hero banner
  luxorBannerTitleFontSize?: number;
  luxorBannerDescFontSize?: number;
  luxorBannerOverlayOpacity?: number;
  luxorBannerTextAlign?: 'left' | 'center' | 'right';
  luxorBannerPaddingY?: number;
  luxorBannerLogoHeight?: number;
  luxorHideBannerTitle?: boolean;
  luxorTextColor?: string;
  luxorTextOffsetX?: number;
  luxorTextOffsetY?: number;
  luxorLogoOffsetX?: number;
  luxorLogoOffsetY?: number;

  // Dextra Brand Landing Specifics
  dextraHeroBanner?: string;
  dextraLogoUrl?: string; // fallback or legacy
  dextraHeaderLogoUrl?: string; // Button in navbar header
  dextraBannerLogoUrl?: string; // Floating PNG logo on hero banner
  dextraBannerTitleFontSize?: number;
  dextraBannerDescFontSize?: number;
  dextraBannerOverlayOpacity?: number;
  dextraBannerTextAlign?: 'left' | 'center' | 'right';
  dextraBannerPaddingY?: number;
  dextraBannerLogoHeight?: number;
  dextraHideBannerTitle?: boolean;
  dextraTextColor?: string;
  dextraTextOffsetX?: number;
  dextraTextOffsetY?: number;
  dextraLogoOffsetX?: number;
  dextraLogoOffsetY?: number;

  // Interactive Banner Styling (Global Fallback)
  bannerTitleFontSize?: number;
  bannerDescFontSize?: number;
  bannerOverlayOpacity?: number;
  bannerTextAlign?: 'left' | 'center' | 'right';
  bannerPaddingY?: number;
  bannerTextColor?: string;
  bannerLogoHeight?: number;
  bannerLogoOpacity?: number;
  hideBannerTitle?: boolean;

  // Wholesale / B2B Form Customization (Persistence)
  wholesaleTitle?: string;
  wholesaleSubtitle?: string;
  wholesaleButtonText?: string;
  wholesaleSuccessText?: string;
  wholesaleHideBlock?: boolean;
}

export interface WholesaleLead {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  brand?: string;
}

export const DEFAULT_APPEARANCE_SETTINGS: SiteAppearanceSettings = {
  bodyFont: 'jakarta',
  headingFont: 'mono',
  fontSizeBase: 'md',

  siteName: 'RIVAUTO GROUP',
  siteTagline: 'Холдинг Автокомпонентов (DEXTRA, KAIDO, KATSUMOTO, LUXOR)',
  allGroupNavTitle: 'Вся Группа',
  allGroupBtnShape: 'rounded-xl',
  allGroupBtnTheme: 'dark-emerald',
  allGroupBtnCustomBg: '#0f172a',
  allGroupBtnCustomText: '#34d399',
  allGroupLogoUrl: '',
  siteLogoUrl: '/assets/site-images/Кнопки шапки/РИВ.png',
  topNoticeText: '⚡ Официальный портал дистрибьютора RIVAUTO GROUP — Прямые оптовые поставки без посредников',
  heroHeadline: 'ПРОМЫШЛЕННЫЕ АВТОКОМПОНЕНТЫ OEM/OES КЛАССА',
  heroSubheadline: 'Единая номенклатура 4 ведущих брендов: DEXTRA, KAIDO, KATSUMOTO, LUXOR. Гарантия до 24 месяцев.',
  heroBannerBgUrl: '/assets/site-images/Главный банер/b5ea1a37-4e7c-4694-a9e1-a3504d0d71b3.png',
  heroBannerOpacity: 80,
  heroBannerOverlayDarkness: 50,
  hideHeroSearch: false,
  hideHeroStats: false,
  hideHeroBadge: false,
  hideHeroSubheadline: false,
  heroTextAlignment: 'center',

  heroBannerHeightPx: 420,
  heroTitleFontSizePx: 40,
  heroSubtitleFontSizePx: 15,
  heroPaddingYPx: 40,
  heroTextOffsetX: 0,
  heroTextOffsetY: 0,
  heroSearchOffsetX: 0,
  heroSearchOffsetY: 0,
  heroLogoUrl: '',
  heroLogoOffsetX: 0,
  heroLogoOffsetY: 0,
  heroLogoWidthPx: 200,
  heroLogoOpacity: 100,
  customBrandCardHeightPx: 260,
  siteLogoHeightPx: 32,
  customButtonHeightPx: 40,

  buttonRadius: 'rounded-xl',
  buttonSize: 'standard',
  primaryThemeColor: 'emerald',

  brandGridBadgeText: 'Официальный портфель брендов RIVAUTO GROUP',
  brandGridTitleText: 'Собственные Торговые Марки',
  popularBlockTitle: 'ПОПУЛЯРНЫЕ ПОЗИЦИИ ВСЕХ БРЕНДОВ',
  currencySymbol: '₸',
  brandCardHeight: 'medium',
  dextraBgImage: '/assets/site-images/DEXTRA_80KB.webp',
  kaidoBgImage: 'https://res.cloudinary.com/iupbflicf/image/upload/v1787224722/KAIDO_80KB.jpg',
  katsumotoBgImage: 'https://res.cloudinary.com/iupbflicf/image/upload/v1787224722/KATSUMOTO_80KB.jpg',
  luxorBgImage: 'https://res.cloudinary.com/iupbflicf/image/upload/v1787224723/LUXOR_80KB.jpg',

  kaidoHeroBanner: '/assets/site-images/Каидо1.png',
  katsumotoHeroBanner: '/assets/site-images/Катсумото1.png',
  luxorHeroBanner: '/assets/site-images/Люксор1.jpg',
  dextraHeroBanner: '/assets/site-images/Декстра1.png',
  kaidoHeaderLogoUrl: '/assets/site-images/Кнопки шапки/Каидо.png',
  katsumotoHeaderLogoUrl: '/assets/site-images/Кнопки шапки/Катсумото.png',
  luxorHeaderLogoUrl: '/assets/site-images/Кнопки шапки/Люксор.png',
  dextraHeaderLogoUrl: '/assets/site-images/Кнопки шапки/Декстра.png',
  kaidoLogoUrl: '/assets/site-images/Кнопки шапки/Каидо.png',
  katsumotoLogoUrl: '/assets/site-images/Кнопки шапки/Катсумото.png',
  luxorLogoUrl: '/assets/site-images/Кнопки шапки/Люксор.png',
  dextraLogoUrl: '/assets/site-images/Кнопки шапки/Декстра.png',

  bannerTitleFontSize: 44,
  bannerDescFontSize: 16,
  bannerOverlayOpacity: 65,
  bannerTextAlign: 'left',
  bannerPaddingY: 48,
  bannerLogoHeight: 60,
  bannerLogoOpacity: 100,
  wholesaleTitle: 'ОПТОВОЕ СОТРУДНИЧЕСТВО С RIVAUTO GROUP',
  wholesaleSubtitle: 'Получите прямой прайс-лист для дистрибьюторов на 4 бренда: DEXTRA, KAIDO, KATSUMOTO, LUXOR.',
  wholesaleButtonText: 'ЗАПРОСИТЬ КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ',
  wholesaleSuccessText: 'Заявка успешно отправлена! Наш отдел оптовых продаж свяжется с вами в течение 15 минут.',
  wholesaleHideBlock: false,
};

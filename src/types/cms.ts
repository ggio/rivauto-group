export interface CmsArticleBlock {
  id: string;
  title: string;
  subtitle?: string;
  categoryBadge?: string;
  content: string;
  imageUrl?: string;
  statNumber?: string;
  statLabel?: string;
  ctaText?: string;
  date?: string;
  contentFontSize?: number;
  contentFontFamily?: string; // 'font-sans' | 'font-mono' | 'font-serif'
  contentColor?: string; // hex or css color
  titleFontFamily?: string;
  titleColor?: string;
  titleFontSize?: number;
  subtitleFontFamily?: string;
  subtitleColor?: string;
  // Visibility toggles
  hideTitle?: boolean;
  hideSubtitle?: boolean;
  hideCategoryBadge?: boolean;
  hideContent?: boolean;
  hideImage?: boolean;
  hideStat?: boolean;
  hideCtaButton?: boolean;
}

export interface CmsPageData {
  id: string; // 'about' | 'custom'
  navTitle: string;
  pageTitle: string;
  hidePageTitle?: boolean;
  titleOffsetX?: number;
  titleOffsetY?: number;
  pageSubtitle?: string;
  pageSubtitle1?: string;
  pageSubtitle2?: string;
  pageSubtitle3?: string;
  hideSubtitle1?: boolean;
  hideSubtitle2?: boolean;
  hideSubtitle3?: boolean;
  titleFontSize?: number;
  titleFrameWidth?: number;
  subtitle1OffsetX?: number;
  subtitle1OffsetY?: number;
  subtitle1FontSize?: number;
  subtitle1FrameWidth?: number;
  subtitle2OffsetX?: number;
  subtitle2OffsetY?: number;
  subtitle2FontSize?: number;
  subtitle2FrameWidth?: number;
  subtitle3OffsetX?: number;
  subtitle3OffsetY?: number;
  subtitle3FontSize?: number;
  subtitle3FrameWidth?: number;
  bannerImage: string;
  bannerOpacity?: number; // 0 to 100
  bannerHeight?: number; // e.g. 300 to 650 px
  textFrameWidth?: number; // e.g. 350 to 1200 px (max-width)
  textFramePadding?: number; // e.g. 12 to 64 px
  textFrameBgOpacity?: number; // 0 to 90%
  badgeText?: string;
  hideBannerButton?: boolean;
  bannerButtonText?: string;
  articles: CmsArticleBlock[];
}

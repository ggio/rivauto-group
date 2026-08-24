import { CmsPageData } from '../types/cms';

export const INITIAL_CMS_PAGES: Record<string, CmsPageData> = {
  about: {
    id: 'about',
    navTitle: 'О компании',
    pageTitle: '',
    pageSubtitle: '',
    pageSubtitle1: '',
    pageSubtitle2: '',
    subtitle1OffsetX: 0,
    subtitle1OffsetY: 0,
    subtitle2OffsetX: 0,
    subtitle2OffsetY: 0,
    bannerImage: '',
    hideBannerButton: true,
    articles: [],
  },
  custom: {
    id: 'custom',
    navTitle: 'Партнерам',
    pageTitle: '',
    pageSubtitle: '',
    pageSubtitle1: '',
    pageSubtitle2: '',
    subtitle1OffsetX: 0,
    subtitle1OffsetY: 0,
    subtitle2OffsetX: 0,
    subtitle2OffsetY: 0,
    bannerImage: '',
    articles: [],
  },
};

import React, { useState, useEffect } from 'react';
import { CmsPageData, CmsArticleBlock } from '../types/cms';
import { 
  Building2, Edit3, Plus, Trash2, Save, Image as ImageIcon, 
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, FileText, X, RefreshCw, Upload, Eye, EyeOff, Move
} from 'lucide-react';

interface CmsPageViewProps {
  pageData: CmsPageData;
  isAdmin: boolean;
  onUpdatePage: (updatedPage: CmsPageData) => void;
  onGoToCatalog: () => void;
  onSelectBrand?: (brandId: string) => void;
}

export const CmsPageView: React.FC<CmsPageViewProps> = ({
  pageData,
  isAdmin,
  onUpdatePage,
  onGoToCatalog,
  onSelectBrand,
}) => {
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CmsArticleBlock | null>(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);

  // Mouse Drag-and-Drop state for Title (H1)
  const [isDraggingTitle, setIsDraggingTitle] = useState(false);
  const [dragStartTitlePos, setDragStartTitlePos] = useState({ x: 0, y: 0 });
  const [initialTitleOffset, setInitialTitleOffset] = useState({ x: 0, y: 0 });
  const [currentTitleOffsetX, setCurrentTitleOffsetX] = useState(pageData.titleOffsetX || 0);
  const [currentTitleOffsetY, setCurrentTitleOffsetY] = useState(pageData.titleOffsetY || 0);

  // Mouse Drag-and-Drop state for Subtitle 1
  const [isDraggingSub1, setIsDraggingSub1] = useState(false);
  const [dragStartSub1Pos, setDragStartSub1Pos] = useState({ x: 0, y: 0 });
  const [initialSub1Offset, setInitialSub1Offset] = useState({ x: 0, y: 0 });
  const [currentSub1OffsetX, setCurrentSub1OffsetX] = useState(pageData.subtitle1OffsetX || 0);
  const [currentSub1OffsetY, setCurrentSub1OffsetY] = useState(pageData.subtitle1OffsetY || 0);

  // Mouse Drag-and-Drop state for Subtitle 2
  const [isDraggingSub2, setIsDraggingSub2] = useState(false);
  const [dragStartSub2Pos, setDragStartSub2Pos] = useState({ x: 0, y: 0 });
  const [initialSub2Offset, setInitialSub2Offset] = useState({ x: 0, y: 0 });
  const [currentSub2OffsetX, setCurrentSub2OffsetX] = useState(pageData.subtitle2OffsetX || 0);
  const [currentSub2OffsetY, setCurrentSub2OffsetY] = useState(pageData.subtitle2OffsetY || 0);

  // Mouse Drag-and-Drop state for Subtitle 3
  const [isDraggingSub3, setIsDraggingSub3] = useState(false);
  const [dragStartSub3Pos, setDragStartSub3Pos] = useState({ x: 0, y: 0 });
  const [initialSub3Offset, setInitialSub3Offset] = useState({ x: 0, y: 0 });
  const [currentSub3OffsetX, setCurrentSub3OffsetX] = useState(pageData.subtitle3OffsetX || 0);
  const [currentSub3OffsetY, setCurrentSub3OffsetY] = useState(pageData.subtitle3OffsetY || 0);

  // Sync offsets when pageData changes
  useEffect(() => {
    if (!isDraggingTitle) {
      setCurrentTitleOffsetX(pageData.titleOffsetX || 0);
      setCurrentTitleOffsetY(pageData.titleOffsetY || 0);
    }
  }, [pageData.titleOffsetX, pageData.titleOffsetY, isDraggingTitle]);

  useEffect(() => {
    if (!isDraggingSub1) {
      setCurrentSub1OffsetX(pageData.subtitle1OffsetX || 0);
      setCurrentSub1OffsetY(pageData.subtitle1OffsetY || 0);
    }
  }, [pageData.subtitle1OffsetX, pageData.subtitle1OffsetY, isDraggingSub1]);

  useEffect(() => {
    if (!isDraggingSub2) {
      setCurrentSub2OffsetX(pageData.subtitle2OffsetX || 0);
      setCurrentSub2OffsetY(pageData.subtitle2OffsetY || 0);
    }
  }, [pageData.subtitle2OffsetX, pageData.subtitle2OffsetY, isDraggingSub2]);

  useEffect(() => {
    if (!isDraggingSub3) {
      setCurrentSub3OffsetX(pageData.subtitle3OffsetX || 0);
      setCurrentSub3OffsetY(pageData.subtitle3OffsetY || 0);
    }
  }, [pageData.subtitle3OffsetX, pageData.subtitle3OffsetY, isDraggingSub3]);

  // Global Mouse listeners for Title drag
  useEffect(() => {
    if (!isDraggingTitle) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartTitlePos.x;
      const dy = e.clientY - dragStartTitlePos.y;
      setCurrentTitleOffsetX(Math.round(initialTitleOffset.x + dx));
      setCurrentTitleOffsetY(Math.round(initialTitleOffset.y + dy));
    };
    const handleMouseUp = () => {
      setIsDraggingTitle(false);
      onUpdatePage({
        ...pageData,
        titleOffsetX: currentTitleOffsetX,
        titleOffsetY: currentTitleOffsetY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTitle, dragStartTitlePos, initialTitleOffset, currentTitleOffsetX, currentTitleOffsetY, pageData, onUpdatePage]);

  // Global Mouse listeners for Subtitle 1 drag
  useEffect(() => {
    if (!isDraggingSub1) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartSub1Pos.x;
      const dy = e.clientY - dragStartSub1Pos.y;
      setCurrentSub1OffsetX(Math.round(initialSub1Offset.x + dx));
      setCurrentSub1OffsetY(Math.round(initialSub1Offset.y + dy));
    };
    const handleMouseUp = () => {
      setIsDraggingSub1(false);
      onUpdatePage({
        ...pageData,
        subtitle1OffsetX: currentSub1OffsetX,
        subtitle1OffsetY: currentSub1OffsetY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSub1, dragStartSub1Pos, initialSub1Offset, currentSub1OffsetX, currentSub1OffsetY, pageData, onUpdatePage]);

  // Global Mouse listeners for Subtitle 2 drag
  useEffect(() => {
    if (!isDraggingSub2) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartSub2Pos.x;
      const dy = e.clientY - dragStartSub2Pos.y;
      setCurrentSub2OffsetX(Math.round(initialSub2Offset.x + dx));
      setCurrentSub2OffsetY(Math.round(initialSub2Offset.y + dy));
    };
    const handleMouseUp = () => {
      setIsDraggingSub2(false);
      onUpdatePage({
        ...pageData,
        subtitle2OffsetX: currentSub2OffsetX,
        subtitle2OffsetY: currentSub2OffsetY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSub2, dragStartSub2Pos, initialSub2Offset, currentSub2OffsetX, currentSub2OffsetY, pageData, onUpdatePage]);

  // Global Mouse listeners for Subtitle 3 drag
  useEffect(() => {
    if (!isDraggingSub3) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartSub3Pos.x;
      const dy = e.clientY - dragStartSub3Pos.y;
      setCurrentSub3OffsetX(Math.round(initialSub3Offset.x + dx));
      setCurrentSub3OffsetY(Math.round(initialSub3Offset.y + dy));
    };
    const handleMouseUp = () => {
      setIsDraggingSub3(false);
      onUpdatePage({
        ...pageData,
        subtitle3OffsetX: currentSub3OffsetX,
        subtitle3OffsetY: currentSub3OffsetY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSub3, dragStartSub3Pos, initialSub3Offset, currentSub3OffsetX, currentSub3OffsetY, pageData, onUpdatePage]);

  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) return;
    e.preventDefault();
    setIsDraggingTitle(true);
    setDragStartTitlePos({ x: e.clientX, y: e.clientY });
    setInitialTitleOffset({ x: currentTitleOffsetX, y: currentTitleOffsetY });
  };

  const handleMouseDownSub1 = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) return;
    e.preventDefault();
    setIsDraggingSub1(true);
    setDragStartSub1Pos({ x: e.clientX, y: e.clientY });
    setInitialSub1Offset({ x: currentSub1OffsetX, y: currentSub1OffsetY });
  };

  const handleMouseDownSub2 = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) return;
    e.preventDefault();
    setIsDraggingSub2(true);
    setDragStartSub2Pos({ x: e.clientX, y: e.clientY });
    setInitialSub2Offset({ x: currentSub2OffsetX, y: currentSub2OffsetY });
  };

  const handleMouseDownSub3 = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) return;
    e.preventDefault();
    setIsDraggingSub3(true);
    setDragStartSub3Pos({ x: e.clientX, y: e.clientY });
    setInitialSub3Offset({ x: currentSub3OffsetX, y: currentSub3OffsetY });
  };

  // Form states for Header Edit
  const [headerForm, setHeaderForm] = useState({
    navTitle: pageData.navTitle,
    pageTitle: pageData.pageTitle,
    hidePageTitle: pageData.hidePageTitle || false,
    titleOffsetX: pageData.titleOffsetX || 0,
    titleOffsetY: pageData.titleOffsetY || 0,
    titleFontSize: pageData.titleFontSize || 36,
    titleFrameWidth: pageData.titleFrameWidth || 800,
    pageSubtitle1: pageData.pageSubtitle1 || pageData.pageSubtitle || '',
    hideSubtitle1: pageData.hideSubtitle1 || false,
    pageSubtitle2: pageData.pageSubtitle2 || '',
    hideSubtitle2: pageData.hideSubtitle2 || false,
    pageSubtitle3: pageData.pageSubtitle3 || '',
    hideSubtitle3: pageData.hideSubtitle3 || false,
    subtitle1OffsetX: pageData.subtitle1OffsetX || 0,
    subtitle1OffsetY: pageData.subtitle1OffsetY || 0,
    subtitle1FontSize: pageData.subtitle1FontSize || 16,
    subtitle1FrameWidth: pageData.subtitle1FrameWidth || 700,
    subtitle2OffsetX: pageData.subtitle2OffsetX || 0,
    subtitle2OffsetY: pageData.subtitle2OffsetY || 0,
    subtitle2FontSize: pageData.subtitle2FontSize || 14,
    subtitle2FrameWidth: pageData.subtitle2FrameWidth || 700,
    subtitle3OffsetX: pageData.subtitle3OffsetX || 0,
    subtitle3OffsetY: pageData.subtitle3OffsetY || 0,
    subtitle3FontSize: pageData.subtitle3FontSize || 14,
    subtitle3FrameWidth: pageData.subtitle3FrameWidth || 700,
    bannerImage: pageData.bannerImage,
    bannerOpacity: pageData.bannerOpacity ?? 100,
    bannerHeight: pageData.bannerHeight || 420,
    textFrameWidth: pageData.textFrameWidth || 1024,
    textFramePadding: pageData.textFramePadding || 32,
    textFrameBgOpacity: pageData.textFrameBgOpacity || 0,
    hideBannerButton: pageData.hideBannerButton || false,
    bannerButtonText: pageData.bannerButtonText || 'Перейти в Каталог запчастей',
  });

  // Form state for Article Add/Edit
  const [articleForm, setArticleForm] = useState<Partial<CmsArticleBlock>>({
    title: '',
    subtitle: '',
    categoryBadge: '',
    content: '',
    imageUrl: '',
    statNumber: '',
    statLabel: '',
    ctaText: '',
    contentFontSize: undefined,
    contentFontFamily: 'font-sans',
    contentColor: '#334155',
    titleFontFamily: 'font-mono',
    titleColor: '#020617',
    subtitleFontFamily: 'font-mono',
    subtitleColor: '#047857',
    hideTitle: false,
    hideSubtitle: false,
    hideCategoryBadge: false,
    hideContent: false,
    hideImage: false,
    hideStat: false,
    hideCtaButton: false,
  });

  // Open Edit Header modal
  const handleOpenHeaderEdit = () => {
    setHeaderForm({
      navTitle: pageData.navTitle,
      pageTitle: pageData.pageTitle,
      hidePageTitle: pageData.hidePageTitle || false,
      titleOffsetX: pageData.titleOffsetX || 0,
      titleOffsetY: pageData.titleOffsetY || 0,
      titleFontSize: pageData.titleFontSize || 36,
      titleFrameWidth: pageData.titleFrameWidth || 800,
      pageSubtitle1: pageData.pageSubtitle1 || pageData.pageSubtitle || '',
      hideSubtitle1: pageData.hideSubtitle1 || false,
      pageSubtitle2: pageData.pageSubtitle2 || '',
      hideSubtitle2: pageData.hideSubtitle2 || false,
      pageSubtitle3: pageData.pageSubtitle3 || '',
      hideSubtitle3: pageData.hideSubtitle3 || false,
      subtitle1OffsetX: pageData.subtitle1OffsetX || 0,
      subtitle1OffsetY: pageData.subtitle1OffsetY || 0,
      subtitle1FontSize: pageData.subtitle1FontSize || 16,
      subtitle1FrameWidth: pageData.subtitle1FrameWidth || 700,
      subtitle2OffsetX: pageData.subtitle2OffsetX || 0,
      subtitle2OffsetY: pageData.subtitle2OffsetY || 0,
      subtitle2FontSize: pageData.subtitle2FontSize || 14,
      subtitle2FrameWidth: pageData.subtitle2FrameWidth || 700,
      subtitle3OffsetX: pageData.subtitle3OffsetX || 0,
      subtitle3OffsetY: pageData.subtitle3OffsetY || 0,
      subtitle3FontSize: pageData.subtitle3FontSize || 14,
      subtitle3FrameWidth: pageData.subtitle3FrameWidth || 700,
      bannerImage: pageData.bannerImage,
      bannerOpacity: pageData.bannerOpacity ?? 100,
      bannerHeight: pageData.bannerHeight || 420,
      textFrameWidth: pageData.textFrameWidth || 1024,
      textFramePadding: pageData.textFramePadding || 32,
      textFrameBgOpacity: pageData.textFrameBgOpacity || 0,
      hideBannerButton: pageData.hideBannerButton || false,
      bannerButtonText: pageData.bannerButtonText || 'Перейти в Каталог запчастей',
    });
    setIsEditingHeader(true);
  };

  // Save Header edits
  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePage({
      ...pageData,
      navTitle: headerForm.navTitle.trim() || pageData.navTitle,
      pageTitle: headerForm.pageTitle.trim() || pageData.pageTitle,
      hidePageTitle: headerForm.hidePageTitle,
      titleOffsetX: headerForm.titleOffsetX,
      titleOffsetY: headerForm.titleOffsetY,
      titleFontSize: headerForm.titleFontSize,
      titleFrameWidth: headerForm.titleFrameWidth,
      pageSubtitle1: headerForm.pageSubtitle1.trim(),
      hideSubtitle1: headerForm.hideSubtitle1,
      pageSubtitle2: headerForm.pageSubtitle2.trim(),
      hideSubtitle2: headerForm.hideSubtitle2,
      pageSubtitle3: headerForm.pageSubtitle3.trim(),
      hideSubtitle3: headerForm.hideSubtitle3,
      pageSubtitle: headerForm.pageSubtitle1.trim() || pageData.pageSubtitle,
      subtitle1OffsetX: headerForm.subtitle1OffsetX,
      subtitle1OffsetY: headerForm.subtitle1OffsetY,
      subtitle1FontSize: headerForm.subtitle1FontSize,
      subtitle1FrameWidth: headerForm.subtitle1FrameWidth,
      subtitle2OffsetX: headerForm.subtitle2OffsetX,
      subtitle2OffsetY: headerForm.subtitle2OffsetY,
      subtitle2FontSize: headerForm.subtitle2FontSize,
      subtitle2FrameWidth: headerForm.subtitle2FrameWidth,
      subtitle3OffsetX: headerForm.subtitle3OffsetX,
      subtitle3OffsetY: headerForm.subtitle3OffsetY,
      subtitle3FontSize: headerForm.subtitle3FontSize,
      subtitle3FrameWidth: headerForm.subtitle3FrameWidth,
      bannerImage: headerForm.bannerImage.trim() || pageData.bannerImage,
      bannerOpacity: headerForm.bannerOpacity,
      bannerHeight: headerForm.bannerHeight,
      textFrameWidth: headerForm.textFrameWidth,
      textFramePadding: headerForm.textFramePadding,
      textFrameBgOpacity: headerForm.textFrameBgOpacity,
      hideBannerButton: headerForm.hideBannerButton,
      bannerButtonText: headerForm.bannerButtonText.trim(),
    });
    setIsEditingHeader(false);
  };

  // Open Add Article modal
  const handleOpenAddArticle = () => {
    setArticleForm({
      title: '',
      subtitle: '',
      categoryBadge: 'Раздел',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      statNumber: '',
      statLabel: '',
      ctaText: '',
      contentFontSize: undefined,
      contentFontFamily: 'font-sans',
      contentColor: '#334155',
      titleFontFamily: 'font-mono',
      titleColor: '#020617',
      subtitleFontFamily: 'font-mono',
      subtitleColor: '#047857',
      hideTitle: false,
      hideSubtitle: false,
      hideCategoryBadge: false,
      hideContent: false,
      hideImage: false,
      hideStat: false,
      hideCtaButton: false,
    });
    setEditingArticle(null);
    setIsAddingArticle(true);
  };

  // Open Edit Article modal
  const handleOpenEditArticle = (art: CmsArticleBlock) => {
    setEditingArticle(art);
    setArticleForm({
      ...art,
      contentFontSize: art.contentFontSize,
      contentFontFamily: art.contentFontFamily || 'font-sans',
      contentColor: art.contentColor || '#334155',
      titleFontFamily: art.titleFontFamily || 'font-mono',
      titleColor: art.titleColor || '#020617',
      subtitleFontFamily: art.subtitleFontFamily || 'font-mono',
      subtitleColor: art.subtitleColor || '#047857',
      hideTitle: art.hideTitle || false,
      hideSubtitle: art.hideSubtitle || false,
      hideCategoryBadge: art.hideCategoryBadge || false,
      hideContent: art.hideContent || false,
      hideImage: art.hideImage || false,
      hideStat: art.hideStat || false,
      hideCtaButton: art.hideCtaButton || false,
    });
    setIsAddingArticle(false);
  };

  // Save Article (Add or Update)
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title && !articleForm.hideTitle && !articleForm.content) return;

    if (editingArticle) {
      // Update existing
      const updatedArticles = pageData.articles.map((a) =>
        a.id === editingArticle.id
          ? {
              ...a,
              title: articleForm.title || a.title,
              subtitle: articleForm.subtitle,
              categoryBadge: articleForm.categoryBadge,
              content: articleForm.content || a.content,
              imageUrl: articleForm.imageUrl,
              statNumber: articleForm.statNumber,
              statLabel: articleForm.statLabel,
              ctaText: articleForm.ctaText,
              contentFontSize: articleForm.contentFontSize,
              contentFontFamily: articleForm.contentFontFamily,
              contentColor: articleForm.contentColor,
              titleFontFamily: articleForm.titleFontFamily,
              titleColor: articleForm.titleColor,
              subtitleFontFamily: articleForm.subtitleFontFamily,
              subtitleColor: articleForm.subtitleColor,
              hideTitle: articleForm.hideTitle ?? a.hideTitle ?? false,
              hideSubtitle: articleForm.hideSubtitle ?? a.hideSubtitle ?? false,
              hideCategoryBadge: articleForm.hideCategoryBadge ?? a.hideCategoryBadge ?? false,
              hideContent: articleForm.hideContent ?? a.hideContent ?? false,
              hideImage: articleForm.hideImage ?? a.hideImage ?? false,
              hideStat: articleForm.hideStat ?? a.hideStat ?? false,
              hideCtaButton: articleForm.hideCtaButton ?? a.hideCtaButton ?? false,
            }
          : a
      );
      onUpdatePage({ ...pageData, articles: updatedArticles });
    } else {
      // Create new
      const newArt: CmsArticleBlock = {
        id: `art-${Date.now()}`,
        title: articleForm.title || 'Новая статья',
        subtitle: articleForm.subtitle,
        categoryBadge: articleForm.categoryBadge || 'Раздел',
        content: articleForm.content || '',
        imageUrl: articleForm.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        statNumber: articleForm.statNumber,
        statLabel: articleForm.statLabel,
        ctaText: articleForm.ctaText,
        contentFontSize: articleForm.contentFontSize,
        contentFontFamily: articleForm.contentFontFamily || 'font-sans',
        contentColor: articleForm.contentColor || '#334155',
        titleFontFamily: articleForm.titleFontFamily || 'font-mono',
        titleColor: articleForm.titleColor || '#020617',
        subtitleFontFamily: articleForm.subtitleFontFamily || 'font-mono',
        subtitleColor: articleForm.subtitleColor || '#047857',
        date: new Date().getFullYear().toString(),
        hideTitle: articleForm.hideTitle ?? false,
        hideSubtitle: articleForm.hideSubtitle ?? false,
        hideCategoryBadge: articleForm.hideCategoryBadge ?? false,
        hideContent: articleForm.hideContent ?? false,
        hideImage: articleForm.hideImage ?? false,
        hideStat: articleForm.hideStat ?? false,
        hideCtaButton: articleForm.hideCtaButton ?? false,
      };
      onUpdatePage({ ...pageData, articles: [...pageData.articles, newArt] });
    }

    setEditingArticle(null);
    setIsAddingArticle(false);
  };

  // Delete Article
  const handleDeleteArticle = (articleId: string) => {
    if (!confirm('Удалить этот раздел/статью?')) return;
    const updated = pageData.articles.filter((a) => a.id !== articleId);
    onUpdatePage({ ...pageData, articles: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Admin Notice & Control Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-4 rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              CMS
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-950">
                Администратор: Редактирование страницы «{pageData.navTitle}»
              </p>
              <p className="text-[11px] text-slate-900 font-sans">
                Вы можете менять название вкладки в меню, заголовок, баннеры, статьи и иллюстрации.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenHeaderEdit}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Редактировать шапку & Заголовок</span>
            </button>

            <button
              onClick={handleOpenAddArticle}
              className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить статью / раздел</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Banner */}
      <div 
        className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-slate-950 text-white"
        style={{ minHeight: `${(isEditingHeader ? headerForm.bannerHeight : pageData.bannerHeight) || 420}px` }}
      >
        <img
          src={isEditingHeader ? headerForm.bannerImage : pageData.bannerImage}
          alt={isEditingHeader ? headerForm.pageTitle : pageData.pageTitle}
          style={{ 
            height: `${(isEditingHeader ? headerForm.bannerHeight : pageData.bannerHeight) || 420}px`
          }}
          className="w-full object-cover transition-all duration-300"
        />

        {/* Darkening Overlay: active ONLY when opacity slider is less than 100% */}
        {((isEditingHeader ? headerForm.bannerOpacity : pageData.bannerOpacity) ?? 100) < 100 && (
          <div 
            className="absolute inset-0 bg-slate-950 pointer-events-none transition-opacity duration-300"
            style={{ opacity: (100 - ((isEditingHeader ? headerForm.bannerOpacity : pageData.bannerOpacity) ?? 100)) / 100 }}
          />
        )}

        {isAdmin && (
          <div className="absolute top-3 left-3 bg-slate-900/90 text-sky-300 border border-sky-500/50 rounded-lg px-2.5 py-1 text-[11px] font-mono flex items-center space-x-2 shadow-lg z-20 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Рамка текстов: Ширина={(isEditingHeader ? headerForm.textFrameWidth : pageData.textFrameWidth) || 1024}px | Высота={(isEditingHeader ? headerForm.bannerHeight : pageData.bannerHeight) || 420}px | Отступ={(isEditingHeader ? headerForm.textFramePadding : pageData.textFramePadding) || 32}px | Шрифт H1={(isEditingHeader ? headerForm.titleFontSize : pageData.titleFontSize) || 36}px</span>
          </div>
        )}

        <div 
          className={`absolute inset-0 flex flex-col justify-end space-y-4 transition-all ${
            isAdmin ? 'border-2 border-dashed border-sky-400/50 hover:border-sky-400' : ''
          }`}
          style={{
            maxWidth: `${(isEditingHeader ? headerForm.textFrameWidth : pageData.textFrameWidth) || 1024}px`,
            padding: `${(isEditingHeader ? headerForm.textFramePadding : pageData.textFramePadding) || 32}px`,
            backgroundColor: (isEditingHeader ? headerForm.textFrameBgOpacity : pageData.textFrameBgOpacity) ? `rgba(15, 23, 42, ${(isEditingHeader ? headerForm.textFrameBgOpacity : pageData.textFrameBgOpacity) / 100})` : 'transparent',
          }}
        >
          {/* Main Title (Draggable) */}
          {!pageData.hidePageTitle && (
            <div
              onMouseDown={handleMouseDownTitle}
              className={`group relative inline-block transition-all ${
                isAdmin ? (isDraggingTitle ? 'cursor-grabbing ring-2 ring-blue-400 bg-slate-900/80' : 'cursor-grab hover:ring-2 hover:ring-blue-400/80 hover:bg-slate-900/60 rounded-xl p-2.5 border border-dashed border-blue-400/40') : ''
              }`}
              style={{
                transform: `translate3d(${currentTitleOffsetX}px, ${currentTitleOffsetY}px, 0)`,
                transition: isDraggingTitle ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <h1 
                className="font-black text-white tracking-tight font-mono leading-tight"
                style={{
                  fontSize: `${(isEditingHeader ? headerForm.titleFontSize : pageData.titleFontSize) || 36}px`,
                }}
              >
                {isEditingHeader ? headerForm.pageTitle : pageData.pageTitle}
              </h1>

              {isAdmin && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-0 bg-slate-900 text-blue-300 border border-blue-500/50 rounded-lg px-2.5 py-1 text-[11px] font-mono flex items-center space-x-1.5 shadow-xl pointer-events-none z-30 whitespace-nowrap">
                  <Move className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold">Главный заголовок (X: {currentTitleOffsetX}, Y: {currentTitleOffsetY})</span>
                  {(currentTitleOffsetX !== 0 || currentTitleOffsetY !== 0) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentTitleOffsetX(0);
                        setCurrentTitleOffsetY(0);
                        onUpdatePage({ ...pageData, titleOffsetX: 0, titleOffsetY: 0 });
                      }}
                      className="pointer-events-auto hover:underline text-emerald-400 font-bold ml-1.5 bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subtitle 1 Block (Draggable) */}
          {!pageData.hideSubtitle1 && ((isEditingHeader ? headerForm.pageSubtitle1 : pageData.pageSubtitle1) || pageData.pageSubtitle) && (
            <div
              onMouseDown={handleMouseDownSub1}
              className={`group relative transition-all ${
                isAdmin ? (isDraggingSub1 ? 'cursor-grabbing ring-2 ring-amber-400 bg-slate-900/80' : 'cursor-grab hover:ring-2 hover:ring-amber-400/80 hover:bg-slate-900/60 rounded-xl p-2.5 border-2 border-dashed border-amber-400/50') : ''
              }`}
              style={{
                transform: `translate3d(${currentSub1OffsetX}px, ${currentSub1OffsetY}px, 0)`,
                transition: isDraggingSub1 ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                width: '100%',
                maxWidth: `${(isEditingHeader ? headerForm.subtitle1FrameWidth : pageData.subtitle1FrameWidth) || 700}px`,
              }}
            >
              <p 
                className="text-gray-200 font-sans leading-relaxed font-medium whitespace-pre-line break-words w-full"
                style={{
                  fontSize: `${(isEditingHeader ? headerForm.subtitle1FontSize : pageData.subtitle1FontSize) || 16}px`,
                  lineHeight: 1.35,
                }}
              >
                {isEditingHeader ? headerForm.pageSubtitle1 : (pageData.pageSubtitle1 || pageData.pageSubtitle)}
              </p>

              {isAdmin && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-0 bg-slate-900 text-amber-300 border border-amber-500/50 rounded-lg px-2.5 py-1 text-[11px] font-mono flex items-center space-x-1.5 shadow-xl pointer-events-none z-30 whitespace-nowrap">
                  <Move className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold">Подзаголовок 1 (Ширина: {(isEditingHeader ? headerForm.subtitle1FrameWidth : pageData.subtitle1FrameWidth) || 700}px | Шрифт: {(isEditingHeader ? headerForm.subtitle1FontSize : pageData.subtitle1FontSize) || 16}px)</span>
                  {(currentSub1OffsetX !== 0 || currentSub1OffsetY !== 0) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSub1OffsetX(0);
                        setCurrentSub1OffsetY(0);
                        onUpdatePage({ ...pageData, subtitle1OffsetX: 0, subtitle1OffsetY: 0 });
                      }}
                      className="pointer-events-auto hover:underline text-emerald-400 font-bold ml-1.5 bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subtitle 2 Block (Draggable) */}
          {!pageData.hideSubtitle2 && (isEditingHeader ? headerForm.pageSubtitle2 : pageData.pageSubtitle2) && (
            <div
              onMouseDown={handleMouseDownSub2}
              className={`group relative transition-all ${
                isAdmin ? (isDraggingSub2 ? 'cursor-grabbing ring-2 ring-emerald-400 bg-slate-900/80' : 'cursor-grab hover:ring-2 hover:ring-emerald-400/80 hover:bg-slate-900/60 rounded-xl p-2.5 border-2 border-dashed border-emerald-400/50') : ''
              }`}
              style={{
                transform: `translate3d(${currentSub2OffsetX}px, ${currentSub2OffsetY}px, 0)`,
                transition: isDraggingSub2 ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                width: '100%',
                maxWidth: `${(isEditingHeader ? headerForm.subtitle2FrameWidth : pageData.subtitle2FrameWidth) || 700}px`,
              }}
            >
              <p 
                className="text-emerald-300 font-mono leading-relaxed border-l-2 border-emerald-500 pl-3 whitespace-pre-line break-words w-full"
                style={{
                  fontSize: `${(isEditingHeader ? headerForm.subtitle2FontSize : pageData.subtitle2FontSize) || 14}px`,
                  lineHeight: 1.35,
                }}
              >
                {isEditingHeader ? headerForm.pageSubtitle2 : pageData.pageSubtitle2}
              </p>

              {isAdmin && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-0 bg-slate-900 text-emerald-300 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-[11px] font-mono flex items-center space-x-1.5 shadow-xl pointer-events-none z-30 whitespace-nowrap">
                  <Move className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold">Подзаголовок 2 (Ширина: {(isEditingHeader ? headerForm.subtitle2FrameWidth : pageData.subtitle2FrameWidth) || 700}px | Шрифт: {(isEditingHeader ? headerForm.subtitle2FontSize : pageData.subtitle2FontSize) || 14}px)</span>
                  {(currentSub2OffsetX !== 0 || currentSub2OffsetY !== 0) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSub2OffsetX(0);
                        setCurrentSub2OffsetY(0);
                        onUpdatePage({ ...pageData, subtitle2OffsetX: 0, subtitle2OffsetY: 0 });
                      }}
                      className="pointer-events-auto hover:underline text-amber-400 font-bold ml-1.5 bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subtitle 3 Block (Draggable) */}
          {!pageData.hideSubtitle3 && (isEditingHeader ? headerForm.pageSubtitle3 : pageData.pageSubtitle3) && (
            <div
              onMouseDown={handleMouseDownSub3}
              className={`group relative transition-all ${
                isAdmin ? (isDraggingSub3 ? 'cursor-grabbing ring-2 ring-purple-400 bg-slate-900/80' : 'cursor-grab hover:ring-2 hover:ring-purple-400/80 hover:bg-slate-900/60 rounded-xl p-2.5 border-2 border-dashed border-purple-400/50') : ''
              }`}
              style={{
                transform: `translate3d(${currentSub3OffsetX}px, ${currentSub3OffsetY}px, 0)`,
                transition: isDraggingSub3 ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                width: '100%',
                maxWidth: `${(isEditingHeader ? headerForm.subtitle3FrameWidth : pageData.subtitle3FrameWidth) || 700}px`,
              }}
            >
              <p 
                className="text-white !text-white font-sans leading-relaxed border-l-2 border-white/80 pl-3 whitespace-pre-line break-words w-full"
                style={{
                  color: '#ffffff',
                  fontSize: `${(isEditingHeader ? headerForm.subtitle3FontSize : pageData.subtitle3FontSize) || 14}px`,
                  lineHeight: 1.35,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                }}
              >
                {isEditingHeader ? headerForm.pageSubtitle3 : pageData.pageSubtitle3}
              </p>

              {isAdmin && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-0 bg-slate-900 text-purple-300 border border-purple-500/50 rounded-lg px-2.5 py-1 text-[11px] font-mono flex items-center space-x-1.5 shadow-xl pointer-events-none z-30 whitespace-nowrap">
                  <Move className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold">Подзаголовок 3 (Ширина: {(isEditingHeader ? headerForm.subtitle3FrameWidth : pageData.subtitle3FrameWidth) || 700}px | Шрифт: {(isEditingHeader ? headerForm.subtitle3FontSize : pageData.subtitle3FontSize) || 14}px)</span>
                  {(currentSub3OffsetX !== 0 || currentSub3OffsetY !== 0) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSub3OffsetX(0);
                        setCurrentSub3OffsetY(0);
                        onUpdatePage({ ...pageData, subtitle3OffsetX: 0, subtitle3OffsetY: 0 });
                      }}
                      className="pointer-events-auto hover:underline text-amber-400 font-bold ml-1.5 bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!pageData.hideBannerButton && (
            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={onGoToCatalog}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition shadow-lg"
              >
                <span>{pageData.bannerButtonText || 'Перейти в Каталог запчастей'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Articles / Content Blocks Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight flex items-center space-x-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>Публикации и ключевые материалы</span>
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Всего разделов: {pageData.articles.length}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAddArticle}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs font-mono flex items-center space-x-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить новость/статью</span>
            </button>
          )}
        </div>

        {pageData.articles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 space-y-3">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 font-mono">Статьи еще не добавлены</h3>
            <p className="text-xs text-gray-500">
              Включите режим Администратора в шапке сайта, чтобы добавить материалы и публикации.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pageData.articles.map((art, idx) => {
              const isEven = idx % 2 === 0;
              const showImage = !art.hideImage && art.imageUrl;
              const showBadge = !art.hideCategoryBadge && art.categoryBadge;
              const showSubtitle = !art.hideSubtitle && art.subtitle;
              const showTitle = !art.hideTitle && art.title;
              const showContent = !art.hideContent && art.content;
              const showStat = !art.hideStat && (art.statNumber || art.statLabel);
              const showCta = !art.hideCtaButton && art.ctaText;

              return (
                <article
                  key={art.id}
                  className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative group"
                >
                  {/* Admin Quick Action Buttons */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700">
                      <button
                        onClick={() => handleOpenEditArticle(art)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-lg font-bold transition text-xs flex items-center space-x-1"
                        title="Редактировать статью"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="font-mono text-[10px]">Изменить</span>
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="bg-rose-600 hover:bg-rose-500 text-white p-1.5 rounded-lg font-bold transition text-xs flex items-center space-x-1"
                        title="Удалить статью"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`grid grid-cols-1 ${showImage ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} items-center`}>
                    {/* Article Image: Fixed 1:1 Aspect Ratio without cropping */}
                    {showImage && (
                      <div className={`lg:col-span-5 aspect-square w-full relative overflow-hidden bg-slate-50/80 border-b lg:border-b-0 ${isEven ? 'lg:order-1 lg:border-r' : 'lg:order-2 lg:border-l'} border-gray-100 flex items-center justify-center p-3 sm:p-4`}>
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500 rounded-2xl"
                        />
                        {showBadge && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase rounded-lg shadow-sm">
                              {art.categoryBadge}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Article Body Content */}
                    <div className={`${showImage ? 'lg:col-span-7' : 'lg:col-span-12'} p-6 sm:p-8 space-y-4 ${isEven && showImage ? 'lg:order-2' : 'lg:order-1'}`}>
                      {/* If image is hidden but category badge is visible */}
                      {!showImage && showBadge && (
                        <div>
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold uppercase rounded-lg">
                            {art.categoryBadge}
                          </span>
                        </div>
                      )}

                      {showSubtitle && (
                        <p 
                          className={`text-xs font-bold uppercase tracking-widest ${art.subtitleFontFamily || 'font-mono'}`}
                          style={{
                            color: art.subtitleColor || '#047857',
                          }}
                        >
                          {art.subtitle}
                        </p>
                      )}

                      {showTitle && (
                        <h3 
                          className={`font-black tracking-tight leading-snug ${art.titleFontFamily || 'font-mono'}`}
                          style={{
                            color: art.titleColor || '#020617',
                            fontSize: art.titleFontSize
                              ? `${art.titleFontSize}px`
                              : (art.title && art.title.length > 55) || (art.content && art.content.length > 450)
                                ? '19px'
                                : '23px',
                          }}
                        >
                          {art.title}
                        </h3>
                      )}

                      {showContent && (
                        <div 
                          className={`whitespace-pre-line space-y-2 ${art.contentFontFamily || 'font-sans'}`}
                          style={{
                            color: art.contentColor || '#334155',
                            fontSize: art.contentFontSize
                              ? `${art.contentFontSize}px`
                              : art.content.length > 650
                                ? '11.5px'
                                : art.content.length > 400
                                  ? '12.5px'
                                  : art.content.length > 220
                                    ? '13.5px'
                                    : '14.5px',
                            lineHeight: art.contentFontSize && art.contentFontSize <= 12
                              ? '1.5'
                              : art.content.length > 400
                                ? '1.55'
                                : '1.65',
                          }}
                        >
                          {art.content}
                        </div>
                      )}

                      {/* Highlighted Stat Badge or CTA */}
                      {(showStat || showCta) && (
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                          {showStat && (
                            <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                              {art.statNumber && (
                                <span className="text-xl font-black text-emerald-800 font-mono">
                                  {art.statNumber}
                                </span>
                              )}
                              {art.statLabel && (
                                <span className="text-xs text-emerald-950 font-bold font-sans">
                                  {art.statLabel}
                                </span>
                              )}
                            </div>
                          )}

                          {showCta && (
                            <button
                              onClick={onGoToCatalog}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-mono flex items-center space-x-1.5 transition shadow-2xs"
                            >
                              <span>{art.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Header Modal (Admin) */}
      {isEditingHeader && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900 font-mono">
                  Редактировать шапку и название страницы
                </h3>
              </div>
              <button
                onClick={() => setIsEditingHeader(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-800 font-mono mb-1">
                  Название кнопки в Меню Навигации (например: "О компании" или "Партнерам")
                </label>
                <input
                  type="text"
                  required
                  value={headerForm.navTitle}
                  onChange={(e) => setHeaderForm({ ...headerForm, navTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-bold text-sm"
                />
              </div>

              {/* Main Title Input & Controls */}
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block font-bold text-blue-950 font-mono text-xs">
                    Главный заголовок страницы (H1)
                  </label>
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setHeaderForm({ ...headerForm, hidePageTitle: !headerForm.hidePageTitle })}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center space-x-1 transition border ${
                        headerForm.hidePageTitle 
                          ? 'bg-rose-50 border-rose-300 text-rose-700' 
                          : 'bg-blue-100 border-blue-300 text-blue-800'
                      }`}
                    >
                      {headerForm.hidePageTitle ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                    <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded font-bold">
                      X: {headerForm.titleOffsetX}px, Y: {headerForm.titleOffsetY}px
                    </span>
                    {(headerForm.titleOffsetX !== 0 || headerForm.titleOffsetY !== 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderForm({ ...headerForm, titleOffsetX: 0, titleOffsetY: 0 });
                          setCurrentTitleOffsetX(0);
                          setCurrentTitleOffsetY(0);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-bold underline"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>
                </div>
                {/* Font Size Slider for Title */}
                <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-blue-200">
                  <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                    Размер текста H1:
                  </span>
                  <input
                    type="range"
                    min="18"
                    max="72"
                    step="1"
                    value={headerForm.titleFontSize || 36}
                    onChange={(e) => setHeaderForm({ ...headerForm, titleFontSize: Number(e.target.value) })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs font-mono font-bold text-blue-700 min-w-[42px] text-right bg-blue-50 px-2 py-0.5 rounded">
                    {headerForm.titleFontSize || 36}px
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={headerForm.pageTitle}
                  onChange={(e) => setHeaderForm({ ...headerForm, pageTitle: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm bg-white ${
                    headerForm.hidePageTitle ? 'border-dashed border-gray-400 opacity-60' : 'border-blue-300'
                  }`}
                />
                <p className="text-[10px] text-blue-700 font-mono">
                  💡 Вы можете свободно перетаскивать главный заголовок мышью прямо на баннере.
                </p>
              </div>

              {/* Subtitle 1 Input & Offset Control */}
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block font-bold text-amber-950 font-mono text-xs">
                    Подзаголовок 1 (Первый текстовый блок на баннере)
                  </label>
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setHeaderForm({ ...headerForm, hideSubtitle1: !headerForm.hideSubtitle1 })}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center space-x-1 transition border ${
                        headerForm.hideSubtitle1 
                          ? 'bg-rose-50 border-rose-300 text-rose-700' 
                          : 'bg-amber-100 border-amber-300 text-amber-900'
                      }`}
                    >
                      {headerForm.hideSubtitle1 ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                    <span className="text-amber-800 bg-amber-100 px-2 py-1 rounded font-bold">
                      X: {headerForm.subtitle1OffsetX}px, Y: {headerForm.subtitle1OffsetY}px
                    </span>
                    {(headerForm.subtitle1OffsetX !== 0 || headerForm.subtitle1OffsetY !== 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderForm({ ...headerForm, subtitle1OffsetX: 0, subtitle1OffsetY: 0 });
                          setCurrentSub1OffsetX(0);
                          setCurrentSub1OffsetY(0);
                        }}
                        className="text-amber-700 hover:text-amber-900 font-bold underline"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                      Размер шрифта:
                    </span>
                    <input
                      type="range"
                      min="12"
                      max="36"
                      step="1"
                      value={headerForm.subtitle1FontSize || 16}
                      onChange={(e) => setHeaderForm({ ...headerForm, subtitle1FontSize: Number(e.target.value) })}
                      className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs font-mono font-bold text-amber-700 min-w-[42px] text-right bg-amber-50 px-1.5 py-0.5 rounded">
                      {headerForm.subtitle1FontSize || 16}px
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                      Ширина рамки:
                    </span>
                    <input
                      type="range"
                      min="200"
                      max="1100"
                      step="25"
                      value={headerForm.subtitle1FrameWidth || 700}
                      onChange={(e) => setHeaderForm({ ...headerForm, subtitle1FrameWidth: Number(e.target.value) })}
                      className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="text-xs font-mono font-bold text-amber-700 min-w-[50px] text-right bg-amber-50 px-1.5 py-0.5 rounded">
                      {headerForm.subtitle1FrameWidth || 700}px
                    </span>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={headerForm.pageSubtitle1}
                  onChange={(e) => setHeaderForm({ ...headerForm, pageSubtitle1: e.target.value })}
                  placeholder="Введите первый подзаголовок страницы..."
                  className={`w-full px-3 py-2 border bg-white rounded-xl focus:ring-2 focus:ring-amber-500 font-sans text-xs ${
                    headerForm.hideSubtitle1 ? 'border-dashed border-gray-400 opacity-60' : 'border-amber-300'
                  }`}
                />
                <p className="text-[10px] text-amber-700 font-mono">
                  💡 На баннере вы можете перетаскивать этот подзаголовок мышью в любое место.
                </p>
              </div>

              {/* Subtitle 2 Input & Controls */}
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block font-bold text-emerald-950 font-mono text-xs">
                    Подзаголовок 2 (Второй текстовый блок на баннере)
                  </label>
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setHeaderForm({ ...headerForm, hideSubtitle2: !headerForm.hideSubtitle2 })}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center space-x-1 transition border ${
                        headerForm.hideSubtitle2 
                          ? 'bg-rose-50 border-rose-300 text-rose-700' 
                          : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      }`}
                    >
                      {headerForm.hideSubtitle2 ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                    <span className="text-emerald-800 bg-emerald-100 px-2 py-1 rounded font-bold">
                      X: {headerForm.subtitle2OffsetX}px, Y: {headerForm.subtitle2OffsetY}px
                    </span>
                    {(headerForm.subtitle2OffsetX !== 0 || headerForm.subtitle2OffsetY !== 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderForm({ ...headerForm, subtitle2OffsetX: 0, subtitle2OffsetY: 0 });
                          setCurrentSub2OffsetX(0);
                          setCurrentSub2OffsetY(0);
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                      Размер шрифта:
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="32"
                      step="1"
                      value={headerForm.subtitle2FontSize || 14}
                      onChange={(e) => setHeaderForm({ ...headerForm, subtitle2FontSize: Number(e.target.value) })}
                      className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-xs font-mono font-bold text-emerald-700 min-w-[42px] text-right bg-emerald-50 px-1.5 py-0.5 rounded">
                      {headerForm.subtitle2FontSize || 14}px
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                      Ширина рамки:
                    </span>
                    <input
                      type="range"
                      min="200"
                      max="1100"
                      step="25"
                      value={headerForm.subtitle2FrameWidth || 700}
                      onChange={(e) => setHeaderForm({ ...headerForm, subtitle2FrameWidth: Number(e.target.value) })}
                      className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-xs font-mono font-bold text-emerald-700 min-w-[50px] text-right bg-emerald-50 px-1.5 py-0.5 rounded">
                      {headerForm.subtitle2FrameWidth || 700}px
                    </span>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={headerForm.pageSubtitle2}
                  onChange={(e) => setHeaderForm({ ...headerForm, pageSubtitle2: e.target.value })}
                  placeholder="Введите второй подзаголовок страницы..."
                  className={`w-full px-3 py-2 border bg-white rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans text-xs ${
                    headerForm.hideSubtitle2 ? 'border-dashed border-gray-400 opacity-60' : 'border-emerald-300'
                  }`}
                />
                <p className="text-[10px] text-emerald-700 font-mono">
                  💡 На баннере вы можете перетаскивать второй подзаголовок мышью отдельно.
                </p>
              </div>

              {/* Subtitle 3 Input & Controls */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block font-bold text-purple-950 font-mono text-xs">
                    Подзаголовок 3 (Третий текстовый блок на баннере)
                  </label>
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setHeaderForm({ ...headerForm, hideSubtitle3: !headerForm.hideSubtitle3 })}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center space-x-1 transition border ${
                        headerForm.hideSubtitle3 
                          ? 'bg-rose-50 border-rose-300 text-rose-700' 
                          : 'bg-purple-100 border-purple-300 text-purple-900'
                      }`}
                    >
                      {headerForm.hideSubtitle3 ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-purple-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                    <span className="text-purple-800 bg-purple-100 px-2 py-1 rounded font-bold">
                      X: {headerForm.subtitle3OffsetX}px, Y: {headerForm.subtitle3OffsetY}px
                    </span>
                    {(headerForm.subtitle3OffsetX !== 0 || headerForm.subtitle3OffsetY !== 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderForm({ ...headerForm, subtitle3OffsetX: 0, subtitle3OffsetY: 0 });
                          setCurrentSub3OffsetX(0);
                          setCurrentSub3OffsetY(0);
                        }}
                        className="text-purple-700 hover:text-purple-900 font-bold underline"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-purple-200">
                    <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                      Размер шрифта:
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="32"
                      step="1"
                      value={headerForm.subtitle3FontSize || 14}
                      onChange={(e) => setHeaderForm({ ...headerForm, subtitle3FontSize: Number(e.target.value) })}
                      className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <span className="text-xs font-mono font-bold text-purple-700 min-w-[42px] text-right bg-purple-50 px-1.5 py-0.5 rounded">
                      {headerForm.subtitle3FontSize || 14}px
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-purple-200">
                    <span className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                      Ширина рамки:
                    </span>
                    <input
                      type="range"
                      min="200"
                      max="1100"
                      step="25"
                      value={headerForm.subtitle3FrameWidth || 700}
                      onChange={(e) => setHeaderForm({ ...headerForm, subtitle3FrameWidth: Number(e.target.value) })}
                      className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <span className="text-xs font-mono font-bold text-purple-700 min-w-[50px] text-right bg-purple-50 px-1.5 py-0.5 rounded">
                      {headerForm.subtitle3FrameWidth || 700}px
                    </span>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={headerForm.pageSubtitle3}
                  onChange={(e) => setHeaderForm({ ...headerForm, pageSubtitle3: e.target.value })}
                  placeholder="Введите третий подзаголовок страницы..."
                  className={`w-full px-3 py-2 border bg-white rounded-xl focus:ring-2 focus:ring-purple-500 font-sans text-xs ${
                    headerForm.hideSubtitle3 ? 'border-dashed border-gray-400 opacity-60' : 'border-purple-300'
                  }`}
                />
                <p className="text-[10px] text-purple-700 font-mono">
                  💡 На баннере вы можете перетаскивать третий подзаголовок мышью отдельно.
                </p>
              </div>

              {/* Frame Size & Layout Controls for Text Container */}
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/90 space-y-3">
                <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
                  <h4 className="font-bold text-sky-950 font-mono text-xs flex items-center space-x-1.5">
                    <Move className="w-4 h-4 text-sky-600" />
                    <span>Размер рамки и отступы для всех текстов</span>
                  </h4>
                  <span className="text-[10px] text-sky-700 font-mono font-bold bg-sky-100 px-2 py-0.5 rounded-md">
                    Общая рамка баннера
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Text Frame Width (max-width) Slider */}
                  <div className="bg-white p-2.5 rounded-xl border border-sky-200 space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="font-bold text-slate-700">Ширина рамки (max-width):</span>
                      <span className="font-bold text-sky-700">{headerForm.textFrameWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="350"
                      max="1400"
                      step="25"
                      value={headerForm.textFrameWidth}
                      onChange={(e) => setHeaderForm({ ...headerForm, textFrameWidth: Number(e.target.value) })}
                      className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>

                  {/* Text Frame Padding Slider */}
                  <div className="bg-white p-2.5 rounded-xl border border-sky-200 space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="font-bold text-slate-700">Отступы рамки (padding):</span>
                      <span className="font-bold text-sky-700">{headerForm.textFramePadding}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="64"
                      step="4"
                      value={headerForm.textFramePadding}
                      onChange={(e) => setHeaderForm({ ...headerForm, textFramePadding: Number(e.target.value) })}
                      className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>

                  {/* Banner Height Slider */}
                  <div className="bg-white p-2.5 rounded-xl border border-sky-200 space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="font-bold text-slate-700">Высота баннера:</span>
                      <span className="font-bold text-sky-700">{headerForm.bannerHeight}px</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="650"
                      step="25"
                      value={headerForm.bannerHeight}
                      onChange={(e) => setHeaderForm({ ...headerForm, bannerHeight: Number(e.target.value) })}
                      className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>

                  {/* Text Frame Background Overlay Opacity Slider */}
                  <div className="bg-white p-2.5 rounded-xl border border-sky-200 space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="font-bold text-slate-700">Фон рамки (плашка):</span>
                      <span className="font-bold text-sky-700">{headerForm.textFrameBgOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="5"
                      value={headerForm.textFrameBgOpacity}
                      onChange={(e) => setHeaderForm({ ...headerForm, textFrameBgOpacity: Number(e.target.value) })}
                      className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 font-mono mb-1">
                    Фотография фонового баннера
                  </label>
                  <div className="space-y-2">
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 shadow-xs">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Загрузить PNG / Картинку с ПК</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setHeaderForm({ ...headerForm, bannerImage: evt.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Или вставьте URL-адрес картинки (https://...)"
                      value={headerForm.bannerImage}
                      onChange={(e) => setHeaderForm({ ...headerForm, bannerImage: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-mono text-xs bg-white"
                    />
                    {headerForm.bannerImage && (
                      <div className="mt-2 flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <img 
                          src={headerForm.bannerImage} 
                          alt="Banner Preview" 
                          style={{ opacity: (headerForm.bannerOpacity ?? 65) / 100 }}
                          className="h-12 w-24 object-cover rounded-lg border border-slate-700" 
                        />
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          Предпросмотр баннера ({headerForm.bannerOpacity ?? 65}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Opacity Slider */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 font-mono">
                      Прозрачность / Непрозрачность баннера:
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {headerForm.bannerOpacity ?? 65}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={headerForm.bannerOpacity ?? 65}
                    onChange={(e) => setHeaderForm({ ...headerForm, bannerOpacity: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>10% (Тёмный/Прозрачный)</span>
                    <span>100% (Максимально яркий)</span>
                  </div>
                </div>
              </div>

              {/* Toggle to Hide All Buttons on Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={headerForm.hideBannerButton}
                    onChange={(e) => setHeaderForm({ ...headerForm, hideBannerButton: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-900 font-mono text-xs">
                    🔘 Убрать все кнопки с баннера (Скрыть «Перейти в каталог»)
                  </span>
                </label>

                {!headerForm.hideBannerButton && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">
                      Текст кнопки на баннере:
                    </label>
                    <input
                      type="text"
                      value={headerForm.bannerButtonText}
                      onChange={(e) => setHeaderForm({ ...headerForm, bannerButtonText: e.target.value })}
                      placeholder="Перейти в Каталог запчастей"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-xs bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingHeader(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl font-mono flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить изменения</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Article Modal (Admin) */}
      {(isAddingArticle || editingArticle) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 font-mono">
                  {editingArticle ? 'Редактировать статью / раздел' : 'Добавить новую статью / раздел'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddingArticle(false);
                  setEditingArticle(null);
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 font-mono">
                      Заголовок статьи / блока *
                    </label>
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, hideTitle: !articleForm.hideTitle })}
                      className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                        articleForm.hideTitle
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      }`}
                    >
                      {articleForm.hideTitle ? (
                        <>
                          <EyeOff className="w-3 h-3 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={articleForm.title || ''}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    placeholder="Например: Условия поставки оптовикам"
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold bg-white ${
                      articleForm.hideTitle ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                    }`}
                  />

                  {/* Title Typography & Color Settings */}
                  <div className="pt-1.5 border-t border-slate-200/70 flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-600 font-bold">Шрифт:</span>
                      <select
                        value={articleForm.titleFontFamily || 'font-mono'}
                        onChange={(e) => setArticleForm({ ...articleForm, titleFontFamily: e.target.value })}
                        className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="font-mono">Моноширинный (Фирменный)</option>
                        <option value="font-sans">Sans (Современный без засечек)</option>
                        <option value="font-serif">Serif (Классический с засечками)</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-600 font-bold">Цвет:</span>
                      <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-lg px-1.5 py-0.5">
                        <input
                          type="color"
                          value={articleForm.titleColor || '#020617'}
                          onChange={(e) => setArticleForm({ ...articleForm, titleColor: e.target.value })}
                          className="w-4 h-4 cursor-pointer rounded border-0 p-0 bg-transparent"
                          title="Выбрать цвет заголовка"
                        />
                        <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">
                          {articleForm.titleColor || '#020617'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {['#020617', '#047857', '#1d4ed8', '#b45309', '#b91c1c'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setArticleForm({ ...articleForm, titleColor: color })}
                            className={`w-3.5 h-3.5 rounded-full border transition ${
                              (articleForm.titleColor || '#020617') === color ? 'ring-2 ring-emerald-500 scale-110' : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={`Цвет ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 font-mono">
                      Категория / Бейдж
                    </label>
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, hideCategoryBadge: !articleForm.hideCategoryBadge })}
                      className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                        articleForm.hideCategoryBadge
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      }`}
                    >
                      {articleForm.hideCategoryBadge ? (
                        <>
                          <EyeOff className="w-3 h-3 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={articleForm.categoryBadge || ''}
                    onChange={(e) => setArticleForm({ ...articleForm, categoryBadge: e.target.value })}
                    placeholder="Логистика, Важно, Сервис"
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white ${
                      articleForm.hideCategoryBadge ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 font-mono">
                    Подзаголовок (краткое вступление)
                  </label>
                  <button
                    type="button"
                    onClick={() => setArticleForm({ ...articleForm, hideSubtitle: !articleForm.hideSubtitle })}
                    className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                      articleForm.hideSubtitle
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}
                  >
                    {articleForm.hideSubtitle ? (
                      <>
                        <EyeOff className="w-3 h-3 text-rose-600" />
                        <span>Скрыт</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>Видим</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={articleForm.subtitle || ''}
                  onChange={(e) => setArticleForm({ ...articleForm, subtitle: e.target.value })}
                  placeholder="Короткий слоган под заголовком"
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white ${
                    articleForm.hideSubtitle ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                  }`}
                />

                {/* Subtitle Typography & Color Settings */}
                <div className="pt-1.5 border-t border-slate-200/70 flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-600 font-bold">Шрифт:</span>
                    <select
                      value={articleForm.subtitleFontFamily || 'font-mono'}
                      onChange={(e) => setArticleForm({ ...articleForm, subtitleFontFamily: e.target.value })}
                      className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="font-mono">Моноширинный</option>
                      <option value="font-sans">Sans (Без засечек)</option>
                      <option value="font-serif">Serif (С засечками)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-600 font-bold">Цвет:</span>
                    <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-lg px-1.5 py-0.5">
                      <input
                        type="color"
                        value={articleForm.subtitleColor || '#047857'}
                        onChange={(e) => setArticleForm({ ...articleForm, subtitleColor: e.target.value })}
                        className="w-4 h-4 cursor-pointer rounded border-0 p-0 bg-transparent"
                        title="Выбрать цвет подзаголовка"
                      />
                      <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">
                        {articleForm.subtitleColor || '#047857'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {['#047857', '#475569', '#2563eb', '#d97706', '#0f172a'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setArticleForm({ ...articleForm, subtitleColor: color })}
                          className={`w-3.5 h-3.5 rounded-full border transition ${
                            (articleForm.subtitleColor || '#047857') === color ? 'ring-2 ring-emerald-500 scale-110' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={`Цвет ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block font-bold text-slate-800 font-mono">
                    Основной текст статьи *
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, hideContent: !articleForm.hideContent })}
                      className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                        articleForm.hideContent
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      }`}
                    >
                      {articleForm.hideContent ? (
                        <>
                          <EyeOff className="w-3 h-3 text-rose-600" />
                          <span>Скрыт</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>Видим</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Typography Controls Bar: Font Family, Font Size, Font Color */}
                <div className="p-2 bg-white rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  {/* Font Family */}
                  <div>
                    <span className="block text-slate-600 font-bold mb-1">Шрифт текста:</span>
                    <select
                      value={articleForm.contentFontFamily || 'font-sans'}
                      onChange={(e) => setArticleForm({ ...articleForm, contentFontFamily: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="font-sans">Sans (Современный без засечек)</option>
                      <option value="font-mono">Mono (Моноширинный технический)</option>
                      <option value="font-serif">Serif (Классический с засечками)</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <span className="block text-slate-600 font-bold mb-1">Размер шрифта:</span>
                    <select
                      value={articleForm.contentFontSize ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        setArticleForm({ ...articleForm, contentFontSize: val });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Авто (по объему)</option>
                      <option value="11">11 px (Компактный лонгрид)</option>
                      <option value="12">12 px (Мелкий)</option>
                      <option value="13">13 px (Средне-мелкий)</option>
                      <option value="14">14 px (Стандартный)</option>
                      <option value="15">15 px (Крупный)</option>
                      <option value="16">16 px (Очень крупный)</option>
                    </select>
                  </div>

                  {/* Font Color */}
                  <div>
                    <span className="block text-slate-600 font-bold mb-1">Цвет текста:</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="flex items-center space-x-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 flex-1">
                        <input
                          type="color"
                          value={articleForm.contentColor || '#334155'}
                          onChange={(e) => setArticleForm({ ...articleForm, contentColor: e.target.value })}
                          className="w-4 h-4 cursor-pointer rounded border-0 p-0 bg-transparent"
                          title="Выбрать цвет текста"
                        />
                        <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">
                          {articleForm.contentColor || '#334155'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-0.5">
                        {['#334155', '#0f172a', '#4b5563', '#065f46', '#1e3a8a'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setArticleForm({ ...articleForm, contentColor: color })}
                            className={`w-3.5 h-3.5 rounded-full border transition ${
                              (articleForm.contentColor || '#334155') === color ? 'ring-2 ring-emerald-500 scale-110' : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={`Цвет ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <textarea
                  rows={6}
                  required
                  value={articleForm.content || ''}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Подробное описание, условия, абзацы текста..."
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 leading-relaxed bg-white ${
                    articleForm.hideContent ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                  } ${articleForm.contentFontFamily || 'font-sans'}`}
                  style={{
                    color: articleForm.contentColor || '#334155',
                  }}
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Символов: {(articleForm.content || '').length}</span>
                  <span>
                    {!articleForm.contentFontSize && (
                      (articleForm.content || '').length > 650
                        ? 'Авто-шрифт: 11.5px (компактный)'
                        : (articleForm.content || '').length > 400
                          ? 'Авто-шрифт: 12.5px'
                          : (articleForm.content || '').length > 220
                            ? 'Авто-шрифт: 13.5px'
                            : 'Авто-шрифт: 14.5px (стандарт)'
                    )}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <label className="block font-bold text-slate-800 font-mono">
                      Фотография / Иллюстрация статьи
                    </label>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                      1:1 Квадрат (без обрезки)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArticleForm({ ...articleForm, hideImage: !articleForm.hideImage })}
                    className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                      articleForm.hideImage
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}
                  >
                    {articleForm.hideImage ? (
                      <>
                        <EyeOff className="w-3 h-3 text-rose-600" />
                        <span>Скрыта</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>Видима</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center space-x-2 shadow-xs">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Загрузить изображение с компьютера</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setArticleForm({ ...articleForm, imageUrl: evt.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {articleForm.imageUrl && (
                      <div className="w-10 h-10 aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <img
                          src={articleForm.imageUrl}
                          alt="Превью"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <input
                    type="url"
                    value={articleForm.imageUrl || ''}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="Или вставьте URL-адрес картинки (https://...)"
                    className={`w-full px-3 py-1.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs font-mono bg-white ${
                      articleForm.hideImage ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Stat Metric */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 font-mono">
                    Блок цифровой метрики и описания
                  </label>
                  <button
                    type="button"
                    onClick={() => setArticleForm({ ...articleForm, hideStat: !articleForm.hideStat })}
                    className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                      articleForm.hideStat
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}
                  >
                    {articleForm.hideStat ? (
                      <>
                        <EyeOff className="w-3 h-3 text-rose-600" />
                        <span>Скрыта</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>Видима</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">
                      Цифра / Показатель (например: "15+ лет")
                    </label>
                    <input
                      type="text"
                      value={articleForm.statNumber || ''}
                      onChange={(e) => setArticleForm({ ...articleForm, statNumber: e.target.value })}
                      placeholder="24 месяца, 12 000 SKU"
                      className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono bg-white ${
                        articleForm.hideStat ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">
                      Подпись к метрике
                    </label>
                    <input
                      type="text"
                      value={articleForm.statLabel || ''}
                      onChange={(e) => setArticleForm({ ...articleForm, statLabel: e.target.value })}
                      placeholder="Заводская гарантия на запчасти"
                      className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white ${
                        articleForm.hideStat ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button CTA */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 font-mono">
                    Кнопка действия в статье (CTA)
                  </label>
                  <button
                    type="button"
                    onClick={() => setArticleForm({ ...articleForm, hideCtaButton: !articleForm.hideCtaButton })}
                    className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold flex items-center space-x-1 transition border ${
                      articleForm.hideCtaButton
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}
                  >
                    {articleForm.hideCtaButton ? (
                      <>
                        <EyeOff className="w-3 h-3 text-rose-600" />
                        <span>Скрыта</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>Видима</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={articleForm.ctaText || ''}
                  onChange={(e) => setArticleForm({ ...articleForm, ctaText: e.target.value })}
                  placeholder="Например: Перейти в каталог или Запросить прайс"
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono bg-white ${
                    articleForm.hideCtaButton ? 'border-dashed border-gray-400 opacity-60' : 'border-gray-300'
                  }`}
                />
              </div>

              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingArticle(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl font-mono flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить статью</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

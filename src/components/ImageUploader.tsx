import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2, Link } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'rivauto/products' | 'rivauto/brands' | 'rivauto/cms' | 'rivauto';
  label?: string;
  placeholder?: string;
  className?: string;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder = 'rivauto',
  label = 'Изображение',
  placeholder = 'или вставьте URL картинки...',
  className = '',
}) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate size (15 MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Файл слишком большой. Максимум 15 MB.');
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setUploadProgress(0);
    setErrorMsg('');

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 85));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Data,
          folder: folder,
        }),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success && data.url) {
        onChange(data.url);
        setUploadState('success');
        setTimeout(() => setUploadState('idle'), 3000);
      } else {
        throw new Error(data.error || 'Ошибка загрузки');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ошибка загрузки. Попробуйте снова.');
      setUploadState('error');
      setTimeout(() => setUploadState('idle'), 5000);
    }
  }, [folder, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleUrlApply = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadState('idle');
    setErrorMsg('');
  };

  const isUploading = uploadState === 'uploading';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted, #9ca3af)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      {/* Drop Zone / Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          position: 'relative',
          border: `2px dashed ${isDragOver ? '#6366f1' : uploadState === 'error' ? '#ef4444' : uploadState === 'success' ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: '12px',
          padding: '20px',
          cursor: isUploading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          background: isDragOver ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          minHeight: '100px',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Preview image if URL exists */}
        {value && !isUploading && (
          <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', maxHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
            <img
              src={value}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: '6px' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Upload progress */}
        {isUploading && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Loader2 size={32} style={{ color: '#6366f1', margin: '0 auto 10px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '8px' }}>Загружаю в облако... {uploadProgress}%</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', height: '100%', width: `${uploadProgress}%`, transition: 'width 0.2s ease', borderRadius: '999px' }} />
            </div>
          </div>
        )}

        {/* Success state */}
        {uploadState === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.85rem' }}>
            <CheckCircle2 size={18} />
            <span>Загружено успешно!</span>
          </div>
        )}

        {/* Error state */}
        {uploadState === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Idle / default state */}
        {!value && !isUploading && uploadState !== 'success' && uploadState !== 'error' && (
          <>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDragOver ? <ImageIcon size={22} style={{ color: '#6366f1' }} /> : <Upload size={22} style={{ color: '#6366f1' }} />}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
                {isDragOver ? 'Отпустите файл' : 'Перетащите или нажмите для загрузки'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>JPG, PNG, WebP, AVIF — до 15 MB</div>
            </div>
          </>
        )}

        {/* Show "change photo" hint if image exists */}
        {value && !isUploading && uploadState !== 'success' && (
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Нажмите или перетащите чтобы заменить</div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* URL input toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setShowUrlInput(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
        >
          <Link size={12} />
          {showUrlInput ? 'Скрыть поле URL' : 'Или вставить URL'}
        </button>
        {value && (
          <span style={{ fontSize: '0.72rem', color: '#4ade80', marginLeft: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
            ✓ {value.replace(/^https?:\/\//, '').substring(0, 40)}...
          </span>
        )}
      </div>

      {showUrlInput && (
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="url"
            value={urlInputValue}
            onChange={e => setUrlInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlApply()}
            placeholder={placeholder}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 12px', color: '#e2e8f0', fontSize: '0.8rem', outline: 'none' }}
          />
          <button
            type="button"
            onClick={handleUrlApply}
            style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            OK
          </button>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

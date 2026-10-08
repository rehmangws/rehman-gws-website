import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface BrandLogoProps {
  size?: 'header' | 'footer' | 'card';
  showText?: boolean;
  showUploadHelper?: boolean;
  onLogoClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'header',
  showText = true,
  showUploadHelper = false,
  onLogoClick,
}) => {
  const [logoExists, setLogoExists] = useState<boolean>(true);
  const [cacheBuster, setCacheBuster] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const handleLogoUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setLogoExists(true);
      setCacheBuster(customEvent.detail || `?v=${Date.now()}`);
    };
    window.addEventListener('rehman-logo-updated', handleLogoUpdated);
    return () => window.removeEventListener('rehman-logo-updated', handleLogoUpdated);
  }, []);

  const handleUploadExactPng = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await fetch('/api/brand/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl }),
        });
        if (res.ok) {
          const v = `?v=${Date.now()}`;
          setLogoExists(true);
          setCacheBuster(v);
          window.dispatchEvent(new CustomEvent('rehman-logo-updated', { detail: v }));
        }
      } catch (err) {
        console.error('Failed to store logo file:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Responsive dimensions while strictly locking aspect ratio & object-fit: contain
  const imgSizeClasses =
    size === 'header'
      ? 'h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0'
      : size === 'footer'
      ? 'h-16 sm:h-20 w-auto object-contain shrink-0'
      : 'h-14 sm:h-16 w-auto object-contain shrink-0';

  const brandContent = (
    <>
      {logoExists && (
        <img
          src={`/assets/rehman-gws-logo.png${cacheBuster}`}
          alt="REHMAN GWS - Global Work Solutions"
          style={{ objectFit: 'contain' }}
          onError={() => setLogoExists(false)}
          className={imgSizeClasses}
        />
      )}

      {showText && (
        <div className="flex flex-col justify-center text-left">
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-tight whitespace-nowrap">
            REHMAN GWS
          </span>
          {size !== 'header' && (
            <span className="text-xs font-medium text-amber-400/90 leading-tight whitespace-nowrap mt-0.5">
              Global Work Solutions
            </span>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="inline-flex items-center gap-3 shrink-0">
      {onLogoClick ? (
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onLogoClick();
          }}
          className="inline-flex items-center gap-3 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
        >
          {brandContent}
        </a>
      ) : (
        <div className="inline-flex items-center gap-3 whitespace-nowrap shrink-0">
          {brandContent}
        </div>
      )}

      {!logoExists && showUploadHelper && (
        <label
          title="Select your original REHMAN GWS PNG logo file to save directly to /assets/rehman-gws-logo.png"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-medium text-amber-300 cursor-pointer whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span>{uploading ? 'Saving PNG...' : 'Upload Logo PNG'}</span>
          <input
            type="file"
            accept="image/png,image/*"
            onChange={handleUploadExactPng}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

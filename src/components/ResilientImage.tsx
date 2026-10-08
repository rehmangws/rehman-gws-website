import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle = 'REHMAN GWS',
  fallbackSubtitle = 'Global Work Solutions',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0B0F19] border border-white/10 p-6 text-center ${className}`}
      >
        <Globe className="w-10 h-10 text-blue-400/80 mb-3" />
        <span className="font-display text-base font-bold text-white">{fallbackTitle}</span>
        <span className="text-xs text-slate-400 mt-1">{fallbackSubtitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

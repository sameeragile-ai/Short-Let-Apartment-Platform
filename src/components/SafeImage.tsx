import React, { useState } from 'react';
import { getInitials } from '../lib/format';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#134E4A] via-[#1E3A3A] to-[#B45309]/80 text-[#FAF8F5] select-none ${className}`}
        aria-label={alt}
      >
        <span className="font-display text-lg font-semibold tracking-wide">
          {getInitials(fallbackLabel || alt || 'IF')}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};

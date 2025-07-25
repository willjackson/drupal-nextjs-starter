'use client';

import { useState } from 'react';
import Image from 'next/image';

// Simple hash function for deterministic seeds
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 1000 + 1; // Keep within 1-1000 range
}

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSeed?: number;
  fallbackKey?: string; // For deterministic hash-based seeds
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackSeed = 1,
  fallbackKey,
  width = 1200,
  height = 600,
  fill = false,
  priority
}: ImageWithFallbackProps) {
  // Ensure alt text is never undefined
  const altText = alt || 'Image';
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Use deterministic hash if key provided, otherwise use fallbackSeed
  const seedValue = fallbackKey ? simpleHash(fallbackKey) : fallbackSeed;
  const fallbackSrc = `https://picsum.photos/id/${seedValue}/${width}/${height}`;

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // If no src provided, use fallback immediately
  const finalSrc = imgSrc || fallbackSrc;

  // Auto-determine priority if not explicitly set
  const shouldPrioritize = priority !== undefined ? priority : (width > 1000 || fill);

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={altText}
        fill
        className={className}
        onError={handleError}
        priority={shouldPrioritize}
        unoptimized={finalSrc.includes('picsum.photos')} // Picsum already serves optimized images
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={altText}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={shouldPrioritize}
      unoptimized={finalSrc.includes('picsum.photos')} // Picsum already serves optimized images
    />
  );
}
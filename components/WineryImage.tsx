'use client';

import Image from 'next/image';
import { useState } from 'react';

interface WineryImageProps {
  src: string;
  alt: string;
  title: string;
}

export default function WineryImage({ src, alt, title }: WineryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      priority
      onError={() => {
        setImgSrc('https://via.placeholder.com/800x400?text=No+Image');
      }}
    />
  );
}

import { useState, useEffect } from 'react';

export function useImageLoader(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = src;
  }, [src]);

  return image;
}

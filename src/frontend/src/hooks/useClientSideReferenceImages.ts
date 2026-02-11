import { useState } from 'react';

interface ReferenceImage {
  id: string;
  file: File;
  preview: string;
}

export function useClientSideReferenceImages() {
  const [images, setImages] = useState<ReferenceImage[]>([]);

  const addImage = (file: File) => {
    const id = `${Date.now()}-${Math.random()}`;
    const preview = URL.createObjectURL(file);
    
    setImages(prev => [...prev, { id, file, preview }]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  return {
    images,
    addImage,
    removeImage,
    clearImages,
  };
}

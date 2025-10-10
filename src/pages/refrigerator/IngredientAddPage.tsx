import React, { useState } from 'react';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';

export default function IngredientPhotoAddPage() {
  const [ingredients, setIngredients] = useState<IngredientEditData[]>([
    {
      id: 1,
      name: '당근',
      image: 'https://placehold.co/245x163',
      date: '2025.11.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 2,
      name: '양파',
      image: 'https://placehold.co/245x163',
      date: '2025.10.15',
      quantity: '2',
      unit: 'EA',
    },
    {
      id: 3,
      name: '돼지고기',
      image: 'https://placehold.co/245x163',
      date: '2025.12.01',
      quantity: '500',
      unit: 'g',
    },
  ]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);

  const handleUpdate = (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSelectPhoto = (file: File) => {
    const newUrl = URL.createObjectURL(file);
    if (!selectedIngredientId) return;
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === selectedIngredientId ? { ...item, image: newUrl } : item,
      ),
    );
  };

  const handleOpenImageOptions = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsImageOptionOpen(true);
  };

  const handleLaunchCamera = () => {
    setIsImageOptionOpen(false);
    setIsCameraOpen(true);
  };

  const handleLaunchLibrary = () => {
    setIsImageOptionOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) handleSelectPhoto(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white mt-[-2rem] px-6 pb-32">
      <div className="w-full max-w-[600px] mt-8">
        <IngredientEditList
          ingredients={ingredients}
          onUpdate={handleUpdate}
          onOpenCamera={handleOpenImageOptions}
          onSelectPhoto={handleSelectPhoto}
        />
      </div>

      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} />}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white border-t border-gray-200 py-4">
        <button className="w-[90%] max-w-[600px] bg-[#FF8800] text-white py-3 rounded-lg font-medium">
          저장하기
        </button>
      </div>
    </div>
  );
}

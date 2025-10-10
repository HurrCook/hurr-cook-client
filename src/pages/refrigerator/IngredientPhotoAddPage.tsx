import React, { useState } from 'react';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import CameraModal from '@/components/header/CameraModal';

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
  ]);
  const [isCameraOn, setIsCameraOn] = useState(false);

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
    setIngredients((prev) =>
      prev.map((item, i) => (i === 0 ? { ...item, image: newUrl } : item)),
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white mt-[-2rem] px-6 pb-32">
      <div className="w-full max-w-[600px] mt-8">
        <IngredientEditList
          ingredients={ingredients}
          onUpdate={handleUpdate}
          onOpenCamera={() => setIsCameraOn(true)}
          onSelectPhoto={handleSelectPhoto}
        />
      </div>

      {isCameraOn && <CameraModal onClose={() => setIsCameraOn(false)} />}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white border-t border-gray-200 py-4">
        <button className="w-[90%] max-w-[600px] bg-[#FF8800] text-white py-3 rounded-lg font-medium">
          저장하기
        </button>
      </div>
    </div>
  );
}

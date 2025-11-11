import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import api from '@/lib/axios';

export default function IngredientPhotoAddPage() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<IngredientEditData[]>([
    { id: 1, name: '', image: '', date: '', quantity: '', unit: '' },
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

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now(), name: '', image: '', date: '', quantity: '', unit: '' },
    ]);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSelectPhoto = async (file: File) => {
    const base64 = await fileToBase64(file);
    if (!selectedIngredientId) return;
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === selectedIngredientId ? { ...item, image: base64 } : item,
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
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) await handleSelectPhoto(file);
    };
    input.click();
  };

  const handleSaveIngredients = async () => {
    try {
      const payload = {
        ingredients: ingredients.map((item) => ({
          name: item.name.trim(),
          amount: Number(item.quantity) || 0,
          unit: item.unit.toUpperCase(),
          expireDate: item.date
            ? new Date(item.date).toISOString()
            : new Date().toISOString(),
          image: item.image || null,
        })),
      };

      const res = await api.post('/ingredients', payload);
      const { success, message } = res.data;

      console.log(
        '[IngredientPhotoAddPage] POST /ingredients payload:',
        payload,
      );
      console.log('[IngredientPhotoAddPage] response:', res.data);

      if (success) {
        console.log('재료 등록 성공:', message);
        navigate('/refrigerator');
      } else {
        console.log('재료 등록 실패:', message || '알 수 없는 오류');
      }
    } catch (err) {
      console.error('재료 등록 실패:', err);
    }
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
        <div className="flex justify-center mt-6">
          <button
            onClick={handleAddIngredient}
            className="w-full border-2 border-dashed border-[#FF8800] text-[#FF8800]
                       rounded-lg py-3 font-medium text-sm bg-transparent
                       hover:bg-[#FFF8F2] hover:scale-[1.02] active:scale-[0.98]
                       transition-all"
          >
            + 재료 추가하기
          </button>
        </div>
      </div>

      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} />}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4">
        <button
          onClick={handleSaveIngredients}
          className="w-[90%] max-w-[600px] bg-[#FF8800] text-white py-3 rounded-lg font-medium hover:bg-[#ff7b00] active:scale-[0.98] transition-all shadow-md"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

// src/pages/refrigerator/IngredientPhotoAddPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

export default function IngredientPhotoAddPage() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<IngredientEditData[]>([
    { id: 1, name: '', image: '', date: '', quantity: '', unit: 'EA' },
  ]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);
  const [loading, setLoading] = useState(false);

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
      {
        id: Date.now(),
        name: '',
        image: '',
        date: '',
        quantity: '',
        unit: 'EA',
      },
    ]);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
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
    setTimeout(() => setIsCameraOpen(true), 100);
  };

  const handleLaunchLibrary = () => {
    setIsImageOptionOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event | React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files?.[0];
      if (file) await handleSelectPhoto(file);
    };
    input.click();
  };

  const handleSaveIngredients = async () => {
    try {
      setLoading(true);

      const payload = {
        ingredients: ingredients.map((item) => ({
          name: item.name.trim(),
          amount: Number(item.quantity) || 0,
          unit: item.unit.toUpperCase(),
          expireDate: item.date
            ? new Date(item.date).toISOString()
            : new Date().toISOString(),
          imageUrl: item.image.startsWith('data:image')
            ? item.image.split(',')[1]
            : item.image || null,
        })),
      };

      const res = await api.post('/ingredients', payload);
      if (res.data.success) {
        navigate('/refrigerator', { state: { refresh: true } });
      } else {
        navigate('/fail');
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[POST /ingredients 오류]', err.response.data);
      navigate('/fail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-6 pb-32">
      <div className="w-full max-w-[600px] mt-8">
        {ingredients.length > 0 ? (
          <IngredientEditList
            ingredients={ingredients}
            onUpdate={handleUpdate}
            onOpenCamera={handleOpenImageOptions}
            onSelectPhoto={handleSelectPhoto}
          />
        ) : (
          <p className="text-center text-gray-500 mt-10">
            등록된 재료가 없습니다. + 버튼으로 추가하세요.
          </p>
        )}

        <div className="flex justify-center mt-6">
          <button
            type="button"
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

      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={(dataUrl: string) => {
            if (selectedIngredientId && dataUrl) {
              setIngredients((prev) =>
                prev.map((item) =>
                  item.id === selectedIngredientId
                    ? { ...item, image: dataUrl }
                    : item,
                ),
              );
            }
            setIsCameraOpen(false);
          }}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4 shadow-inner">
        <button
          type="button"
          onClick={handleSaveIngredients}
          disabled={loading}
          className={`w-[90%] max-w-[600px] py-3 rounded-lg font-medium transition-all shadow-md 
            ${
              loading
                ? 'bg-[#FFD3A5] text-white cursor-not-allowed'
                : 'bg-[#FF8800] text-white hover:bg-[#ff7b00] active:scale-[0.98]'
            }`}
        >
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
}

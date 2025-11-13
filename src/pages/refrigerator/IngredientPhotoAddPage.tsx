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

  // ✅ 재료 항목 업데이트
  const handleUpdate = (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // ✅ 재료 추가
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

  // ✅ 파일을 base64로 변환
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ✅ 갤러리에서 이미지 선택
  const handleSelectPhoto = async (file: File) => {
    const base64 = await fileToBase64(file);
    if (!selectedIngredientId) return;

    console.log('📸 선택된 이미지(base64 앞 80자):', base64.slice(0, 80));

    setIngredients((prev) =>
      prev.map((item) =>
        item.id === selectedIngredientId ? { ...item, image: base64 } : item,
      ),
    );
  };

  // ✅ 이미지 옵션 모달 열기
  const handleOpenImageOptions = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsImageOptionOpen(true);
  };

  // ✅ 카메라 열기
  const handleLaunchCamera = () => {
    setIsImageOptionOpen(false);
    setTimeout(() => setIsCameraOpen(true), 100);
  };

  // ✅ 앨범 열기
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

  // ✅ 저장 (prefix 제거 + 로그 추가)
  const handleSaveIngredients = async () => {
    try {
      setLoading(true);
      console.log('📝 저장 전 ingredients:', ingredients);

      const payload = {
        ingredients: ingredients.map((item, idx) => {
          let imageBase64: string | null = null;

          // data:image 형식이면 prefix 제거
          if (item.image && item.image.startsWith('data:image')) {
            imageBase64 = item.image.split(',')[1];
          } else if (item.image) {
            imageBase64 = item.image;
          }

          // 💡 날짜 유효성 검사 및 변환 강화
          let expireDateIso: string;

          if (item.date) {
            // YYYY.MM.DD 또는 YYYY/MM/DD를 YYYY-MM-DD 형식으로 변환
            const standardDateString = item.date.replace(/[./]/g, '-');
            const dateObj = new Date(standardDateString);

            if (isNaN(dateObj.getTime())) {
              // ✅ Invalid Date인 경우: 오늘 날짜로 대체
              console.warn(
                `[Save] Invalid Date detected for: ${item.name} (${item.date}). Using today's date.`,
              );
              expireDateIso = new Date().toISOString();
            } else {
              // ✅ 유효한 Date인 경우: ISOString으로 변환 (백엔드 형식 충족)
              expireDateIso = dateObj.toISOString();
            }
          } else {
            // 날짜 입력이 없으면 오늘 날짜 사용
            expireDateIso = new Date().toISOString();
          }
          // ------------------------------------

          console.log(
            `📦 [${idx}] imageBase64(앞 80자):`,
            imageBase64?.slice(0, 80),
          );

          return {
            name: item.name.trim(),
            amount: Number(item.quantity) || 0,
            unit: item.unit.toUpperCase(),
            expireDate: expireDateIso, // ✅ 안전하게 처리된 날짜 사용
            imageUrl: imageBase64 || null,
          };
        }),
      };

      console.log('📤 최종 전송 payload:', payload);

      const res = await api.post('/api/ingredients', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: 15 * 1024 * 1024,
      });

      console.log('✅ /ingredients 응답:', res.data);

      if (res.data.success) {
        console.log('🎉 저장 성공 → 냉장고 페이지 이동');
        navigate('/refrigerator', { state: { refresh: true } });
      } else {
        console.warn('⚠️ 저장 실패:', res.data);
        navigate('/fail');
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error(
          '❌ [POST /ingredients 오류]',
          err.response.status,
          err.response.data,
        );
      else console.error('❌ 요청 실패:', err.message);
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

      {/* 이미지 옵션 모달 */}
      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 카메라 모달 */}
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={(dataUrl: string) => {
            console.log(
              '📷 카메라 캡처 base64(앞 80자):',
              dataUrl.slice(0, 80),
            );

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

      {/* 저장 버튼 */}
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

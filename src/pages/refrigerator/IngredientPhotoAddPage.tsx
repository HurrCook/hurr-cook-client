// src/pages/refrigerator/IngredientPhotoAddPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import CameraModal from '@/components/header/CameraModal';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

type OcrItem = {
  name: string;
  date?: string;
  quantity?: string;
  unit?: 'EA' | 'g' | 'ml';
  imageUrl?: string; // 서버 응답은 prefix 없는 base64만 전달
};

interface LocationState {
  base64_images?: string[];
  detected?: OcrItem[];
}

export default function IngredientPhotoAddPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  const [ingredients, setIngredients] = useState<IngredientEditData[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const base64Images = useMemo(
    () => location?.state?.base64_images ?? [],
    [location?.state],
  );
  const detectedItems = useMemo(
    () => location?.state?.detected ?? [],
    [location?.state],
  );

  // ✅ 감지 결과 매핑
  useEffect(() => {
    console.log('📥 location.state:', location.state);

    if (
      (!base64Images || base64Images.length === 0) &&
      (!detectedItems || detectedItems.length === 0)
    ) {
      navigate('/fail');
      return;
    }

    if (detectedItems && detectedItems.length > 0) {
      const mapped: IngredientEditData[] = detectedItems.map((it, idx) => {
        // 서버에서 받은 imageUrl이 없으면 base64 이미지로 대체
        const rawBase64 = it.imageUrl || base64Images[idx] || '';
        const imgSrc = rawBase64.startsWith('data:image')
          ? rawBase64
          : rawBase64
            ? `data:image/png;base64,${rawBase64}`
            : 'https://placehold.co/245x163';

        return {
          id: idx + 1,
          name: it.name || '이름없음',
          image: imgSrc, // 화면 표시용 (prefix 포함)
          imageUrl: rawBase64.startsWith('data:image')
            ? rawBase64.split(',')[1]
            : rawBase64, // 서버 전송용 (prefix 제거)
          date: it.date || '',
          quantity: it.quantity || '1',
          unit: it.unit || 'EA',
        };
      });

      console.log('🧩 매핑된 OCR 데이터:', mapped);
      setIngredients(mapped);
    } else if (base64Images && base64Images.length > 0) {
      void runOCR(base64Images);
    }
  }, [detectedItems, base64Images, navigate]);

  // ✅ OCR 요청 (서버는 prefix 없는 base64만 받음)
  const runOCR = async (images: string[]) => {
    console.log('🚀 OCR 요청 시작');
    setLoading(true);
    try {
      const strippedImages = images.map((img) =>
        img.startsWith('data:image') ? img.split(',')[1] : img,
      );

      const { data } = await api.post('/ingredients/ocr', {
        base64_images: strippedImages,
      });

      console.log('✅ OCR 응답:', data);
      const list: OcrItem[] = data?.items ?? [];

      const mapped: IngredientEditData[] = list.map((it, idx) => {
        const raw = it.imageUrl || strippedImages[idx];
        return {
          id: idx + 1,
          name: it.name || '이름없음',
          image: `data:image/png;base64,${raw}`,
          imageUrl: raw,
          date: it.date || '',
          quantity: it.quantity || '1',
          unit: it.unit || 'EA',
        };
      });

      console.log('🧩 OCR 매핑 결과:', mapped);
      setIngredients(mapped);
    } catch (error) {
      const err = error as AxiosError;
      console.error('❌ OCR 실패:', err.response?.data || err.message);
      navigate('/fail');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 이미지 직접 선택
  const handleSelectPhoto = (file: File) => {
    console.log('📸 선택된 파일:', file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const stripped = base64.split(',')[1];
      console.log('📸 선택 이미지 base64(앞 80자):', stripped.slice(0, 80));

      setIngredients((prev) =>
        prev.map((item, i) =>
          i === 0 ? { ...item, image: base64, imageUrl: stripped } : item,
        ),
      );
    };
    reader.onerror = () => navigate('/fail');
    reader.readAsDataURL(file);
  };

  // ✅ 저장 시 prefix 제거 보정 포함
  const handleSaveIngredients = async () => {
    console.log('📝 저장 전 ingredients:', ingredients);

    const payload = {
      ingredients: ingredients.map((i, idx) => {
        // imageUrl이 비었을 경우 image에서 base64 추출
        let finalBase64: string | null = null;

        if (i.imageUrl && i.imageUrl.trim().length > 0) {
          finalBase64 = i.imageUrl;
        } else if (i.image && i.image.startsWith('data:image')) {
          finalBase64 = i.image.split(',')[1];
        }

        console.log(
          `📦 [${idx}] 최종 전송 imageUrl(앞 80자):`,
          finalBase64?.slice(0, 80),
        );

        return {
          name: i.name.trim(),
          amount: Number(i.quantity) || 0,
          unit: i.unit.toUpperCase(),
          expireDate: i.date
            ? new Date(i.date).toISOString()
            : new Date().toISOString(),
          imageUrl: finalBase64 || null,
        };
      }),
    };

    console.log('📤 최종 전송 payload:', payload);

    try {
      const res = await api.post('/ingredients', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: 15 * 1024 * 1024,
      });
      console.log('✅ /ingredients 응답:', res.data);

      if (res.data?.success) {
        console.log('🎉 저장 성공 → 냉장고 페이지 이동');
        navigate('/refrigerator', { state: { refresh: true } });
      } else {
        console.warn('⚠️ 저장 실패:', res.data);
        navigate('/fail');
      }
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      navigate('/fail');
    }
  };

  // ✅ 렌더링 시 실제 이미지 확인
  useEffect(() => {
    console.log(
      '🖼️ 렌더링 시 이미지 리스트:',
      ingredients.map((i) => i.image),
    );
  }, [ingredients]);

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <main className="flex-1 overflow-y-auto px-6 mt-[-2rem] pb-40">
        <div className="w-full max-w-[600px] mx-auto mt-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              분석 중...
            </div>
          ) : (
            <IngredientEditList
              ingredients={ingredients}
              onUpdate={(id, field, value) =>
                setIngredients((prev) =>
                  prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
                )
              }
              onOpenCamera={() => setIsCameraOn(true)}
              onSelectPhoto={handleSelectPhoto}
            />
          )}
        </div>
      </main>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4 shadow-inner">
        <button
          type="button"
          onClick={handleSaveIngredients}
          disabled={loading}
          className={`w-[90%] max-w-[600px] py-3 rounded-lg font-medium transition-all shadow-md ${
            loading
              ? 'bg-[#FFD3A5] text-white cursor-not-allowed'
              : 'bg-[#FF8800] text-white hover:bg-[#ff7b00]'
          }`}
        >
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {/* 카메라 모달 */}
      {isCameraOn && (
        <CameraModal
          onClose={() => setIsCameraOn(false)}
          onCaptured={(images: string[]) => {
            const base64 = images[0];
            const stripped = base64.split(',')[1];
            console.log(
              '📷 CameraModal 캡처 base64(앞 80자):',
              stripped.slice(0, 80),
            );

            setIngredients((prev) =>
              prev.map((item, i) =>
                i === 0 ? { ...item, image: base64, imageUrl: stripped } : item,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

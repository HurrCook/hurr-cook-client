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
  imageUrl?: string;
};

interface LocationState {
  base64_images?: string[];
  detected?: OcrItem[];
  source?: string;
}

interface OcrResponse {
  items: {
    name?: string;
    date?: string;
    quantity?: string;
    unit?: 'EA' | 'g' | 'ml';
    image?: string;
  }[];
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

  /** 이미지나 감지된 데이터가 없으면 실패 페이지 이동 */
  useEffect(() => {
    if (
      (!base64Images || base64Images.length === 0) &&
      (!detectedItems || detectedItems.length === 0)
    ) {
      navigate('/fail');
    }
  }, [base64Images, detectedItems, navigate]);

  /** OCR 결과 또는 감지된 데이터 매핑 */
  useEffect(() => {
    if (detectedItems && detectedItems.length > 0) {
      const mapped: IngredientEditData[] = detectedItems.map(
        (it: OcrItem, idx: number) => ({
          id: idx + 1,
          name: it.name || '이름없음',
          image: it.imageUrl
            ? `data:image/jpeg;base64,${it.imageUrl}`
            : 'https://placehold.co/245x163',
          date: it.date || '',
          quantity: it.quantity || '1',
          unit: it.unit || 'EA',
        }),
      );
      setIngredients(mapped);
    } else if (base64Images && base64Images.length > 0) {
      void runOCR(base64Images);
    }
  }, [detectedItems, base64Images]);

  /** OCR 실행 */
  const runOCR = async (images: string[]) => {
    if (!images || images.length === 0) {
      navigate('/fail');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<OcrResponse>('/ingredients/ocr', {
        base64_images: images,
      });

      const list: OcrItem[] = (data?.items ?? []).map((it) => ({
        name: String(it?.name ?? ''),
        date: it?.date ? String(it.date) : '',
        quantity: it?.quantity ? String(it.quantity) : '1',
        unit: it?.unit ?? 'EA',
        imageUrl: it?.image ?? '',
      }));

      const mapped: IngredientEditData[] = list.map((it, idx) => ({
        id: idx + 1,
        name: it.name,
        image: it.imageUrl
          ? `data:image/png;base64,${it.imageUrl}`
          : 'https://placehold.co/245x163',
        date: it.date || '',
        quantity: it.quantity || '1',
        unit: it.unit || 'EA',
      }));

      if (!mapped.length) {
        navigate('/fail');
        return;
      }

      setIngredients(mapped);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[OCR 요청 오류]', err.response.data || err.message);
      navigate('/fail');
    } finally {
      setLoading(false);
    }
  };

  /** 수정 핸들러 */
  const handleUpdate = (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  /** 파일 선택 시 이미지 미리보기 업데이트 */
  const handleSelectPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setIngredients((prev) =>
        prev.map((item, i) => (i === 0 ? { ...item, image: base64 } : item)),
      );
    };
    reader.onerror = () => navigate('/fail');
    reader.readAsDataURL(file);
  };

  /** 저장 API 요청 */
  const handleSaveIngredients = async () => {
    if (!ingredients.length) {
      navigate('/fail');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ingredients: ingredients.map((item) => {
          let imageValue = item.image || '';
          if (imageValue.startsWith('data:image')) {
            const commaIndex = imageValue.indexOf(',');
            if (commaIndex !== -1) {
              imageValue = imageValue.slice(commaIndex + 1);
            }
          }

          return {
            name: item.name.trim(),
            amount: Number(item.quantity) || 0,
            unit: item.unit.toUpperCase(),
            expireDate: item.date
              ? new Date(item.date).toISOString()
              : new Date().toISOString(),
            imageUrl: imageValue || null,
          };
        }),
      };

      const res = await api.post('/ingredients', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: 15 * 1024 * 1024,
      });

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
    <div className="flex flex-col min-h-screen bg-white relative">
      <main className="flex-1 overflow-y-auto px-6 mt-[-2rem] pb-40">
        <div className="w-full max-w-[600px] mx-auto mt-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              분석 중입니다...
            </div>
          ) : (
            <IngredientEditList
              ingredients={ingredients.map((item) => ({
                ...item,
                image: item.image?.startsWith('data:image')
                  ? item.image
                  : item.image
                    ? `data:image/png;base64,${item.image}`
                    : 'https://placehold.co/245x163',
              }))}
              onUpdate={handleUpdate}
              onOpenCamera={() => setIsCameraOn(true)}
              onSelectPhoto={handleSelectPhoto}
            />
          )}
        </div>
      </main>

      {/* 하단 저장 버튼 */}
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

      {/* 카메라 모달 */}
      {isCameraOn && (
        <CameraModal
          onClose={() => setIsCameraOn(false)}
          onCaptured={(images: string[]) => {
            setIsCameraOn(false);
            if (images?.length) {
              void runOCR(images);
            } else {
              navigate('/fail');
            }
          }}
          redirectToLoading={false}
        />
      )}
    </div>
  );
}

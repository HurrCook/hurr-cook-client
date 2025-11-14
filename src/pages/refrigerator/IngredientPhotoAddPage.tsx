// src/pages/refrigerator/IngredientPhotoAddPage.tsx
import React, { useEffect, useMemo, useState, useRef } from 'react'; // ✅ useRef added
import { useLocation, useNavigate } from 'react-router-dom';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
// import CameraModal from '@/components/header/CameraModal'; // ❌ Removed CameraModal import
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import api from '@/lib/axios';
import DefaultGoodUrl from '@/assets/default_good.svg?url';
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
  type?: 'ingredient' | 'ocr';
}

export default function IngredientPhotoAddPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  const [ingredients, setIngredients] = useState<IngredientEditData[]>([]);
  const [loading, setLoading] = useState(false);
  // const [isCameraOpen, setIsCameraOpen] = useState(false); // ❌ Removed camera state
  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);

  // ✅ Ref for hidden camera input
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const base64Images = useMemo(
    () => location?.state?.base64_images ?? [],
    [location?.state],
  );
  const detectedItems = useMemo(
    () => location?.state?.detected ?? [],
    [location?.state],
  );
  const pageType = location?.state?.type ?? 'ingredient';

  /** ✅ 초기 데이터 세팅 */
  useEffect(() => {
    if (!location?.state) {
      console.warn(
        '[IngredientPhotoAddPage] location.state 없음 → 초기화만 수행',
      );
      setIngredients([]);
      return;
    }

    console.log('[IngredientPhotoAddPage] location.state:', location.state);
    console.log(`[IngredientPhotoAddPage] pageType: ${pageType}`);

    const { base64_images, detected } = location.state;
    if (
      (!base64_images || base64_images.length === 0) &&
      (!detected || detected.length === 0)
    ) {
      console.warn('[IngredientPhotoAddPage] 감지 데이터 없음 → 초기화만 수행');
      setIngredients([]);
      return;
    }

    const mapped: IngredientEditData[] = (detected ?? []).map((it, idx) => {
      const rawBase64 = it.imageUrl || base64_images[idx] || '';
      const imgSrc = rawBase64.startsWith('data:image')
        ? rawBase64
        : rawBase64.startsWith('http')
          ? rawBase64
          : rawBase64
            ? `data:image/png;base64,${rawBase64}`
            : DefaultGoodUrl;

      const finalImage = pageType === 'ocr' ? DefaultGoodUrl : imgSrc;

      return {
        id: idx + 1,
        name: it.name || '이름없음',
        image: finalImage,
        imageUrl:
          pageType === 'ocr'
            ? null
            : rawBase64.startsWith('data:image')
              ? rawBase64.split(',')[1]
              : rawBase64 || null,
        date: it.date || '',
        quantity: it.quantity || '1',
        unit: it.unit || 'EA',
      };
    });

    console.log('[IngredientPhotoAddPage] 감지된 재료 매핑 결과:', mapped);
    setIngredients(mapped);
  }, [detectedItems, base64Images, navigate, pageType]);

  /** ✅ 파일 -> base64 변환 */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** ✅ 갤러리에서 이미지 선택 */
  const handleSelectPhoto = async (file: File) => {
    const base64 = await fileToBase64(file);
    if (!selectedIngredientId) return;

    console.log('📸 선택된 이미지(base64 앞 80자):', base64.slice(0, 80));
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === selectedIngredientId
          ? { ...item, image: base64, imageUrl: base64.split(',')[1] }
          : item,
      ),
    );
  };

  // ✅ 카메라로 촬영된 이미지 처리
  const handleCameraFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedIngredientId) return;

    try {
      const dataUrl = await fileToBase64(file);
      console.log('📷 카메라 캡처 base64(앞 80자):', dataUrl.slice(0, 80));

      setIngredients((prev) =>
        prev.map((item) =>
          item.id === selectedIngredientId
            ? {
                ...item,
                image: dataUrl,
                imageUrl: dataUrl.split(',')[1],
              }
            : item,
        ),
      );
    } catch (error) {
      console.error('❌ 카메라 파일 처리 오류:', error);
    } finally {
      // Input 값을 초기화하여 같은 파일을 다시 선택할 수 있도록 함
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
      // 모달이 열려 있었다면 닫음 (선택적으로)
      setIsImageOptionOpen(false);
      setSelectedIngredientId(null);
    }
  };

  /** ✅ 이미지 옵션 모달 열기 */
  const handleOpenImageOptions = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsImageOptionOpen(true);
  };

  /** ✅ 카메라 실행 (CameraModal 대신 Input 클릭) */
  const handleLaunchCamera = () => {
    setIsImageOptionOpen(false);
    // ❌ setIsCameraOpen(true) 제거

    // ✅ 숨겨진 input을 클릭하여 네이티브 카메라 실행
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  /** ✅ 앨범 실행 */
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

  /** ✅ 저장 */
  const handleSaveIngredients = async () => {
    try {
      setLoading(true);
      console.log('📝 저장 전 ingredients:', ingredients);

      const payload = {
        ingredients: ingredients.map((item, idx) => {
          let imageBase64: string | null = null;
          if (item.image && item.image.startsWith('data:image')) {
            imageBase64 = item.image.split(',')[1];
          } else if (item.image) {
            imageBase64 = item.image;
          }

          console.log(
            `📦 [${idx}] imageBase64(앞 80자):`,
            imageBase64?.slice(0, 80),
          );

          // 💡 날짜 처리 (이전 대화에서 최종 안정화된 로직이 필요하지만, 여기서는 원본 유지)
          let expireDateIso: string;
          if (item.date) {
            expireDateIso = new Date(item.date).toISOString();
          } else {
            expireDateIso = new Date().toISOString();
          }

          return {
            name: item.name.trim(),
            amount: Number(item.quantity) || 0,
            unit: item.unit.toUpperCase(),
            expireDate: expireDateIso,
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
        console.error('❌ [POST /ingredients 오류]', err.response.data);
      else console.error('❌ 요청 실패:', err.message);
      navigate('/fail');
    } finally {
      setLoading(false);
    }
  };

  /** ✅ state 없으면 렌더 차단 */
  if (!location?.state) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* ✅ 숨겨진 카메라 Input (카메라 실행 역할) */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // 후면 카메라 즉시 실행
        ref={cameraInputRef}
        onChange={handleCameraFileChange}
        style={{ display: 'none' }}
      />

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
              onOpenCamera={handleOpenImageOptions}
              onSelectPhoto={handleSelectPhoto}
            />
          )}
        </div>
      </main>

      {/* 이미지 옵션 모달 */}
      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera} // ✅ Input 클릭으로 연결됨
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* ❌ 카메라 모달 제거
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={(dataUrl: string) => {
            // ... capture logic ...
            setIsCameraOpen(false);
          }}
        />
      )}
      */}

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4 shadow-inner">
        <button
          type="button"
          onClick={handleSaveIngredients}
          disabled={loading}
          className={`w-[90%] max-w-[600px] py-3 rounded-lg font-medium transition-all shadow-md ${
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
